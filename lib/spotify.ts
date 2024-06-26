import axios from "axios";
import type {IronSession} from "iron-session";



async function refreshAccessToken(session: IronSession){
	if(!session.tokens)
		return;
	const params = new URLSearchParams();
	params.append("grant_type", "refresh_token");
	params.append("refresh_token", session.tokens.refresh);
	const spotifyResp = await axios.post("https://accounts.spotify.com/api/token", params.toString(), {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: "Basic " + (Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"))
		}
	});
	const {data} = spotifyResp;
	session.tokens.access = data.access_token;
	session.tokens.expiry = Date.now() + data.expires_in * 1000;
	await session.save();
}

function accessTokenHasExpired(session: IronSession){
	if(!session.tokens)
		return true;
	return session.tokens.expiry <= Date.now();
}

const getMe = (session: IronSession, forceReload?: boolean): Promise<User> => refreshWrapper(session, async () => {
	if(!forceReload && session.user)
		return session.user;
	
	const resp = await axios.get("https://api.spotify.com/v1/me", {
		headers: {
			//@ts-ignore
			Authorization: `Bearer ${session.tokens.access}`
		}
	});
	const {display_name} = resp.data;
	const imgURL = resp.data.images[0].url;
	session.user = {name: display_name, imgURL};
	await session.save();
	return {name: display_name, imgURL};
});

async function refreshWrapper(session: IronSession, apiCall: Function){
	if(accessTokenHasExpired(session)){
		await refreshAccessToken(session);
		await getMe(session, true);
	}
	return apiCall();
}

interface Artist {
	id: string,
	name: string,
	genres: string[],
	imageURL: string
}

interface Track {
	id: string,
	artists: Array<{name: string, id: string}>,
	title: string,
	album: {title: string, imageURL: string, id: string}
	previewURL: string
}

const timeRanges = ["short_term", "medium_term", "long_term"] as const;
type TimeRangeValue = typeof timeRanges[number];
const isTimeRange = (x: any): x is TimeRangeValue => timeRanges.includes(x);
const TimeRanges = timeRanges.join(" OR ");

const itemTypes = ["artists", "tracks"] as const;
type ItemType = typeof itemTypes[number];
const isItemType = (x: any): x is ItemType => itemTypes.includes(x);

const getTop = (session: IronSession, type: ItemType, options?: {timeRange?: TimeRangeValue, number?: number}) => refreshWrapper(session, async () => {
	//default valuse: medium_term, top 20
	const query = new URLSearchParams();
	if(options){
		if(options.timeRange)
			query.append("time_range", options.timeRange)
		if(options.number)
			query.append("limit", options.number.toString());
	}
	const resp = await axios.get(`https://api.spotify.com/v1/me/top/${type}?${query.toString()}`, {
		headers: {
			//@ts-ignore
			Authorization: `Bearer ${session.tokens.access}`
		}
	});
	let items;
	console.log(resp.data)
	if(type === "artists")
		items = resp.data.items.map((e: any):Artist => {return {id: e.id, name: e.name, genres: e.genres, imageURL: e.images[0].url}});
	if(type === "tracks")
		items = resp.data.items.map((e: any):Track => {
			return({
				id: e.id,
				artists: e.artists.map((f: any) => {return {name: f.name, id: f.id}}),
				title: e.name,
				album: {id: e.album.id, title: e.album.name, imageURL: e.album.images[0].url},
				previewURL: e.preview_url
			});
		});
	return items;
});
//TODO: imageSizes?

const getTopArtists = (session: IronSession, options?: {timeRange?: TimeRangeValue, number?: number}): Promise<Artist[]> => {
	return getTop(session, "artists", options);
}

const getTopTracks = (session: IronSession, options?: {timeRange?: TimeRangeValue, number?: number}): Promise<Track[]> => {
	return getTop(session, "tracks", options);
}

export {
	TimeRanges,
	isTimeRange,
	isItemType,
	getMe,
	getTopArtists,
	getTopTracks
}

export type {User, Artist, Track, TimeRangeValue, ItemType};
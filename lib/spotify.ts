import axios from "axios";
import type {IronSession} from "iron-session";

interface User {
	name: string,
	imgURL: string
}

declare module "iron-session" {
	interface IronSessionData {
		tokens?: {
			access: string,
			expiry: number
			refresh: string
		},
		user?: User
	}
}

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
	console.log("getMe(): from WEB API");
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

const getTopArtists = (session: IronSession): Promise<Artist[]> => refreshWrapper(session, async () => {
	//default valuse: medium_term, top 20
	const resp = await axios.get("https://api.spotify.com/v1/me/top/artists", {
		headers: {
			//@ts-ignore
			Authorization: `Bearer ${session.tokens.access}`
		}
	});
	const items: Artist[] = resp.data.items.map((e: any) => {return {id: e.id, name: e.name, genres: e.genres, imageURL: e.images[0].url}});
	return items;
});

export {
	getMe,
	getTopArtists,
}

export type {User, Artist};
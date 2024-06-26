import type { NextApiRequest, NextApiResponse } from "next";
import { didAccessTokenExpire, getTopArtists, getTopTracks, ItemType, refreshAccessToken, TimeRange} from "lib/spotify";
import { getSession } from "lib/session";

const timeRanges = [TimeRange.ShortTerm, TimeRange.MediumTerm, TimeRange.LongTerm];


function isTimeRange(t: string | string[] | undefined){
	console.log("time: " + t)
	if(!t)
		return false;

	return timeRanges.includes(t as TimeRange);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession(req, res);
	const number = parseInt(req.query.number as string) || 20;
	if(number < 1 || number > 50)
		return res.status(400).send("number has to have an integer value between 1 and 50");
	
	const type = req.query.type;
	if(type !== ItemType.Tracks && type !== ItemType.Artists)
		return res.status(400).send(`type has to have the value of '${ItemType.Tracks}' or '${ItemType.Artists}'`);

	const time = req.query.time;
	if(!isTimeRange(time))
		return res.status(400).send(`time has to have the value of ${timeRanges.join()}`);

	if(!session || !session.token)
		return res.status(401).send(`no access token provided`);

	if(didAccessTokenExpire(session.token)){
		try {
			const newToken = await refreshAccessToken(session.token.refresh);
			if(newToken){
				session.token = newToken;
				await session.save(); 
			}
		}catch(e){
			return res.status(500).send("could not refresh access token.");
		}
	}
	
	if(type == "tracks")
		return res.send(await getTopTracks(session.token, {number, timeRange: time as TimeRange}));

	return res.send(await getTopArtists(session.token, {number, timeRange: time as TimeRange}));
	
}


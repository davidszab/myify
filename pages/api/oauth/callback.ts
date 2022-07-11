import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { withSessionRoute } from "lib/session-wrapper";

async function handler(req: NextApiRequest, res: NextApiResponse){
	const {code} = req.query;
	const { referer } = req.headers;
	if(!code)
		return res.status(400).send("Bad request");
	const params = new URLSearchParams();
	params.append("code", code.toString());
	params.append("redirect_uri", `${referer}api/oauth/callback`);
	params.append("grant_type", "authorization_code");
	const spotifyResp = await axios.post("https://accounts.spotify.com/api/token", params.toString(), {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: "Basic " + (Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"))
		}
	});
	const {data} = spotifyResp;
	req.session.tokens = {
		access: data.access_token,
		expiry: Date.now() + data.expires_in * 1000,
		refresh: data.refresh_token
	}
	await req.session.save();
	res.redirect("/");
}

export default withSessionRoute(handler);
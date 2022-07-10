import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const {SPOTIFY_CLIENT_ID} = process.env;
	if(!SPOTIFY_CLIENT_ID)
		return res.status(400).send("Missing SPOTIFY CLIENT ID.");
	const scope = "user-top-read";
	const redirect_uri = process.env.NODE_ENV == "production" ? "https://myify.davidszabo.hu/api/oauth/callback" : "http://localhost:3000/api/oauth/callback";
	const params = new URLSearchParams();
	params.append("response_type", "code");
	params.append("client_id", SPOTIFY_CLIENT_ID.toString());
	params.append("scope", scope);
	params.append("redirect_uri", redirect_uri);
	//params.append("show_dialog", "true");
	res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

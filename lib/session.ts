import { getIronSession, SessionOptions } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

const options: SessionOptions = {
	cookieName: "session",
	password: process.env.SESSION_PASSWORD || "",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production"
	}
}

interface User {
	name: string,
	imgURL: string
}

interface SpotifyToken {
	access: string,
	expiry: number,
	refresh: string
}

interface SessionData {
	token?: SpotifyToken,
	user?: User
}

export function getSession(req: NextApiRequest, res: NextApiResponse){
	return getIronSession<SessionData>(req, res, options);
}

export type {User, SpotifyToken, SessionData}

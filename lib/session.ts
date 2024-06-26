import { getIronSession, SessionOptions } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { SpotifyToken, User } from "./spotify";

const options: SessionOptions = {
	cookieName: "session",
	password: process.env.SESSION_PASSWORD || "",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production"
	}
}

interface SessionData {
	token?: SpotifyToken,
	user?: User
}

export function getSession(req: NextApiRequest, res: NextApiResponse){
	return getIronSession<SessionData>(req, res, options);
}

export type {SpotifyToken, SessionData}

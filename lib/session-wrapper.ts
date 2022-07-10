import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import type { IronSessionOptions } from "iron-session";
import {
	GetServerSidePropsContext,
	GetServerSidePropsResult,
	NextApiHandler
} from "next";

const sessionOptions: IronSessionOptions = {
	password: process.env.SESSION_PASSWORD || "abc",
	cookieName: "session",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production"
	}
};

export function withSessionRoute(handler: NextApiHandler) {
	return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr<
	P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
	handler: (
		context: GetServerSidePropsContext
	) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
	return withIronSessionSsr(handler, sessionOptions);
}
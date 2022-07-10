import type { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "lib/session-wrapper";

function handler(req: NextApiRequest, res: NextApiResponse) {
	req.session.destroy();
	res.redirect("/");
}

export default withSessionRoute(handler);
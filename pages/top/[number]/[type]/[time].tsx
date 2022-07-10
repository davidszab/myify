import type { NextPage } from "next";
import {getMe, getTopArtists} from "lib/spotify";
import { withSessionSsr } from "lib/session-wrapper";
import { useRouter } from "next/router";

interface HomeProps {
	artists: any
}

const Home: NextPage<HomeProps> = ({artists}) => {
	const router = useRouter();
	return (
		<main>
			{router.query.type} - {router.query.number} - {router.query.time}
		</main>
	);
};

/*export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({req}) {
		const tokens = req.session.tokens;
		if(!tokens){
			return {
				props: {
					user: null
				}
			}
		}
		const user = await getMe(req.session);
		const topArtists = await getTopArtists(req.session);
		return {
			props: {
				artists: topArtists
			}
		}
	}
)
*/
export default Home;

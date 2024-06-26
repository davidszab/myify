import type { NextPage } from "next";
import style from "styles/pages/home.module.css";
import { useRouter } from "next/router";
import Footer from "components/footer";
import Head from "next/head";
import { getSession } from "lib/session";

const Home: NextPage = () => {
	const router = useRouter();
	return (
		<>
			<Head>
				<title>Myify</title>
			</Head>
			<main>
				<div className="box" style={{maxWidth: "500px", padding: "20px"}}>
					<div className={style.brand}>
						<h1>Myify</h1>
						<h2>Top songs and artists from your Spotify account</h2>
					</div>
					<p>With Myify you have the option to look at the data gathered by Spotify.
						Click the button below to sign in with your Spotify account and view the
						songs and artists you listen to the most.
					</p>
					<div className={style["btn-wrapper"]}>
						<button className="btn" onClick={() => router.replace("/api/oauth/login")}>Sign in with Spotify</button>
					</div>
					<p className={style["small-letters"]}>This service can only read the data provided by Spotify. By clicking
						the button, you will be taken to the official Spotify website to
						sign in. Your email address and password are not shared with us.
					</p>
					<div className={style.footer}>
						<p>Spotify is a registered trademark of Spotify AB.</p>
					</div>
				</div>
				<Footer/>
			</main>
		</>
	);
};

//@ts-ignore
export async function getServerSideProps({req, res}) {
	const session = await getSession(req, res);
	if(session.token) {
		return {
			redirect: {
				destination: "/top"
			}
		}
	}
	return {props: {}}
}

/*export const getServerSideProps = withSessionSsr(
//@ts-ignore
	async function getServerSideProps({req}) {
		if(req.session.tokens)
			return {
				redirect: {
					destination: "/top"
				}
			}
		return {props: {}};
	}
)*/

export default Home;

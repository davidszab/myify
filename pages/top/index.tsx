import type { NextPage } from "next";


import CustomList from "components/custom-list";
import { useState } from "react";
import Footer from "components/footer";
import AccountBar from "components/account-bar";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "lib/session";
import { User, getUser } from "lib/spotify";

const TopPage: NextPage<{user: User}> = ({user}) => {
	const [number, setNumber] = useState("10");
	const [type, setType] = useState("artists");
	const [time, setTime] = useState("medium_term");
	const router = useRouter();
	const redirectToMatchingURL = () => {
		router.push(`/top/${number}/${type}/${time}`);
	}
	return (
		<>
			<Head>
				<title>Myify</title>
			</Head>
			<main>
			<div className="box" style={{textAlign: "center"}}>
				<AccountBar user={user}/>
				<h1>Myify</h1>
				<CustomList name="number" options={["5", "10", "20"]} selectedOption={number} handleChange={(v) => setNumber(v)}/>
				<CustomList name="type" options={["artists", "tracks"]} selectedOption={type} handleChange={(v) => setType(v)}/>
				<CustomList name="time" options={["short_term", "medium_term", "long_term"]} optionLabels={["1 month", "6 months", "all time"]} selectedOption={time} handleChange={(v) => setTime(v)}/>
				<button className="btn" onClick={redirectToMatchingURL}>Show me</button>
			</div>
			<Footer/>
		</main>
		</>
		
	);
};

/*function sentenceGenerator(number: string, type: string, time: string){
	if(time === "long")
		return `Show me the all time top ${number} ${type}.`;
	else
		return `Show me the top ${number} ${type} from the past ${time === "short" ? "month" : "6 months"}.`;
}*/

export async function getServerSideProps({req, res}){
	const session = await getSession(req, res);
	if(!session || !session.token) {
		return {
			redirect: {
				destination: "/"
			}
		}
	}

	const user = await getUser(session.token);
	return {
		props: {
			user
		}
	}
}

export default TopPage;

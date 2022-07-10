import type { NextPage } from "next";
import { withSessionSsr } from "lib/session-wrapper";
import { getMe, User } from "lib/spotify";
import CustomList from "components/custom-list";
import { useState } from "react";
import Footer from "components/footer";
import AccountBar from "components/account-bar";

const TopPage: NextPage<{user: User}> = ({user}) => {
	const [number, setNumber] = useState("10");
	const [type, setType] = useState("artists");
	const [time, setTime] = useState("mid");
	return (
		<main>
			<div className="box" style={{textAlign: "center"}}>
				<AccountBar user={user}/>
				<h1>Myify</h1>
				<CustomList name="number" options={["5", "10", "20"]} selectedOption={number} handleChange={(v) => setNumber(v)}/>
				<CustomList name="type" options={["artists", "tracks"]} selectedOption={type} handleChange={(v) => setType(v)}/>
				<CustomList name="time" options={["short", "mid", "long"]} optionLabels={["1 month", "6 months", "all time"]} selectedOption={time} handleChange={(v) => setTime(v)}/>
				<button className="btn">Show me</button>
			</div>
			<Footer/>
		</main>
	);
};

/*function sentenceGenerator(number: string, type: string, time: string){
	if(time === "long")
		return `Show me the all time top ${number} ${type}.`;
	else
		return `Show me the top ${number} ${type} from the past ${time === "short" ? "month" : "6 months"}.`;
}*/
export const getServerSideProps = withSessionSsr(
//@ts-ignore
	async function getServerSideProps({req}) {
		if(!req.session.tokens){
			return {
				redirect: {
					destination: "/"
				}
			}
		}

		const me = await getMe(req.session);
		return {
			props: {
				user: me
			}
		}
	}

)

export default TopPage;

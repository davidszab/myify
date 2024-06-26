//@ts-nocheck
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Loading from "components/top-page/loading";
import { useEffect, useState } from "react";
import axios from "axios";
import ElementCard from "components/top-page/element-card";
import { ItemType } from "lib/spotify";

const Home: NextPage = () => {
	const router = useRouter();
	const [data, setData] = useState();
	const {type, number, time} = router.query;

	useEffect(() => {
		if(type && number && time){
			console.log({type, number, time})
			axios.get(`/api/top/${number}/${type}/${time}`).then((e) => setData(e.data));
		}
	}, [router]);
	//todo: check before
	// if(!isTimeRange(time) || !isItemType(type))
		// return null;
	
	
	//todo: artist or track?
	const isArtist = type == "artists";
	return (
		<main style={{maxWidth: "750px"}}>
			{!data && <Loading type={type} number={number} time={time}/>}
			<ol>
				{data && data.map((e) => <ElementCard key={e.id} artist={isArtist ? e : null} track={isArtist ? null : e}/>)}

			</ol>
		</main>
	);
};

export default Home;

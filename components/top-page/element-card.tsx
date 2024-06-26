import {Artist, Track} from "lib/spotify";
import style from "styles/components/element-card.module.css";

interface ElementCardProps {
	artist?: Artist,
	track?: Track
}

export default function ElementCard({artist, track}: ElementCardProps){
	if(artist)
		return(<li>
			<div className={style.card}>
				<div className={style["img-box"]}>
					<img src={artist.imageURL} alt={artist.name}/>
				</div>
				<div className={style["text-box"]}>
					<h1>{artist.name}</h1>
					{artist.genres.toString()}
				</div>
			</div>
		</li>)
	return(
		<li>
			<div className={style.card}>
			<div className={style["img-box"]}>
			<img src={track?.album.imageURL} alt={track?.album.title}/>
				</div>
				<div className={style["text-box"]}>
					<h1>{track?.title}</h1>
					<h2>{track?.artists.map((e) => e.name).join()}</h2>
				</div>
			</div>
		</li>
	)
}
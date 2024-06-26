import { ItemType, TimeRange } from "lib/spotify";

function sentenceGenerator(number: number, type: ItemType, time: TimeRange){
	if(time === "long_term")
		return `Your all time top ${number} ${type} coming right up.`;
	else
		return `Your top ${number} ${type} from the past ${time === "short_term" ? "month" : "6 months"} coming right up.`;
}

interface LoadingProps {
	type: ItemType,
	number: number,
	time: TimeRange
}

const Loading = ({number, type, time}: LoadingProps) => {
	return <div>
		<h1>{sentenceGenerator(number, type, time)}</h1>
	</div>
}

export default Loading;
import type { User } from "lib/spotify";
import style from "styles/components/account-bar.module.css";
import Link from "next/link";

const AccountBar = ({user}: {user: User}) => {
	return <div className={style.bar}>
		<img src={user.imgURL} alt="Your profile picture" />
		<div>
			<p>{user.name}</p>
			<Link href="/api/oauth/logout">Sign out</Link>
		</div>
	</div>
}

export default AccountBar;
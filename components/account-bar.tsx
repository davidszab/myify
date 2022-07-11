import type { User } from "lib/spotify";
import style from "styles/components/account-bar.module.css";

const AccountBar = ({user}: {user: User}) => {
	return <div className={style.bar}>
		<img src={user.imgURL} alt="Your profile picture" />
		<div>
			<p>{user.name}</p>
			<a href="/api/oauth/logout">Sign out</a>
		</div>
	</div>
}

export default AccountBar;
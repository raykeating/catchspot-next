import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

type Props = {};

export default function Login({}: Props) {

	const router = useRouter();

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	async function loginUser() {
		await signIn("credentials", {
			identifier: email,
			password: password,
			redirect: false,
		}).then((res) => {

			if (res && !res.ok) {
				toast.error(res.error);
			} else {
				router.push("/profile");
				toast.success("Login successful");
			}
		});
	}

	return (
		<div className="w-full h-screen flex items-center justify-center">
			<div className="flex flex-col gap-3 items-center">
				<h1 className="text-xl font-semibold">Log In</h1>
				<input type="text" className="p-2 rounded-lg border" placeholder="email@domain.com" onChange={e => setEmail(e.target.value)} />
                <input type="password" className="p-2 rounded-lg border" placeholder="password" onChange={e => setPassword(e.target.value)} />
                <button className="btn sm w-full text-sm" onClick={loginUser}>Log in with email</button>
			</div>
		</div>
	);
}

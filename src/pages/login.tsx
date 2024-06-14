import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

type Props = {};

export default function Login({}: Props) {
	const router = useRouter();

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	async function loginUser(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

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

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.id === "email") {
			setEmail(e.target.value);
		} else if (e.target.id === "password") {
			setPassword(e.target.value);
		}
	}

	return (
		<div className="flex h-screen items-center justify-center px-4">
			<div className="flex flex-col items-center max-w-[600px] w-full mt-8 mb-12">
				<h1 className="text-xl font-bold">Log In</h1>
				<p className="text-slate-600 font-light text-lg mb-8 text-center">
					Learn, share, and connect with other anglers
				</p>
				<Image
					src="/images/trout.jpg"
					alt=""
					className="h-28 w-full object-cover rounded-xl mb-8"
					width={1920}
					height={1080}
				/>
				<form className="w-full" onSubmit={loginUser}>
					<div className="flex flex-col gap-1 w-full mb-5">
						<label htmlFor="email">Email address</label>
						<input
							type="email"
							id="email"
							className="p-2 rounded-lg border"
							placeholder="email@domain.com"
							onChange={handleChange}
							required
						/>
					</div>
					<div className="flex flex-col gap-1 w-full mb-5">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							className="p-2 rounded-lg border"
							placeholder="Password"
							onChange={handleChange}
							required
						/>
					</div>
					<button className="btn w-full">Log In</button>
				</form>

				<p className="text-slate-600 mt-6 text-center">
					Don&apos;t have an account?{" "}
					<Link href="/signup" className="underline font-medium">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}

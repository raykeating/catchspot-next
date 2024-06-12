import React, { useEffect } from "react";
import Image from "next/image";
import createAccount from "@/lib/createAccount";
import { Angler } from "@/types/Angler";

type Props = {};

export default function Signup({}: Props) {
	const [user, setUser] = React.useState<Angler>({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
		profilePicture: null,
		location: "",
	});

	async function handleCreateAccount(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		createAccount({
			user: {
				email: user.email,
				password: user.password,
				firstName: user.firstName,
				lastName: user.lastName,
				profilePicture: user.profilePicture,
				location: user.location,
			},
		});
	}

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		setUser({
			...user,
			[e.target.id]: e.target.value,
		});
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.target.files) return;
		const file = e.target.files[0];
		setUser({
			...user,
			profilePicture: file,
		});
	}

	return (
		<div className="flex mt-24 items-center justify-center">
			<div className="flex flex-col items-center w-[600px] mt-8 mb-12">
				<h1 className="text-xl font-bold">Create an Account</h1>
				<p className="text-slate-600 font-light text-lg mb-8">
					Share your catches with the world
				</p>
				<Image
					src="/images/trout.jpg"
					alt=""
					className="h-28 w-full object-cover rounded-xl mb-8"
					width={1920}
					height={1080}
				/>
				<form className="w-full" onSubmit={handleCreateAccount}>
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
					<div className="flex gap-6 w-full mb-5">
						<div className="flex flex-col gap-1 w-full">
							<label htmlFor="firstName">First name</label>
							<input
								type="text"
								id="firstName"
								className="p-2 rounded-lg border"
								placeholder="Jane"
								onChange={handleChange}
								required
							/>
						</div>
						<div className="flex flex-col gap-1 w-full">
							<label htmlFor="lastName">Last name</label>
							<input
								type="text"
								id="lastName"
								className="p-2 rounded-lg border"
								placeholder="Smitherton"
								onChange={handleChange}
								required
							/>
						</div>
					</div>
					<div className="flex flex-col gap-1 w-full mb-5">
						<>
							<label htmlFor="file-input">
								Profile picture
							</label>
							<input
								type="file"
								name="file-input"
								id="file-input"
								className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
                                file:bg-gray-50 file:border-0
                                file:me-4
                                file:py-3 file:px-4"
								multiple={false}
								onChange={handleFileChange}
								required
							/>
						</>
					</div>
					<div className="flex flex-col gap-1 w-full mb-5">
						<label htmlFor="location">Your Location</label>
						<input
							type="text"
							id="location"
							className="p-2 rounded-lg border"
							placeholder="City, State, Country"
							onChange={handleChange}
							required
						/>
					</div>
					<button className="btn w-full">
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
}

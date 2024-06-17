import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import optimizedImage from "@/lib/util/optimizedImg";

type Props = {};

export default function Navbar({}: Props) {
	const {
		data: session,
		status,
	}: {
		data: any;
		status: string;
	} = useSession();

	const router = useRouter();

	const pathName = router.pathname;

	const handleSignOut = () => {
		toast.success("Logging out...");
		router.push("/");
		// after 500ms, sign the user out
		setTimeout(() => {
			signOut();
		}, 750);
	};

	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="flex w-full justify-between items-center px-12 py-4 shadow fixed top-0 z-50 bg-slate-50 md:bg-white h-20">
			<Link
				className="font-black text-xl p-2 rounded-lg hover:bg-slate-50 -translate-x-3"
				href="/"
			>
				Catch<span className="text-slate-500 font-black">Spot</span>
			</Link>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="h-10 w-10 flex items-center justify-center  rounded-lg translate-x-4 md:hidden"
			>
				<i
					className={`fa-solid fa-${
						isOpen ? "x !text-sm" : "bars"
					} text-lg text-slate-800`}
				></i>
			</button>

			<div
				className={`px-8 flex gap-6 items-center max-md:absolute max-md:top-20 max-md:font-bold max-md:left-0 max-md:py-8 max-md:bg-white max-md:shadow max-md:z-10 max-md:flex-col max-md:justify-center max-md:w-full transition-all origin-top ${
					isOpen
						? "max-md:scale-100 max-md:opacity-100 max-md:visible"
						: "max-md:scale-75 max-md:opacity-0 max-md:invisible"
				}`}
			>
				<Link
					href="/catches"
					className={`max-md:w-[80%] w-full text-center px-3 py-3 md:py-2 transition-colors hover:bg-slate-50 rounded-xl ${
						pathName === "/catches" && "bg-slate-50 font-semibold"
					}`}
				>
					Catches
				</Link>
				<Link
					href="/species"
					className={`max-md:w-[80%] w-full text-center px-3 py-3 md:py-2 transition-colors hover:bg-slate-50 rounded-xl ${
						pathName === "/species" && "bg-slate-50 font-semibold"
					}`}
				>
					Species
				</Link>
				{status === "authenticated" ? (
					<button
						onClick={handleSignOut}
						className="max-md:w-[80%] w-full text-center px-3 py-3 md:py-2 transition-colors hover:bg-slate-50 rounded-xl"
					>
						Sign Out
					</button>
				) : (
					<Link
						href="/login"
						className={`max-md:w-[80%] w-full text-center px-3 py-3 md:py-2 transition-colors hover:bg-slate-50 rounded-xl ${
							pathName === "/login" && "bg-slate-50 font-semibold"
						}`}
					>
						Log In
					</Link>
				)}
				{status === "authenticated" ? (
					<div className="gap-3 flex items-center">
						<Link href="/new-catch" className="btn max-md:w-[80%] text-center whitespace-nowrap">
							New Catch
						</Link>
						<Link
							href="/profile"
							className="flex flex-col justify-center gap-2 items-center flex-shrink-0"
						>
							<Image
								src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${optimizedImage(
									session?.user?.anglerProfile?.profilePicture
								)}`}
								alt="Profile Picture"
								width={70}
								height={70}
								className="rounded-full w-[3rem] h-[3rem] aspect-square shadow hover:scale-105 transition-transform object-cover"
							/>
						</Link>
					</div>
				) : (
					<div className="w-[70%]">
						<Link href="/signup" className="btn !py-3 whitespace-nowrap">
							Sign Up
						</Link>
					</div>
				)}
			</div>
			<div
				className={`absolute top-20 left-0 h-screen w-full bg-slate-600/30 backdrop-blur ${
					isOpen ? "visible opacity-100" : "invisible opacity-0"
				} transition-all md:hidden
			}`}
			></div>
		</nav>
	);
}

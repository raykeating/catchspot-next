import Link from "next/link";
import React from "react";
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

    console.log(session);

    const router = useRouter();

    const handleSignOut = () => {
        toast.success("Logging out...");
        router.push("/");
        // after 500ms, sign the user out
        setTimeout(() => {
            signOut();
        }, 750);
    };

	return (
		<nav className="flex w-full justify-between items-center px-12 py-6 shadow fixed top-0 z-50 bg-white h-24">
			<p className="font-black text-xl">Catch<span className="text-slate-500 font-black">Spot</span></p>
			<div className="flex gap-8 items-center">
                <Link href="/catches">Catches</Link>
                <Link href="/species">Species</Link>
                {
                    status === "authenticated" ? (
                        <button onClick={handleSignOut}>Sign Out</button>
                    ) : (
                        <Link href="/login">Log In</Link>
                    )
                }
                {
                    status === "authenticated" ? (
                        <div className="gap-3 flex items-center">
                            <Link href="/new-catch" className="btn">New Catch</Link>
                            <Link href="/profile" className="flex flex-col justify-center gap-2 items-center">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${optimizedImage(session?.user?.anglerProfile?.profilePicture)}`}
                                    alt="Profile Picture"
                                    width={70}
                                    height={70}
                                    className="rounded-full w-[3rem] h-[3rem] aspect-square border-2 border-slate-600"
                                />
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <Link href="/signup" className="btn !py-3">Sign Up</Link>
                        </div>
                    )
                }
			</div>
		</nav>
	);
}

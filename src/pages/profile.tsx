import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import VerticalCatchCard from "@/components/VerticalCatchCard";
import autoAnimate from "@formkit/auto-animate";
import optimizedImage from "@/lib/util/optimizedImg";
import Link from "next/link";

type Props = {
	profile: any;
	myCatches: any;
	species: any;
};

export default function Profile({ profile, myCatches, species }: Props) {
	species = species.map((speciesItem: any) => {
		const count = myCatches.filter(
			(catchItem: any) =>
				catchItem.attributes.species.data.id === speciesItem.id
		).length;
		const longest = Math.max(
			...myCatches
				.filter(
					(catchItem: any) =>
						catchItem.attributes.species.data.id === speciesItem.id
				)
				.map((catchItem: any) => catchItem.attributes.length)
		);
		return { ...speciesItem, count, longest };
	});

  const loggedSpeciesCount = species.filter((speciesItem: any) => speciesItem.count > 0).length;

	const [tab, setTab] = useState<"catches" | "species">("species");

	const parentContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		parentContainer.current && autoAnimate(parentContainer.current);
	}, [parentContainer]);

	return (
		<div className="max-w-[1000px] mx-auto mt-36">
			<div className="w-full justify-between flex items-end">
				<div className="flex gap-3 items-center mb-8">
					<Image
						src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${optimizedImage(
							profile.anglerProfile.profilePicture
						)}`}
						alt=""
						className="h-16 w-16 object-cover rounded-full"
						height={300}
						width={300}
					/>
					<div>
						<h1 className="text-3xl font-bold">
							{profile.anglerProfile.firstName} {profile.anglerProfile.lastName}
						</h1>
						<p className="text-slate-600">{profile.anglerProfile.location}</p>
					</div>
				</div>
				<div className="flex gap-0 mb-8 bg-slate-200 w-fit p-1.5 rounded-xl h-fit">
					<button
						className={`p-1 px-4 rounded-lg bg-slate-100 transition-all origin-left ${
							tab === "catches"
								? "opacity-100 bg-slate-50"
								: "scale-95 bg-opacity-50 opacity-80 hover:opacity-90"
						}`}
						onClick={() => setTab("catches")}
					>
						Catches
					</button>
					<button
						className={`p-1 px-4 rounded-lg bg-slate-100 transition-all origin-right ${
							tab === "species"
								? "opacity-100 bg-slate-50"
								: "scale-95 bg-opacity-50 opacity-80 hover:opacity-90"
						}`}
						onClick={() => setTab("species")}
					>
						Species
					</button>
				</div>
			</div>

			<div ref={parentContainer}>
				{tab === "catches" && (
					<React.Fragment key="catches">
						{myCatches.length > 0 && (
							<div className="flex flex-col mb-5">
								<p className="text-2xl font-semibold">Your Catches</p>
								<p className="text-slate-500">
									{myCatches.length} Catches Logged
								</p>
							</div>
						)}
						<div className="grid grid-cols-2 gap-12 mb-12">
							{myCatches.map((catchItem: any) => {
								return (
									<VerticalCatchCard key={catchItem.id} catchItem={catchItem} />
								);
							})}
						</div>
						{/* empty state */}
						{myCatches.length === 0 && (
							<div className="flex flex-col items-center justify-center h-[45vh]">
								<p className="text-2xl font-semibold">No Catches Yet</p>
								<p className="text-slate-500">
									<Link href="/new-catch" className="underline font-medium">
										Log your first catch
									</Link>{" "}
									to see it here
								</p>
							</div>
						)}
					</React.Fragment>
				)}
				{tab === "species" && (
					<React.Fragment key="species">
						<div className="flex flex-col mb-6">
							<p className="text-2xl font-semibold">Your Species</p>
							<p className="text-slate-500">{loggedSpeciesCount}/{species.length} Species Logged</p>
						</div>
						<div className="grid grid-cols-3 gap-10 mb-12">
							{species.map((speciesItem: any) => {
								return (
									<div className="flex gap-4 items-center" key={speciesItem.id}>
										<Image
											src="/images/trout.jpg"
											alt=""
											width={400}
											height={400}
											className={`rounded-lg object-cover w-36 h-20 ${
												species.count > 0 ? "none" : "grayscale"
											}`}
										/>
										<div className="flex flex-col">
											<p className="font-bold text-[1.05rem] mb-1">
												{speciesItem.attributes.name}
											</p>
											<p className="text-slate-600 mb-1">
												{species.count > 0 ? species.count : "Not"} Logged
											</p>
											<p className="text-slate-600 mb-1 text-sm">
												{species.longest > 0 ? (
													`Personal Best - ${species.longest}"`
												) : (
													<>
														<Link
															target="_blank"
															href={`/species/${speciesItem.id}`}
															className="text-slate-600 hover:underline"
														>
															Learn More{" "}
															<i aria-hidden className="fa-solid fa-external-link text-[0.5rem] -translate-y-[0.1rem]"></i>
														</Link>
													</>
												)}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</React.Fragment>
				)}
			</div>
		</div>
	);
}

export async function getServerSideProps(context: any) {
	const session = await getServerSession(
		context.req,
		context.res,
		nextAuthOptions
	);

	const profilePopulateParams = [
		"anglerProfile",
		"anglerProfile.profilePicture",
	];

	const profileRes = await fetch(
		`${
			process.env.NEXT_PUBLIC_STRAPI_API_URL
		}/users/me?populate=${profilePopulateParams.join(",")}`,
		{
			headers: {
				Authorization: `Bearer ${session?.strapiAccessToken}`,
			},
		}
	);

	const profile = await profileRes.json();

	const myCatchesRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/catches?populate=angler.profilePicture,species,location,lure,image&filters[angler][id][$eq]=${profile.anglerProfile.id}&sort=id:desc`
	);

	const myCatches = await myCatchesRes.json();

	const speciesRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/species?populate=*`
	);

	const species = await speciesRes.json();

	return {
		props: {
			profile,
			myCatches: myCatches.data,
			species: species.data,
		},
	};
}

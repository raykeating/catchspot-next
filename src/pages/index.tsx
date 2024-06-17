import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import SpeciesCard from "@/components/SpeciesCard";
import VerticalCatchCard from "@/components/VerticalCatchCard";

type Props = {
	species: any;
	catches: any;
};

export default function Home({ species, catches }: Props) {

	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState("");

	function submitOnEnter(e: React.KeyboardEvent<HTMLInputElement>) {
		// if the key is Enter, redirect to the search page
		if (e.key === "Enter") {
			router.push(`/catches?searchTerm=${searchTerm}`);
		}
	}

	return (
		<div className="mt-20">
			<div className="max-w-[1100px] mx-auto px-3">
				<p className="font-black text-[2rem] md:text-[3rem] rounded-lg text-center mt-64">
					Catch<span className="text-slate-500 font-black">Spot</span>
				</p>
				<p className="text-center text-xl text-slate-600 mb-6">
					Share your catches with the world
				</p>
				<div className="flex gap-2 max-w-[34rem] w-full mx-auto items-center">
					<div className="relative w-full">
						<img
							src="/icons/search.svg"
							alt="search"
							width={16}
							height={16}
							className="absolute h-full left-2"
						/>
						<input
							type="search"
							name="search"
							id="search"
							className="p-2 pl-8 rounded-xl border-2 w-full border-slate-400"
							placeholder="Search by species, location, lure, or angler"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyDown={submitOnEnter}
						/>
					</div>
					<Link
						href={`/catches?searchTerm=${searchTerm}`}
						className="btn secondary !border-slate-400 !py-2 !px-3"
					>
						Search
					</Link>
				</div>
				<Link
					href="/signup"
					className="btn mt-8 w-fit mx-auto !py-4 !px-12 mb-32"
				>
					Sign Up
				</Link>
				<div className="flex flex-col mb-5">
					<p className="text-3xl font-semibold">Recent Catches</p>
					<p className="text-slate-500 text-lg">
						See what other anglers have been catching
					</p>
				</div>
				<div className="flex flex-col md:flex-row gap-5 mb-4">
					{catches.map((catchItem: any) => {
						return <VerticalCatchCard key={catchItem.id} catchItem={catchItem} />;
					})}
				</div>
				<Link href="/catches" className="btn w-fit mb-24">
					All Catches
				</Link>
				<div className="flex flex-col mb-24">
					<div className="flex flex-col mb-5">
						<p className="text-3xl font-semibold">Species</p>
						<p className="text-slate-500 text-lg">
							Learn about fish behavior, habitat, and more
						</p>
					</div>
					<div className="flex flex-col md:flex-row gap-5">
						{species.map((speciesItem: any) => (
							<div className="w-full mb-[2%] -mx-3" key={speciesItem.id}>
								<SpeciesCard key={speciesItem.id} speciesItem={speciesItem} />
							</div>
						))}
					</div>
					<Link href="/species" className="btn w-fit mb-8">
						All Species
					</Link>
				</div>
				<p className="text-3xl font-semibold mb-6">About CatchSpot</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16 mb-32">
					<div>
						<i aria-hidden className="fa-solid fa-house text-2xl mb-2"></i>
						<p className="text-xl mb-2">Subheading</p>
						<p className="text-slate-600">
							Body text for whatever you’d like to say. Add main takeaway
							points, quotes, anecdotes, or even a very very short story.{" "}
						</p>
					</div>
					<div>
						<i aria-hidden className="fa-solid fa-house text-2xl mb-2"></i>
						<p className="text-xl mb-2">Subheading</p>
						<p className="text-slate-600">
							Body text for whatever you’d like to say. Add main takeaway
							points, quotes, anecdotes, or even a very very short story.{" "}
						</p>
					</div>
					<div>
						<i aria-hidden className="fa-solid fa-house text-2xl mb-2"></i>
						<p className="text-xl mb-2">Subheading</p>
						<p className="text-slate-600">
							Body text for whatever you’d like to say. Add main takeaway
							points, quotes, anecdotes, or even a very very short story.{" "}
						</p>
					</div>
					<div>
						<i aria-hidden className="fa-solid fa-house text-2xl mb-2"></i>
						<p className="text-xl mb-2">Subheading</p>
						<p className="text-slate-600">
							Body text for whatever you’d like to say. Add main takeaway
							points, quotes, anecdotes, or even a very very short story.{" "}
						</p>
					</div>
				</div>
			</div>
			<div className="w-full flex flex-col items-center justify-center py-32 bg-slate-100 mb-24">
				<p className="text-3xl font-bold mb-3">Sign up</p>
				<p className="text-xl text-slate-600 mb-6">Log your catches today!</p>
				<Link href="/signup" className="btn !py-4 !px-12">
					Sign Up
				</Link>
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	const speciesRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/species?pagination[page]=1&pagination[pageSize]=3&populate=*`
	);
	const species = await speciesRes.json();

	const catchesRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/catches?pagination[page]=1&pagination[pageSize]=3&populate=angler.profilePicture,species,location,lure,image&sort=id:desc`
	);
	const catches = await catchesRes.json();

	return {
		props: {
			species: species.data,
			catches: catches.data,
		},
	};
}

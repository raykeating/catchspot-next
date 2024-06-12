import React, { useEffect, useRef } from "react";
import SpeciesCard from "@/components/SpeciesCard";
import autoAnimate from "@formkit/auto-animate";

type Props = {
	initialSpecies: any;
};

export default function Species({ initialSpecies }: Props) {
	const [searchTerm, setSearchTerm] = React.useState("");
	const [filters, setFilters] = React.useState({ species: "" });

	const [species, setSpecies] = React.useState(initialSpecies);

	React.useEffect(() => {
		const url = generateFilteredUrl(searchTerm, filters);

		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					console.error(data.error);
				} else {
					setSpecies(data.data);
				}
			});
	}, [searchTerm, filters]);

    const listContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		listContainer.current && autoAnimate(listContainer.current);
	}, [listContainer]);

	return (
		<div className="max-w-[1100px] mx-auto mt-36">
			<h1 className="text-3xl font-bold">Species</h1>
			<h2 className="text-lg italic text-slate-600 mb-8">
				Learn about fish behavior, habitat, and see recent catches
			</h2>
			<div className="w-full flex gap-3 mb-8">
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
						className="p-2 pl-8 rounded-lg border w-full"
						placeholder="Search species"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				{/* Search and filters */}
				<div className="relative inline-block w-64">
					<select
						className="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded-lg focus:outline-none focus:shadow-outline"
						onChange={(e) =>
							setFilters({ ...filters, species: e.target.value })
						}
					>
						<option value="">All Species</option>
						<option value="freshwater">Freshwater</option>
						<option value="saltwater">Saltwater</option>
					</select>
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
						<svg
							className="fill-current h-4 w-4"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
						>
							<path d="M7 7l3 3 3-3 1 1-4 4-4-4 1-1z" />
						</svg>
					</div>
				</div>
			</div>
			<div className="flex flex-wrap gap-[2%] -mx-1" ref={listContainer}>
				{species.map((speciesItem: any) => (
					<div className="basis-[32%] mb-[2%]" key={speciesItem.id}>
						<SpeciesCard speciesItem={speciesItem} />
					</div>
				))}
                {
                    species.length === 0 && (
                        <p>No species found</p>
                    )
                }
			</div>
		</div>
	);
}

function generateFilteredUrl(searchTerm: string, filters: any): string {
	let url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/species?`;
	if (searchTerm) {
		url += `filters[$or][0][name][$containsi]=${searchTerm}`;
		url += `&filters[$or][1][latinName][$containsi]=${searchTerm}`;
	}

	if (filters.species) {
		const isFreshwater = filters.species === "freshwater";

		url += `&filters[isFreshwater][$eq]=${isFreshwater}`;
	}

	return url + "&populate=angler.profilePicture,species,location,lure,image";
}

export async function getServerSideProps() {
	const speciesRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/species?populate=*`
	);
	const species = await speciesRes.json();

	return {
		props: {
			initialSpecies: species.data,
		},
	};
}

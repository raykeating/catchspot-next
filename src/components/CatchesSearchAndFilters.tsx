import React from "react";
import Image from "next/image";

type Props = {
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;
	filters: { species: string; myCatches: string };
	setFilters: (filters: { species: string; myCatches: string }) => void;
	species: string[];
};

export default function CatchesSearchAndFilters({
	searchTerm,
	setSearchTerm,
	filters,
	setFilters,
	species,
}: Props) {
	return (
		<div className="w-full pt-[5rem]">
			<div className="p-6 bg-slate-50 flex gap-3">
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
						placeholder="Search"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className="relative inline-block w-64">
					<select className="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded-lg focus:outline-none focus:shadow-outline" onChange={(e) => setFilters({ ...filters, species: e.target.value })}>
						<option value="">All Species</option>
						{
							species.map((speciesName) => (
								<option key={speciesName} value={speciesName}>{speciesName}</option>
							))
						}
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
				<div className="relative inline-block w-64">
					<select className="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded-lg focus:outline-none focus:shadow-outline" onChange={(e) => setFilters({ ...filters, myCatches: e.target.value })}>
						<option value="false">All Anglers</option>
						<option value="true">My Catches</option>
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
		</div>
	);
}

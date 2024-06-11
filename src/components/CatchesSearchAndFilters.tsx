import React from "react";
import Image from "next/image";

type Props = {};

export default function CatchesSearchAndFilters({}: Props) {
	return (
		<div className="w-full pt-[5rem]">
			<div className="p-6 bg-slate-50 flex gap-3">
				<div className="relative w-full">
					<Image
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
					/>
				</div>
				<div className="relative inline-block w-64">
					<select className="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded-lg focus:outline-none focus:shadow-outline">
						<option value="none">Species</option>
						<option value="bass">Bass</option>
						<option value="trout">Trout</option>
						<option value="catfish">Catfish</option>
						<option value="crappie">Crappie</option>
						<option value="walleye">Walleye</option>
						<option value="sunfish">Sunfish</option>
						<option value="perch">Perch</option>
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
					<select className="block appearance-none w-full bg-white border px-4 py-2 pr-8 rounded-lg focus:outline-none focus:shadow-outline">
						<option value="none">Province</option>
						<option value="alberta">Alberta</option>
						<option value="british-columbia">British Columbia</option>
						<option value="manitoba">Manitoba</option>
						<option value="new-brunswick">New Brunswick</option>
						<option value="newfoundland-and-labrador">
							Newfoundland and Labrador
						</option>
						<option value="nova-scotia">Nova Scotia</option>
						<option value="ontario">Ontario</option>
						<option value="prince-edward-island">Prince Edward Island</option>
						<option value="quebec">Quebec</option>
						<option value="saskatchewan">Saskatchewan</option>
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

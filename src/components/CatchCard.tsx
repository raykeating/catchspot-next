import React from "react";
import Image from "next/image";
import Link from "next/link";
import parseCatchData from "@/lib/util/parseCatchData";

type Props = {
	catchItem: any;
	onClick?: (catchItem: any) => void;
};

export default function CatchCard({ catchItem, onClick }: Props) {

	const { speciesName, locationName, imageSrc, anglerName, length, lureName } =
		parseCatchData(catchItem);

	return (
		<button className="flex p-6 pr-12 gap-6 hover:bg-slate-50 cursor-pointer transition-colors text-start" onClick={onClick}>
			<Image
				src="/images/trout.jpg"
				alt=""
				width={200}
				height={256}
				className="rounded-xl object-cover w-48 h-full"
			/>
			<div className="flex flex-col">
				<p className="font-bold">{speciesName}</p>
				<p className="mb-3 truncate max-w-48">{locationName}</p>
				<div className="flex gap-1 mb-3">
					<Image
						src={imageSrc}
						alt=""
						width={128}
						height={128}
						className="rounded-full h-6 w-6"
					/>
					<p>{anglerName}</p>
				</div>
				<p className="text-slate-500 mb-3">
					{length}" <span className="font-thin">•</span> {lureName}
				</p>
				<div className="flex flex-col gap-5 text-sm">
					<Link
						href="/catches/1"
						className="p-1 px-3 rounded-lg w-fit hover:bg-slate-300 bg-slate-200 transition-colors flex items-center gap-2"
					>
						View Catch{" "}
						<i className="fa-solid fa-arrow-up-right-from-square text-[0.7rem]"></i>
					</Link>
				</div>
			</div>
		</button>
	);
}
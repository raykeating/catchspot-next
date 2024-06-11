import React from "react";
import Image from "next/image";
import parseCatchData from "@/lib/util/parseCatchData";

type Props = {
	catchItem: any;
};

export default function VerticalCatchCard({
	catchItem
}: Props) {

    const {
        speciesName,
        locationName,
        imageSrc,
        anglerImageSrc,
        anglerName,
        anglerLocation,
        length,
        lureName
    } = parseCatchData(catchItem);

	return (
		<div className="flex flex-col gap-4 w-full">
            <div className="flex gap-3 items-center">
				<Image
					src={anglerImageSrc}
					alt=""
					width={128}
					height={128}
					className="rounded-full h-10 w-10"
				/>
				<div className="flex flex-col">
					<p className="font-medium text-sm">{anglerName}</p>
					<p className="text-slate-600 text-sm">{anglerLocation}</p>
				</div>
			</div>
			<div className="w-full flex flex-col mb-1">
				<Image
					src={imageSrc}
					alt=""
					width={200}
					height={256}
					className="rounded-lg object-cover w-full h-48 mb-4"
				/>
				<p className="font-bold text-[1.05rem] mb-1">{speciesName}</p>
				<p className="text-slate-600 mb-1">{length}" • {lureName}</p>
				<p className="font-semibold truncate w-64">{locationName}</p>
			</div>
		</div>
	);
}

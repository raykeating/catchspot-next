import optimizedImage from "@/lib/util/optimizedImg";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
	speciesItem: any;
};

export default function SpeciesCard({ speciesItem }: Props) {
	const imageSrc = `${process.env.NEXT_PUBLIC_STRAPI_URL}${optimizedImage(
		speciesItem.attributes.image.data.attributes
	)}`;

	return (
		<Link
			className="w-full flex flex-col gap-3 px-4 py-3 pb-4 hover:bg-slate-50/75 transition-colors rounded-lg"
			href={`/species/${speciesItem.id}`}
		>
			<div className="flex flex-col gap-1">
				<div className="flex flex-col mb-3">
					<p className="text-xl font-semibold">{speciesItem.attributes.name}</p>
					<p className="italic text-slate-600">
						{speciesItem.attributes.latinName}
					</p>
				</div>
				<Image
					src={imageSrc}
					alt={speciesItem.attributes.name}
					width={500}
					height={500}
					className="rounded-lg object-cover w-full h-48 mb-4"
				/>
				<p className="flex items-center gap-2 font-semibold">
					Learn more <i aria-hidden className="fas fa-external-link text-xs"></i>
				</p>
			</div>
		</Link>
	);
}

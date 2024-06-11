import React, { useEffect, useRef } from "react";
import Image from "next/image";
import parseCatchData from "@/lib/util/parseCatchData";
import Link from "next/link";
import { Map, Popup, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Inter } from "next/font/google";
import VerticalCatchCard from "@/components/VerticalCatchCard";

const inter = Inter({ subsets: ["latin"] });

type Props = {
	catchItem: any;
	featuredCatches: any;
};

export default function IndividualCatchPage({
	catchItem,
	featuredCatches,
}: Props) {
	const {
		speciesName,
		speciesLatinName,
		locationName,
		imageSrc,
		anglerImageSrc,
		anglerName,
        anglerLocation,
		length,
		lureName,
		lureLink,
		postedDate,
		lat,
		lng,
	} = parseCatchData(catchItem);

	const mapRef = useRef<HTMLDivElement | null>(null);

	// Initialize the map
	useEffect(() => {
		if (mapRef.current) {
			const map = initMap(mapRef.current, [lng, lat]);

			// add popup

			const popUp = new Popup({
				closeButton: false,
				anchor: "bottom",
			}).setHTML(
				`<div class="flex flex-col">
                    <img src="${imageSrc}" alt="" class="rounded-sm object-cover w-full h-24 mb-2" />
                    <p class="font-semibold ${inter.className}">${speciesName}</p>
                    <p class="truncate w-44 mb-1 ${inter.className}">${locationName}</p>
                    <p class="text-slate-600 mb-2 ${inter.className}">${length}" • ${lureName}</p>
                    <div class="flex gap-2 mb-1">
                        <img src="${anglerImageSrc}" alt="" class="rounded-full h-5 w-5" />
                        <p class="${inter.className}">${anglerName}</p>
                    </div>
                </div>`
			);

			new Marker({ color: "#0f172a", scale: 1 })
				.setLngLat([lng, lat])
				.setPopup(popUp)
				.addTo(map);

			catchItem.popup = popUp;
		}
	}, []);

	return (
		<div className="max-w-[1100px] mx-auto px-4 mt-36 flex flex-col gap-12">
            <Link href="/catches" className="-mb-4 px-3 py-1 rounded-lg hover:bg-slate-50 -translate-x-1 transition-all w-fit"><i className="fa-solid fa-angle-left mr-3"></i>All Catches</Link>
			<div className="flex gap-12 max-h-[360px] w-full">
				<Image
					src={imageSrc}
					alt=""
					width={800}
					height={800}
					className="rounded-xl object-cover w-[50%] max-h-[360px]"
				/>
				<div className="flex flex-col w-[50%]">
					<div className="flex gap-3 items-center mb-8">
						<Image
							src={anglerImageSrc}
							alt=""
							width={128}
							height={128}
							className="rounded-full h-12 w-12"
						/>
						<div className="flex flex-col">
							<p className="font-medium">{anglerName}</p>
							<p className="text-slate-600">{anglerLocation}</p>
						</div>
					</div>
					<h1 className="text-3xl font-bold">
						{length}" {speciesName}
					</h1>
					<h2 className="text-slate-600 italic text-lg mb-8">
						{speciesLatinName}
					</h2>
					<p className="text-lg text-slate-600 mb-8 h-full">
						Posted on <span className="italic font-semibold">{postedDate}</span>
						. Caught at{" "}
						<span className="italic font-semibold">{locationName}</span> using a{" "}
						<Link
							href={lureLink}
							target="_blank"
							className="italic underline font-semibold"
						>
							{lureName}{" "}
							<i className="fa-solid fa-external-link text-xs -translate-y-1 ml-1"></i>
						</Link>
					</p>
					<Link href="/species/#" className="btn">
						Learn more about {speciesName} ({speciesLatinName})
					</Link>
				</div>
			</div>
			<div
				className="w-full h-[360px] rounded-xl overflow-hidden"
				ref={mapRef}
			></div>

			<div>
				<div className="flex flex-col mb-5">
					<p className="text-2xl font-semibold">Other Catches</p>
					<p className="text-slate-500">More Brown Trout</p>
				</div>
				<div className="flex gap-5 mb-24">
					{featuredCatches.map((catchItem: any) => {
						return (
							<VerticalCatchCard
								catchItem={catchItem}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}

function initMap(container: HTMLDivElement, center: [number, number]) {
	return new Map({
		container,
		center,
		zoom: 12,
		style: "mapbox://styles/mapbox/streets-v12",
		pitchWithRotate: false,
		accessToken:
			"pk.eyJ1IjoicmtlYXRpbmciLCJhIjoiY2xuMXM3YnVlMDFkYzJsbWZkdnd5ZmlucCJ9.i--1vZDuWSGIyvsjCQxPcA",
		doubleClickZoom: false,
	});
}

export async function getServerSideProps(context: any) {
	const { id } = context.params;

	const catchRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/catches/${id}?populate=angler.profilePicture,species,location,lure,image`
	);

	const catchItem = await catchRes.json();

	const featuredCatchesRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/catches?populate=angler.profilePicture,species,location,lure,image&pagination[page]=1&pagination[pageSize]=3`
	);

	const featuredCatches = await featuredCatchesRes.json();

	return {
		props: {
			catchItem: catchItem.data,
			featuredCatches: featuredCatches.data,
		},
	};
}

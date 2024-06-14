import React, { useEffect, useRef } from "react";
import Image from "next/image";
import optimizedImg from "@/lib/util/optimizedImg";
import VerticalCatchCard from "@/components/VerticalCatchCard";
import { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import ConservationStatusMeter from "@/components/ConservationStatusMeter";
import SpeciesCard from "@/components/SpeciesCard";

type Props = { species: any; otherSpecies: any; relatedCatches: any };

export default function SpeciesPage({
	species,
	otherSpecies,
	relatedCatches,
}: Props) {
	const imageSrc = `${process.env.NEXT_PUBLIC_STRAPI_URL}${optimizedImg(
		species.attributes.image.data.attributes,
		"large"
	)}`;

	const mapRef = useRef<HTMLDivElement | null>(null);

	// Initialize the map
	useEffect(() => {
		if (mapRef.current && species.attributes.geographicRange) {
			const map = initMap(
				mapRef.current,
				[
					// north american center
					-100.43701171875, 39.639537564366684,
				]
			);

			map.on("load", () => {
				// Add a data source containing GeoJSON data.
				map.addSource("geographic-distribution", {
					type: "geojson",
					data: species.attributes.geographicRange,
				});

				// Add a new layer to visualize the polygon.
				map.addLayer({
					id: "geographic-distribution",
					type: "fill",
					source: "geographic-distribution", // reference the data source
					layout: {},
					paint: {
						"fill-color": "#088",
						"fill-opacity": 0.5,
					},
				});
				// Add a black outline around the polygon.
				map.addLayer({
					id: "outline",
					type: "line",
					source: "geographic-distribution",
					layout: {},
					paint: {
						"line-color": "#555",
						"line-width": 1,
					},
				});
			});
		}
	}, []);

	return (
		<div className="max-w-[1100px] mx-auto mt-32 px-4">
			<Link
				href="/species"
				className="px-3 py-1 rounded-lg hover:bg-slate-100 -translate-x-3 mb-5 block transition-all w-fit"
			>
				<i className="fa-solid fa-angle-left mr-3"></i>All Species
			</Link>
			<h1 className="text-3xl font-bold">{species.attributes.name}</h1>
			<h2 className="text-lg italic text-slate-600 mb-8">
				{species.attributes.latinName}
			</h2>
			<Image
				src={imageSrc}
				alt={species.attributes.name}
				width={1100}
				height={600}
				className="rounded-xl object-cover w-full h-80 mb-8"
			/>
			<div>
				<div className="flex flex-col mb-5">
					<p className="text-2xl font-semibold">Recent Catches</p>
					<p className="text-slate-500">
						{species.attributes.name}{" "}
						<span className="text-sm font-light">
							({species.attributes.latinName})
						</span>
					</p>
				</div>
				<div className="flex max-md:flex-col gap-5 mb-12">
					{relatedCatches.map((catchItem: any) => {
						return (
							<VerticalCatchCard key={catchItem.id} catchItem={catchItem} />
						);
					})}
				</div>
			</div>
			{species.attributes.geographicRange && (
				<>
					<div className="flex flex-col mb-5">
						<p className="text-2xl font-semibold">Geographic Range</p>
						<p className="text-slate-500">
							Distribution of {species.attributes.name} in the wild
						</p>
					</div>

					<div
						className="w-full h-[360px] rounded-xl overflow-hidden mb-8"
						ref={mapRef}
					></div>
				</>
			)}
			<div className="max-w-[900px]">
				<div className="flex flex-col mb-8">
					<p className="text-2xl font-semibold">Description</p>
					<p className="text-slate-500 mb-4">
						Physical characteristics and appearance
					</p>
					<div className="strapi-blocks">
						<BlocksRenderer content={species.attributes.description} />
					</div>
				</div>
				<div className="flex flex-col mb-8">
					<p className="text-2xl font-semibold">Size</p>
					<p className="text-slate-500 mb-4">Average Length and Weight</p>
					<div className="strapi-blocks">
						<BlocksRenderer content={species.attributes.size} />
					</div>
				</div>
				<div className="flex flex-col mb-8">
					<p className="text-2xl font-semibold">Preferred Habitat</p>
					<p className="text-slate-500 mb-4">Ideal Environmental Conditions</p>
					<div className="strapi-blocks">
						<BlocksRenderer content={species.preferredHabitat} />
					</div>
				</div>
				<div className="flex flex-col mb-8">
					<p className="text-2xl font-semibold">Diet</p>
					<p className="text-slate-500 mb-4">
						Typical Food Sources and Feeding Patterns
					</p>
					<div className="strapi-blocks">
						<BlocksRenderer content={species.attributes.diet} />
					</div>
				</div>
				<div className="flex flex-col mb-12">
					<p className="text-2xl font-semibold">Conservation Status</p>
					<p className="text-slate-500 mb-4">Population</p>
					<ConservationStatusMeter
						status={species.attributes.conservationStatus}
					/>
				</div>
			</div>
			<div className="flex flex-col mb-24">
				<p className="text-2xl font-semibold">Other Species</p>
				<p className="text-slate-500 mb-4">
					More species you might be interested in learning about
				</p>
				<div className="flex max-md:flex-col md:gap-5">
					{otherSpecies.map((speciesItem: any) => (
						<div className="basis-[32%] mb-[2%] -mx-4" key={speciesItem.id}>
							<SpeciesCard speciesItem={speciesItem} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export async function getServerSideProps(context: any) {
	const id = context.params.id;

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/species/${id}?populate=*`
	);

	const species = await res.json();

	const relatedCatchesRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/catches?filters[species][latinName][$eq]=${species.data.attributes.latinName}&populate=angler.profilePicture,species,location,lure,image&pagination[page]=1&pagination[pageSize]=3`
	);

	const relatedCatches = await relatedCatchesRes.json();

	const otherSpeciesRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/species?pagination[page]=1&pagination[pageSize]=3&populate=*`
	);

	const otherSpecies = await otherSpeciesRes.json();

	return {
		props: {
			species: species.data,
			otherSpecies: otherSpecies.data,
			relatedCatches: relatedCatches.data,
		},
	};
}

function initMap(container: HTMLDivElement, center: [number, number]) {
	return new Map({
		container,
		center,
		zoom: 2,
		style: "mapbox://styles/mapbox/streets-v12",
		pitchWithRotate: false,
		accessToken:
			"pk.eyJ1IjoicmtlYXRpbmciLCJhIjoiY2xuMXM3YnVlMDFkYzJsbWZkdnd5ZmlucCJ9.i--1vZDuWSGIyvsjCQxPcA",
		doubleClickZoom: false,
	});
}

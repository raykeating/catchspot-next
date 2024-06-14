import React, { useRef, useEffect, useState } from "react";
import { Map, Marker, Popup } from "mapbox-gl";
import CatchesSearchAndFilters from "@/components/CatchesSearchAndFilters";
import CatchCard from "@/components/CatchCard";
import CatchMap from "@/components/CatchMap";
import useMapMarkers from "@/lib/hooks/useMapMarkers";
import autoAnimate from "@formkit/auto-animate";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type Props = {
	initialCatches: any;
	species: any;
};

export default function Catches({ initialCatches, species }: Props) {
	const {
		data: session,
		status,
	}: {
		data: any;
		status: string;
	} = useSession();

	const mapRef = useRef<HTMLDivElement>(null);
	const mapInitRef = useRef<Map | null>(null);

	const [catches, setCatches] = useState(initialCatches);
	const [pins, setPins] = useState<
		{
			marker: Marker;
			popup: Popup;
			catchId: number;
		}[]
	>([]);

	const router = useRouter();

	// get searchTerm parameter from the URL
	const searchTermParam = router.query.searchTerm as string;

	const [searchTerm, setSearchTerm] = useState(searchTermParam || "");
	const [filters, setFilters] = useState({
		species: "",
		myCatches: "false",
	});

	const listContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		listContainer.current && autoAnimate(listContainer.current);
	}, [listContainer]);

	useEffect(() => {
		async function fetchCatches() {
			const res = await fetch(
				generateFilteredUrl(
					searchTerm,
					filters,
					session?.user?.anglerProfile?.id
				)
			);

			const data = await res.json();

			if (data.error) {
				console.error(data.error);
			} else {
				// set catches to the fetched data
				setCatches(data.data);

				// update the map bounds
				if (mapInitRef.current && data.data.length > 0) {
					mapInitRef.current.fitBounds(calculateBoundingBox(data.data), {
						padding: 200,
					});
				}
			}
		}

		fetchCatches();
	}, [searchTerm, filters]);

	// Initialize the map
	useEffect(() => {
		if (mapRef.current) {
			mapInitRef.current = initMap(mapRef.current, catches);
		}
	}, []);

	// Add markers to the map (custom hook)
	useMapMarkers(catches, setPins, mapInitRef);

	function openPopup(catchItem: any) {
		// disable all popups
		pins.forEach((pin) => {
			pin.popup.remove();
		});

		// find the pin that matches the catch
		const catchPin = pins.find((pin) => pin.catchId === catchItem.id);

		// open popup
		if (catchPin) {
			catchPin.popup.addTo(mapInitRef.current!);
			mapInitRef.current!.flyTo({
				center: catchPin.marker.getLngLat(),
				zoom: 12,
			});
		}
	}

	return (
		<div className="h-[calc(100vh-10.6rem)] flex-col">
			<CatchesSearchAndFilters
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				filters={filters}
				setFilters={setFilters}
				species={species}
			/>
			<div className="border w-full flex h-full overflow-x-hidden">
				<div
					className="flex flex-col overflow-y-scroll shrink-0 min-w-[502px]"
					ref={listContainer}
				>
					{catches.map((catchItem: any) => (
						<div className="flex" key={catchItem.id}>
							<CatchCard
								key={catchItem.id}
								catchItem={catchItem}
								onClick={() => openPopup(catchItem)}
							/>
						</div>
					))}
					{catches.length === 0 && (
						<div className="w-full h-full flex flex-col gap-1 justify-center items-center">
							<p>No catches found</p>
							{status !== "authenticated" && (
								<p className="text-slate-600">
									Please log in to see your catches
								</p>
							)}
						</div>
					)}
				</div>
				<div className="w-full h-full relative overflow-hidden">
					<CatchMap mapRef={mapRef} />
				</div>
			</div>
		</div>
	);
}

function initMap(container: HTMLDivElement, catches: any) {
	return new Map({
		container,
		style: "mapbox://styles/mapbox/streets-v12",
		pitchWithRotate: false,
		bounds: calculateBoundingBox(catches),
		accessToken:
			"pk.eyJ1IjoicmtlYXRpbmciLCJhIjoiY2xuMXM3YnVlMDFkYzJsbWZkdnd5ZmlucCJ9.i--1vZDuWSGIyvsjCQxPcA",
		doubleClickZoom: false,
	});
}

function calculateBoundingBox(catches: any): any {
	const inset = 0.05;

	const lats = catches
		.filter((c: any) => c.attributes.location)
		.map((catchItem: any) => catchItem.attributes.location.lat);
	const lngs = catches
		.filter((c: any) => c.attributes.location)
		.map((catchItem: any) => catchItem.attributes.location.lng);

	const minLat = Math.min(...lats) - inset;
	const maxLat = Math.max(...lats) + inset;
	const minLng = Math.min(...lngs) - inset;
	const maxLng = Math.max(...lngs) + inset;

	return [
		[minLng, minLat],
		[maxLng, maxLat],
	];
}

function generateFilteredUrl(
	searchTerm: string,
	filters: any,
	myAnglerId: number
): string {
	let url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/catches?`;
	if (searchTerm) {
		url += `filters[$or][0][species][name][$containsi]=${searchTerm}`;
		url += `&filters[$or][1][angler][firstName][$containsi]=${searchTerm}`;
		url += `&filters[$or][2][angler][lastName][$containsi]=${searchTerm}`;
		url += `&filters[$or][3][lure][name][$containsi]=${searchTerm}`;
		url += `&filters[$or][4][location][$containsi]=${searchTerm}`;
	}

	if (filters.species) {
		url += `&filters[species][name][$eq]=${filters.species}`;
	}

	if (filters.myCatches === "true") {
		url += `&filters[angler][id][$eq]=${myAnglerId}`;
	}

	return url + "&populate=angler.profilePicture,species,location,lure,image&sort=id:desc";
}

export async function getServerSideProps() {
	const catchesRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/catches?sort=id:desc&populate=angler.profilePicture,species,location,lure,image`
	);

	const catches = await catchesRes.json();

	const speciesRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/species`
	);

	const species = await speciesRes.json();

	return {
		props: {
			initialCatches: catches.data,
			species: species.data,
		},
	};
}

import React, { useRef, useEffect } from "react";
import { Map } from "mapbox-gl";
import CatchesSearchAndFilters from "@/components/CatchesSearchAndFilters";
import CatchCard from "@/components/CatchCard";
import CatchMap from "@/components/CatchMap";
import useMapMarkers from "@/lib/hooks/useMapMarkers";

type Props = {
	catches: any;
};

export default function Catches({
	catches
}: Props) {

	const mapRef = useRef<HTMLDivElement>(null);
	const mapInitRef = useRef<Map | null>(null);

	// Initialize the map
	useEffect(() => {
		if (mapRef.current) {
			mapInitRef.current = initMap(
				mapRef.current,
				catches
			);
		}
	}, []);

	// Add markers to the map (custom hook)
	useMapMarkers(catches, mapInitRef);

	function openPopup(catchItem: any) {
		// disable all popups
		catches.forEach((catchItem: any) => {
			if (catchItem.popup) catchItem.popup.remove();
		});

		// open popup
		if (catchItem.popup && catchItem.marker) {
			catchItem.popup.addTo(mapInitRef.current!);
			mapInitRef.current!.flyTo({
				center: catchItem.marker.getLngLat(),
				zoom: 12,
			});	
		}
	}

	return (
		<div className="h-[calc(100vh-10.6rem)] flex-col">
			<CatchesSearchAndFilters />
			<div className="border w-full flex h-full overflow-x-hidden">
				<div className="flex flex-col overflow-y-scroll shrink-0">
					{catches.map((catchItem: any) => (
						<CatchCard key={catchItem.id} catchItem={catchItem} onClick={() => openPopup(catchItem)} />
					))}
				</div>
				<div className="w-full h-full relative overflow-hidden">
                    <CatchMap mapRef={mapRef} />
                </div>
			</div>
		</div>
	);
}

export async function getServerSideProps() {

	const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/catches?populate=angler.profilePicture,species,location,lure`);

	const catches = await res.json();

	return {
		props: {
			catches: catches.data,
		},
	};
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

	const lats = catches.filter((c: any) => c.attributes.location).map((catchItem: any) => catchItem.attributes.location.lat);
	const lngs = catches.filter((c: any) => c.attributes.location).map((catchItem: any) => catchItem.attributes.location.lng);

	const minLat = Math.min(...lats) - inset;
	const maxLat = Math.max(...lats) + inset;
	const minLng = Math.min(...lngs) - inset;
	const maxLng = Math.max(...lngs) + inset;

	return [
		[minLng, minLat],
		[maxLng, maxLat],
	];
}
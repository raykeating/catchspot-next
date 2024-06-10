import React, { useRef, useEffect } from "react";
import { Map } from "mapbox-gl";

type Props = {};

function initMap(container: HTMLDivElement, coords: [number, number]) {
	return new Map({
		container,
		style: "mapbox://styles/mapbox/streets-v12",
		pitchWithRotate: false,
		center: coords,
		zoom: 15,
		accessToken:
			"pk.eyJ1IjoicmtlYXRpbmciLCJhIjoiY2xuMXM3YnVlMDFkYzJsbWZkdnd5ZmlucCJ9.i--1vZDuWSGIyvsjCQxPcA",
		doubleClickZoom: false,
	});
}

export default function CatchMap({}: Props) {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (mapRef.current) {
			const map = initMap(
				mapRef.current,
				[-79.27333384841043, 42.97302361446369]
			);
            console.log('loaded map');
		}
	}, []);

	return (
		<div
			className="map !absolute !top-0 !bottom-0 !w-full !h-[calc(100vh-11rem)]"
			ref={mapRef}
		></div>
	);
}

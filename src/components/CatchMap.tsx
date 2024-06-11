import React, { useRef, useEffect } from "react";
import { Map, Marker, Popup } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

type Props = {
	mapRef: React.MutableRefObject<HTMLDivElement | null>;
};

export default function CatchMap({ mapRef }: Props) {

	return (
		<div
			className="map !absolute !top-0 !bottom-0 !w-full !h-[calc(100vh-10rem)]"
			ref={mapRef}
		></div>
	);
}
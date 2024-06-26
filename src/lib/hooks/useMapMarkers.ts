import { useEffect } from "react";
import { Marker, Popup } from "mapbox-gl";
import parseCatchData from "@/lib/util/parseCatchData";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// custom hook to add markers to the map
export default function useMapMarkers(
	catches: any,
	setPins: React.Dispatch<React.SetStateAction<{
		marker: Marker;
		popup: Popup;
		catchId: number;
	}[]>>,
	mapInitRef: any,
) {
	// when the catches, searchTerm, or filters change, add markers to the map, and remove existing markers
	useEffect(() => {

		// remove existing markers
		setPins((pins: {
			marker: Marker;
			popup: Popup;
			catchId: number;
		}[]) => {
			pins.forEach((pin) => {
				pin.marker.remove();
			});
			return [];
		});

		if (mapInitRef.current) {
			addMarkers();
		}
	}, [catches]);

	function addMarkers() {
		catches.map((catchItem: any) => {
			const {
				anglerName,
				anglerImageSrc,
				imageSrc,
				lat,
				lng,
				lureName,
				length,
				locationName,
				speciesName,
			} = parseCatchData(catchItem);

			if (!lat || !lng) return;

			const popUp = new Popup({
				closeButton: false,
				anchor: "bottom",
			}).setHTML(
				`<div class="flex flex-col">
					<img src="${imageSrc}" alt="" class="rounded-sm object-cover w-full h-24 mb-2" />
					<p class="${inter.className} font-semibold">${speciesName}</p>
					<p class="truncate w-44 ${inter.className} mb-1">${locationName}</p>
					<p class="${inter.className} text-slate-600 mb-2">${length}" • ${lureName}</p>
					<div class="flex gap-2 mb-4">
						<img src="${anglerImageSrc}" alt="" class="rounded-full h-5 w-5" />
						<p class="${inter.className}">${anglerName}</p>
					</div>
					<a href="/catches/${catchItem.id}" class="btn !h-8 !rounded gap-1 ${inter.className}">View Catch
						<i class="fa-solid fa-arrow-up-right-from-square text-[0.7rem]"></i>
					</a>
				</div>`
			);

			const marker = new Marker({ color: "#0f172a", scale: 1.2 })
				.setLngLat([lng, lat])
				.setPopup(popUp)
				.addTo(mapInitRef.current!);

			// update the catchItem with the marker and popup
			setPins((pins: {
				marker: Marker;
				popup: Popup;
				catchId: number;
			}[]) => {
				pins.push({ marker, popup: popUp, catchId: catchItem.id });
				return pins;
			});

			return catchItem;
		});
	}

	return catches;
}

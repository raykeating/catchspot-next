import toast from "react-hot-toast";

export default async function uploadCatch(catchItem: any, token: string) {
	const toastId = toast.loading("Uploading catch...");
	const valid = validate(catchItem, toastId);
	if (!valid) return false;

	const formData = new FormData();

	formData.append("files.image", catchItem.image);
	formData.append(
		"data",
		JSON.stringify({
			species: catchItem.species.id,
			location: await getFullLocation(catchItem.location),
			lure: catchItem.lure.id,
			length: catchItem.length,
		})
	);

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/catches`,
		{
			method: "POST",
			body: formData,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	if (!response.ok) {
		toast.error("Failed to upload catch", { id: toastId });
		return;
	}

	toast.success("Catch uploaded", { id: toastId });

    return true;
}

function validate(catchItem: any, toastId: string) {
	if (!catchItem.image) {
		toast.error("Image is required", { id: toastId });
	}

	if (!catchItem.species) {
		toast.error("Species is required", { id: toastId });
	}

	if (!catchItem?.location?.place_id) {
		toast.error("Please select a valid location", { id: toastId });
	}

	if (!catchItem.lure) {
		toast.error("Lure is required", { id: toastId });
	}

	if (!catchItem.length) {
		toast.error("Length is required", { id: toastId });
	}

	return (
		catchItem.image &&
		catchItem.species &&
		catchItem?.location?.place_id &&
		catchItem.lure &&
		catchItem.length
	);
}

async function getFullLocation(location: any) {
	const res = await fetch(
		`/api/get-location-details?placeId=${location.place_id}`
	);

	if (!res.ok) {
		return null;
	}

	const data = await res.json();

	return {
		description: location.description,
		place_id: location.place_id,
		lat: data.data.result.geometry.location.lat,
		lng: data.data.result.geometry.location.lng,
	};
}

import optimizedImage from "@/lib/util/optimizedImg";

export default function parseCatchData(catchItem: any) {

    console.log(catchItem.attributes.location);

	const speciesName = catchItem.attributes.species.data.attributes.name;
	const locationName =
		catchItem.attributes.location?.description || "Unknown Location";
	const imageSrc = `${process.env.NEXT_PUBLIC_STRAPI_URL}${optimizedImage(
		catchItem.attributes.angler.data.attributes.profilePicture.data.attributes,
		"thumbnail"
	)}`;
	const anglerName = `${catchItem.attributes.angler.data.attributes.firstName} ${catchItem.attributes.angler.data.attributes.lastName}`;
	const length = catchItem.attributes.length;
	const lureName = catchItem.attributes.lure.data.attributes.name;
    const lat = catchItem.attributes?.location?.lat || null;
    const lng = catchItem.attributes?.location?.lng || null;

	return {
		speciesName,
		locationName,
		imageSrc,
		anglerName,
		length,
		lureName,
        lat,
        lng
	};
}
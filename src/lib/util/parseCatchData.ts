import optimizedImage from "@/lib/util/optimizedImg";

export default function parseCatchData(catchItem: any) {

	const speciesName = catchItem.attributes.species.data.attributes.name;
    const speciesLatinName = catchItem.attributes.species.data.attributes.latinName;
	const locationName =
		catchItem.attributes.location?.description || "Unknown Location";
	const anglerImageSrc = `${process.env.NEXT_PUBLIC_STRAPI_URL}${optimizedImage(
		catchItem.attributes.angler.data.attributes.profilePicture.data.attributes,
		"thumbnail"
	)}`;
    const imageSrc = `${process.env.NEXT_PUBLIC_STRAPI_URL}${optimizedImage(
        catchItem.attributes.image.data.attributes,
        "large"
    )}`;
	const anglerName = `${catchItem.attributes.angler.data.attributes.firstName} ${catchItem.attributes.angler.data.attributes.lastName}`;
	const length = catchItem.attributes.length;
	const lureName = catchItem.attributes.lure.data.attributes.name;
    const lureLink = catchItem.attributes.lure.data.attributes.productLink;
    const lat = catchItem.attributes?.location?.lat || null;
    const lng = catchItem.attributes?.location?.lng || null;
    const postedDate = new Date(catchItem.attributes.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    const anglerLocation = catchItem.attributes.angler.data.attributes.location;

	return {
		speciesName,
        speciesLatinName,
		locationName,
        anglerImageSrc,
		imageSrc,
		anglerName,
		length,
		lureName,
        lureLink,
        lat,
        lng,
        postedDate,
        anglerLocation,
	};
}
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		// get the search parameter from the request
		const { placeId } = req.query;

		if (typeof placeId !== "string") {
			res.status(400).json({ error: "Invalid input, expected a string" });
			return;
		}

		const url = `https://maps.googleapis.com/maps/api/place/details/json?fields=geometry&place_id=${placeId}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

		const response = await fetch(url);

		if (!response.ok) {
			res.status(500).json({ error: "Failed to fetch location data" });
			return;
		}

		const data = await response.json();

		res.status(200).json({ data });
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}

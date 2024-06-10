import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<script
					src="https://kit.fontawesome.com/2f07fc999b.js"
					crossOrigin="anonymous"
				></script>
				<link
					rel="stylesheet"
					href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
					integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
					crossOrigin=""
				/>
				<script
					src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
					integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
					crossOrigin=""
				></script>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

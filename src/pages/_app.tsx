import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { SessionProvider, signOut } from "next-auth/react";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppProps) {

	const router = useRouter();

	console.log(session);

	return (
		<>
			<SessionProvider session={session}>
				<div className={`${inter.className}`}>
					<Navbar />
					<div className="min-h-screen">
						<Component {...pageProps} />
					</div>
					{router.pathname !== "/catches" && <Footer />}
				</div>
			</SessionProvider>
			<Toaster />
		</>
	);
}

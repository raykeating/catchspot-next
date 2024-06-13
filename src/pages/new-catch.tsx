import LocationDropdown from "@/components/LocationDropdown";
import SearchableDropdown from "@/components/SearchableDropdown";
import optimizedImage from "@/lib/util/optimizedImg";
import Link from "next/link";
import React, { useState } from "react";
import uploadCatch from "@/lib/uploadCatch";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type Props = {
    species: any;
    lures: any;
};

type Catch = {
	image: File | undefined | null;
	species: {
		name: string;
		id: number;
		thumbnail: string;
	} | null;
	location: {
		description: string;
		place_id: number;
	} | null;
	lure: {
		name: string;
		id: number;
		thumbnail: string;
	} | null;
	length: number | null;
};

export default function NewCatchPage({
    species,
    lures,
}: Props) {
	const [catchItem, setCatchItem] = useState<Catch>({
		image: null,
		species: null,
		location: null,
		lure: null,
		length: null,
	});

	const speciesOptions = species.map((species: any) => ({
        name: species.attributes.name,
        id: species.id,
        thumbnail: `${process.env.NEXT_PUBLIC_STRAPI_URL}${optimizedImage(species.attributes.image.data.attributes, "thumbnail")}`,
    }));

	const lureOptions = lures.map((lure: any) => ({
        name: lure.attributes.name,
        id: lure.id,
    }));

    const session = useSession();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // @ts-ignore
        const uploaded = await uploadCatch(catchItem, session.data?.strapiAccessToken);

        if (uploaded) {
            setCatchItem({
                image: null,
                species: null,
                location: null,
                lure: null,
                length: null,
            });

            // redirect to catches page after 500ms
            setTimeout(() => {
                router.push("/catches");
            }, 500);
        }
    }

	return (
		<form className="mt-36 max-w-[700px] mx-auto" onSubmit={handleSubmit}>
			<div className="flex flex-col mb-5">
				<p className="text-3xl font-semibold">Post your Catch</p>
				<p className="text-slate-500 text-lg">
					Share your catch with the world
				</p>
			</div>
			{/* file input box */}
			<div className="flex items-center justify-center w-full h-48 mb-6">
				<label
					htmlFor="file-upload"
					className="flex flex-col items-center justify-center w-full h-full p-4 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-slate-400 bg-slate-50 hover:bg-slate-100/80 transition-colors"
				>
					<div className="flex flex-col items-center justify-center">
						<i
							className={`fa-solid fa-${
								catchItem.image ? "circle-check" : "cloud-arrow-up"
							} text-4xl text-slate-600`}
						></i>
						<p className="pt-1 text-lg text-slate-600 group-hover:text-slate-800">
							{catchItem.image ? catchItem.image.name : "Upload a Picture"}
						</p>
						{catchItem.image ? (
							<>
								<p className="pt-1 text-xs tracking-wide text-slate-500">
									{Math.round(catchItem.image.size / 1024)} KB
								</p>
								<p
									className="mt-2 text-xs tracking-wide text-slate-500 py-0.5 px-2 hover:bg-slate-200 rounded-md"
								>
									Replace
								</p>
							</>
						) : (
							<p className="pt-1 text-xs tracking-wide text-slate-500">
								Max 20MB - (.jpg, .png, .webp)
							</p>
						)}
					</div>
					<input
						id="file-upload"
						type="file"
						className="hidden"
						onChange={(e) =>
							setCatchItem({ ...catchItem, image: e?.target?.files?.[0] })
						}
                        accept=".jpg,.png,.webp"
					/>
				</label>
			</div>
			<div className="flex flex-col gap-1 w-full mb-5">
				<label htmlFor="location">
					<p className="font-semibold">Location</p>
					<p className="text-sm text-slate-600 mb-2">Where did you catch it?</p>
				</label>
				<LocationDropdown
					selectedOption={catchItem.location}
					setSelectedOption={(option: any) =>
						setCatchItem({ ...catchItem, location: option })
					}
					placeholder="Search for a location..."
					required
				/>
			</div>
			<div className="flex flex-col gap-1 w-full mb-5">
				<div className="w-full flex justify-between items-end mb-2">
					<label htmlFor="location">
						<p className="font-semibold">Species</p>
						<p className="text-sm text-slate-600">What type of fish is it?</p>
					</label>
					<Link
						href="/species"
						target="_blank"
						className="text-sm px-2 py-1 hover:bg-slate-50 transition-colors translate-y-1 rounded-lg text-slate-600"
					>
						Browse Species
						<i className="fa-solid fa-external-link text-xs ml-1"></i>
					</Link>
				</div>
				<SearchableDropdown
					options={speciesOptions}
					selectedOption={catchItem.species}
					setSelectedOption={(option: any) =>
						setCatchItem({ ...catchItem, species: option })
					}
					placeholder="Select a species..."
					required
				/>
			</div>
			<div className="flex gap-4">
				<div className="flex flex-col gap-1 w-[80%] mb-5">
					<label htmlFor="location">
						<p className="font-semibold">Lure</p>
						<p className="text-sm text-slate-600 mb-2">
							What did you catch it on?
						</p>
					</label>
					<SearchableDropdown
						options={lureOptions}
						selectedOption={catchItem.lure}
						setSelectedOption={(option: any) =>
							setCatchItem({ ...catchItem, lure: option })
						}
						placeholder="Select a lure..."
						required
					/>
				</div>
				<div className="flex flex-col gap-1 w-[20%] mb-5">
					<label htmlFor="location">
						<p className="font-semibold">Length</p>
						<p className="text-sm text-slate-600 mb-2">In inches</p>
					</label>
					<div className="relative w-full">
						<input
							type="number"
							id="location"
							className="p-2 rounded-lg border w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
							placeholder="0"
                            onChange={(e) =>
                                setCatchItem({ ...catchItem, length: Number(e.target.value) })
                            }
                            step="0.1"
							required
						/>
						<p className="absolute top-2 right-2 text-slate-400">inches</p>
					</div>
				</div>
			</div>
            <button className="btn w-full mt-2">Post your Catch</button>
		</form>
	);
}

export async function getServerSideProps() {
	// fetch species and lures
	const speciesRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/species?populate=*`
	);
	const species = await speciesRes.json();

	const luresRes = await fetch(
		`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/lures?populate=*`
	);
	const lures = await luresRes.json();

    return {
        props: {
            species: species.data,
            lures: lures.data,
        },
    };
}
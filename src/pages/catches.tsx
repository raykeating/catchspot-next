import React from "react";
import CatchesSearchAndFilters from "@/components/CatchesSearchAndFilters";
import CatchCard from "@/components/CatchCard";
import CatchMap from "@/components/CatchMap";

type Props = {};

export default function Catches({}: Props) {

	return (
		<div className="h-[calc(100vh-11.7rem)] flex-col">
			<CatchesSearchAndFilters />
			<div className="border w-full flex h-full overflow-x-hidden">
				<div className="flex flex-col overflow-y-scroll shrink-0">
					<CatchCard />
					<CatchCard />
					<CatchCard />
					<CatchCard />
					<CatchCard />
					<CatchCard />
					<CatchCard />
					<CatchCard />
					<CatchCard />
				</div>
				<div className="w-full h-full relative overflow-hidden">
                    <CatchMap />
                </div>
			</div>
		</div>
	);
}

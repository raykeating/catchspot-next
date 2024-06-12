import React from "react";

type Props = {
	status: string;
};

export default function ConservationStatusMeter({ status }: Props) {
	const conservationStatusOptions = [
		{
			code: "EX",
			name: "Extinct",
			color: "#8c0a0a",
		},
		{
			code: "EW",
			name: "Extinct in the Wild",
			color: "#8c0a0a",
		},
		{
			code: "CR",
			name: "Critically Endangered",
			color: "#8c0a0a",
		},
		{
			code: "EN",
			name: "Endangered",
			color: "#8c0a0a",
		},
		{
			code: "VU",
			name: "Vulnerable",
			color: "#8c0a0a",
		},
		{
			code: "NT",
			name: "Near Threatened",
			color: "#FFA500",
		},
		{
			code: "LC",
			name: "Least Concern",
			color: "green",
		},
	];

	return (
		<div className="flex border-slate-400 border rounded-xl overflow-hidden w-fit">
			<div className="flex gap-3 p-4 py-3">
				{conservationStatusOptions.map((statusOption) => (
					<div
						className="h-9 w-9 rounded-full border-slate-400 border flex items-center justify-center"
						style={
							statusOption.name === status
								? {
										backgroundColor: statusOption.color,
										border: "none",
										color: "white",
								  }
								: {
										backgroundColor: "transparent",
								  }
						}
					>
						{statusOption.code}
					</div>
				))}
			</div>
				<div className="flex px-5 items-center font-bold text-white" style={{
                    backgroundColor: conservationStatusOptions.find(
                        (statusOption) => statusOption.name === status
                    )?.color
                }}>
					{
						conservationStatusOptions.find(
							(statusOption) => statusOption.name === status
						)?.name
					}
				</div>
		</div>
	);
}

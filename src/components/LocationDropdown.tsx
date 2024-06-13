import Image from "next/image";
import React, { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import useDebouncedEffect from "@/lib/hooks/useDebouncedEffect";

type Props = {
	selectedOption: {
		description: string;
		place_id: number;
	} | null;
	setSelectedOption: (
		option: {
			description: string;
			place_id: number;
		} | null
	) => void;
	placeholder: string;
	required?: boolean;
};

export default function LocationDropdown({
	selectedOption,
	setSelectedOption,
	placeholder,
	required = false,
}: Props) {
	const [options, setOptions] = React.useState<
		{
			description: string;
			place_id: number;
		}[]
	>([]);

	const [noResults, setNoResults] = React.useState(false);

	const [search, setSearch] = React.useState("");
	const [isOpen, setIsOpen] = React.useState(false);
	const [highlightedOption, setHighlightedOption] = React.useState<{
		description: string;
		place_id: number;
	} | null>(null);

	// close dropdown when clicked outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (!target.closest(".searchable-dropdown")) {
				setIsOpen(false);
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (isOpen) {
			// when enter is pressed, select the highlighted option
			if (event.key === "Enter") {
				if (highlightedOption) {
					setSelectedOption(highlightedOption);
					setSearch(highlightedOption.description);
					setIsOpen(false);
				}
			}

			// when arrow up/down is pressed (while dropdown is open), highlight the next/previous option
			if (event.key === "ArrowUp" || event.key === "ArrowDown") {
				if (event.key === "ArrowUp") {
					// highlight previous option
					if (highlightedOption) {
						const highlightedIndex = options.findIndex(
							(option) => option.place_id === highlightedOption.place_id
						);
						if (highlightedIndex > 0) {
							setHighlightedOption(options[highlightedIndex - 1]);
						}
					} else {
						// if no option is highlighted, highlight the last option
						setHighlightedOption(options[options.length - 1]);
					}
				} else {
					// if no option is highlighted, highlight the first option
					if (!highlightedOption) {
						setHighlightedOption(options[0]);
					} else {
						const highlightedIndex = options.findIndex(
							(option) => option.place_id === highlightedOption.place_id
						);
						if (highlightedIndex < options.length - 1) {
							setHighlightedOption(options[highlightedIndex + 1]);
						}
					}
				}
			}
		}
	}

	// ref to scroll to highlighted option
	const highlightedOptionRef = React.useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (highlightedOptionRef.current) {
			highlightedOptionRef.current.scrollIntoView({
				behavior: "instant",
				block: "nearest",
			});
		}
	}, [highlightedOption]);

	const optionsContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		optionsContainer.current && autoAnimate(optionsContainer.current);
	}, [optionsContainer]);

	// fetch options when search changes
	useDebouncedEffect(() => {

		setNoResults(false);

		if (search === "") {
			setOptions([]);
			return;
		}

		// fetch including access-control-allow-origin header
		fetch(`/api/get-location?search=${search}`)
			.then((res) => res.json())
			.then(({ data }) => {
				if (data.error_message) {
					console.error(data.error_message);
				} else {
					if (!data.predictions) {
						setNoResults(true);
						setOptions([]);
						return;
					}
					setOptions(
						data.predictions.map((prediction: any) => ({
							description: prediction.description,
							place_id: prediction.place_id,
						}))
					);
				}
			});
	}, [search], 300);

	//todo - close on click of close button, flip arrow on open
	return (
		<div className="searchable-dropdown relative w-full">
			<input
				value={selectedOption?.description || search || ""}
				onChange={(e) => {
					setIsOpen(true);
					setSelectedOption(null);
					setSearch(e.target.value);
				}}
				onKeyDown={handleKeyDown}
				className={`rounded-lg border border-grey px-4 py-2 w-full transition-all duration-75`}
				type="text"
				placeholder={placeholder}
				onClick={() => {
					setIsOpen(!isOpen);
				}}
				required={required}
			/>
			<button
				type="button"
				className="right-0 top-0 absolute flex items-center justify-center h-full w-10 rounded-r-lg"
				onClick={() => setIsOpen(!isOpen)}
			>
				<i
					className={`fas fa-angle-down transition-transform ${
						isOpen ? "!rotate-180" : ""
					}`}
				></i>
			</button>

			<div
				className={`absolute top-12 left-0 w-full p-2 min-h-11 bg-white border border-grey rounded-lg shadow-md max-h-[18rem] overflow-y-scroll minimal-scrollbar z-50 transition-all origin-top-left ${
					isOpen
						? "visible opacity-100 scale-100"
						: "invisible opacity-0 scale-90"
				}`}
				ref={optionsContainer}
			>
				{options.map((option) => (
					<button
						type="button"
						key={option.place_id}
						className={`flex text-start items-center gap-3 py-2.5 px-4 w-full hover:bg-slate-50 transition-colors rounded-lg ${
							option.place_id === selectedOption?.place_id ||
							option.place_id === highlightedOption?.place_id
								? "bg-slate-50"
								: ""
						}`}
						onClick={() => {
							setSelectedOption(option);
							setSearch(option.description);
							setIsOpen(false);
						}}
						ref={
							option.place_id === highlightedOption?.place_id
								? highlightedOptionRef
								: null
						}
					>
						{option.description}
					</button>
				))}

				{options.length === 0 && !search && (
					<p className="text-slate-400 py-1 px-2">Start typing to search</p>
				)}
				{noResults && (
					<p className="text-slate-400 py-1 px-2">No results found</p>
				)}
				{
					options.length === 0 && search && !noResults && (
						<i className="fas fa-spinner animate-spin text-slate-200 p-3"></i>
					)
				}
			</div>
		</div>
	);
}

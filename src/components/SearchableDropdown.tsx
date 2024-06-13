import Image from "next/image";
import React, { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";

type Props = {
	options: {
		name: string;
		id: number;
        thumbnail: string;
	}[];
	selectedOption: {
		name: string;
		id: number;
        thumbnail: string;
	} | null;
	setSelectedOption: (option: { name: string; id: number; thumbnail: string; } | null) => void;
	placeholder: string;
    required?: boolean;
};

export default function SearchableCountriesDropdown({
	options,
	selectedOption,
	setSelectedOption,
    placeholder,
    required = false,
}: Props) {
	const [search, setSearch] = React.useState("");
	const [isOpen, setIsOpen] = React.useState(false);
	const [highlightedOption, setHighlightedOption] = React.useState<{
		name: string;
		id: number;
        thumbnail: string;
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
					setSearch(highlightedOption.name);
					setIsOpen(false);
				}
			}

			// when arrow up/down is pressed (while dropdown is open), highlight the next/previous option
			if (event.key === "ArrowUp" || event.key === "ArrowDown") {
				if (event.key === "ArrowUp") {
					// highlight previous option

					let filteredOptions;

					if (search === "") {
						filteredOptions = options;
					} else {
						filteredOptions = options.filter((option) =>
							option.name.toLowerCase().includes(search.toLowerCase())
						);
					}

					// if no option is highlighted, highlight the previous option
					if (!highlightedOption) {
						setHighlightedOption(filteredOptions[filteredOptions.length - 1]);
					} else {
						const highlightedIndex = filteredOptions.findIndex(
							(option) => option.id === highlightedOption.id
						);
						if (highlightedIndex > 0) {
							setHighlightedOption(filteredOptions[highlightedIndex - 1]);
						}
					}
				} else {
					// highlight next option

					let filteredOptions;

					if (search === "") {
						filteredOptions = options;
					} else {
						filteredOptions = options.filter((option) =>
							option.name.toLowerCase().includes(search.toLowerCase())
						);
					}

					// if no option is highlighted, highlight the first option
					if (!highlightedOption) {
						setHighlightedOption(filteredOptions[0]);
					} else {
						const highlightedIndex = filteredOptions.findIndex(
							(option) => option.id === highlightedOption.id
						);
						if (highlightedIndex < filteredOptions.length - 1) {
							setHighlightedOption(filteredOptions[highlightedIndex + 1]);
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

	//todo - close on click of close button, flip arrow on open
	return (
		<div className="searchable-dropdown relative w-full">
			<input
				value={selectedOption?.name || search || ""}
				onChange={(e) => {
					setIsOpen(true);
					setSelectedOption(null);
					setSearch(e.target.value);
				}}
				onKeyDown={handleKeyDown}
				className={`rounded-lg border border-grey px-4 py-2 w-full transition-all duration-75 ${
					selectedOption && selectedOption?.thumbnail ? "pl-11" : ""
				}`}
				type="text"
				placeholder={placeholder}
				onClick={() => {
					setIsOpen(!isOpen);
				}}
                required={required}
			/>
			{selectedOption?.thumbnail && (
				// image goes here
                <Image src={selectedOption.thumbnail} alt="" width={24} height={24} className="absolute left-3 top-[0.55rem] rounded-full h-6 w-6" />
			)}
			<button type="button" className="right-0 top-0 absolute flex items-center justify-center h-full w-10 rounded-r-lg" onClick={
				() => setIsOpen(!isOpen)
			}>
				<i className={`fas fa-angle-down transition-transform ${
					isOpen ? "!rotate-180" : ""
				}`}></i>
			</button>

			<div className={`absolute top-12 left-0 w-full p-2 bg-white border border-grey rounded-lg shadow-md max-h-[12rem] overflow-y-scroll minimal-scrollbar z-50 transition-all origin-top-left ${
				isOpen ? "visible opacity-100 scale-100" : "invisible opacity-0 scale-90"
			}`} ref={optionsContainer}>
				{options
					.filter((option) =>
						option.name.toLowerCase().includes(search.toLowerCase())
					)
					.map((option) => (
						<button
                            type="button"
							key={option.id}
							className={`flex text-start items-center gap-3 p-3 px-4 w-full hover:bg-slate-50 transition-colors rounded-lg ${
								option.id === selectedOption?.id ||
								option.id === highlightedOption?.id
									? "bg-slate-50"
									: ""
							}`}
							onClick={() => {
								setSelectedOption(option);
								setSearch(option.name);
								setIsOpen(false);
							}}
							ref={
								option.id === highlightedOption?.id
									? highlightedOptionRef
									: null
							}
						>
							{/* image goes here */}
                            {
                                option?.thumbnail &&
                                <Image src={option.thumbnail} alt="" width={24} height={24} className="rounded-full h-6 w-6" />
                            }
							{option.name}
						</button>
					))}

				{options.filter((option) =>
					option.name.toLowerCase().includes(search.toLowerCase())
				).length === 0 && (
					<div className="p-3 px-4 text-grey">No results found</div>
				)}
			</div>
		</div>
	);
}
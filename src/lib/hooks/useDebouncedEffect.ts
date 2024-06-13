import { useEffect, useRef } from "react";

/**
 * Custom hook that delays the execution of a function until after a specified delay.
 * @param effect - The effect function to execute.
 * @param deps - The dependencies array for the effect function.
 * @param delay - The delay in milliseconds to wait before executing the effect function.
 */
const useDebouncedEffect = (effect: () => void, deps: any[], delay: number) => {
	const callback = useRef(effect);

	useEffect(() => {
		callback.current = effect;
	}, [effect]);

	useEffect(() => {
		const handler = setTimeout(() => {
			callback.current();
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [...deps, delay]);
};

export default useDebouncedEffect;
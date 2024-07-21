/**
 * Merges classes
 * @param classes Array of strings that will be merged into a single string
 */
export const mergeClasses = (classes: string[]): string => {
	return classes.join(" ").trim();
};

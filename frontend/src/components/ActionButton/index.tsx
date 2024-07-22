import * as React from "react";

import { mergeClasses } from "../../utils";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const ActionButton = React.forwardRef<
	HTMLButtonElement,
	ButtonProps & {
		loading?: boolean;
	}
>(({ className, loading, ...props }, ref) => {
	return (
		<button
			className={mergeClasses([
				"w-10 h-10  grid place-content-center rounded-md transition-all ring-offset-transparent ring-orange-600/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				className || "",
			])}
			ref={ref}
			{...props}
		>
			{loading && (
				<div className="flex items-center justify-center">
					<div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-current"></div>
				</div>
			)}
			{!loading && props.children}
		</button>
	);
});

export { ActionButton };

import * as React from "react";

import { mergeClasses } from "../../utils";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<
	HTMLButtonElement,
	ButtonProps & {
		loading?: boolean;
	}
>(({ className, loading, ...props }, ref) => {
	return (
		<button
			className={mergeClasses([
				"bg-orange-600 text-white font-medium text-base py-3 rounded-lg w-max max-w-full mx-auto px-8 h-12 ring-offset-transparent ring-orange-600/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				className || "",
			])}
			ref={ref}
			{...props}
		>
			{loading && (
				<div className="flex items-center justify-center">
					<div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-white"></div>
				</div>
			)}
			{!loading && props.children}
		</button>
	);
});

export { Button };

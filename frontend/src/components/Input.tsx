import * as React from "react";

import { mergeClasses } from "../utils";
import { XMarkIcon } from "@heroicons/react/24/solid";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<
	HTMLInputElement,
	InputProps & {
		invalid?: boolean;
	}
>(({ className, type, invalid, ...props }, ref) => {
	return (
		<div className="relative">
			<input
				type={type}
				className={mergeClasses([
					"bg-white flex h-12 w-full rounded-md border border-input px-3 py-2 ring-offset-transparent placeholder:text-slate-500 ring-orange-600/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className || "",
					!!invalid ? "border-red-700" : "",
				])}
				ref={ref}
				{...props}
			/>
			{!!invalid && (
				<XMarkIcon className="w-6 h-6 text-red-700 absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none" />
			)}
		</div>
	);
});

export { Input };

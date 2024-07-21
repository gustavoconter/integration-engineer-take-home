import React, { useState } from "react";
import { ZodIssue, ZodTypeAny } from "zod";
import _ from "lodash";

export default function <T>(schema: ZodTypeAny, initialData: T) {
	const [form, setForm] = useState<T>({ ...initialData });

	const [errors, setErrors] = useState<Record<string, ZodIssue[]>>({});
	const [isValid, setIsValid] = useState<boolean>(true);
	const [validationStarted, setValidationStarted] = useState(false);

	/**
	 * Handles input changes
	 */
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		fieldName: string
	) => {
		const type = e.target.type;
		const value = type !== "checkbox" ? e.target.value : e.target.checked;

		setForm({ ...form, [fieldName]: value });
	};

	/**
	 * Sets the data directly
	 */
	const setData = (fieldName: string, value: unknown) => {
		setForm({ ...form, [fieldName]: value });
	};

	/**
	 * Resets the form to the initial state
	 */
	const reset = () => {
		setForm({ ...initialData });
        clearValidation();
        clearErrors();
	};

	/**
	 * Watches for further changes in the form data to automatically validate it
	 */
	React.useEffect(() => {
		if (validationStarted) {
			validate();
		}
	}, [form]);

	/**
	 * Function to validate the form data using the Zod schema
	 */
	const validate = async () => {
		clearErrors();

		const result = await schema.safeParseAsync(form);

		if (!result.success) {
			setErrors(_.groupBy(result.error.errors, "path"));
			setValidationStarted(true);
		}

		setIsValid(result.success);

		return result.success;
	};

	/**
	 * Returns the error message for a specific field
	 */
	const getError = (path: string): string => {
		const error: ZodIssue | null = errors?.[path]?.[0] || null;

		if (!error) {
			return "";
		}

		/**
		 * Get the message from the error object
		 */
		let message = error.message || "";

		/**
		 * Remove the field type from the message
		 */
		const types = ["String"];

		types.forEach((type) => {
			message = message.replace(type, "").trim();
		});

		/**
		 * Capitalize the first letter of the message
		 */
		message = message.charAt(0).toUpperCase() + message.slice(1);

		return message;
	};

	/**
	 * Clear the errors object
	 */
	const clearErrors = () => {
		setErrors({});
	};

	/**
	 * Clears the validation state, useful when the form is reset
	 */
	const clearValidation = () => {
		setValidationStarted(false);
	};

	return {
		isValid,
		data: form,
		handleChange,
		validate,
		getError,
		getErrors: () => errors,
		clearErrors,
		setData,
		clearValidation,
		reset,
	};
}

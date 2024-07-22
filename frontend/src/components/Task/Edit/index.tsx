import React, { useMemo } from "react";
import { z } from "zod";
import useForm from "../../../hooks/useForm";
import { Input } from "../../Input";
import { Button } from "../../Button";
import { Task } from "../../../types";

const TaskEdit: React.FC<{
	task: Task;
	onEdit: (task: Task) => void | Promise<void>;
	onCancel: () => void;
	isEditing?: boolean;
}> = ({ task, onCancel, onEdit, isEditing }) => {
	/**
	 * Define the schema for the form
	 */
	const schema = z.object({
		title: z.string().min(4).max(50),
		description: z.string().min(4).max(255),
	});

	/**
	 * Create a form helper using the useForm hook
	 */
	const form = useForm<z.infer<typeof schema>>(schema, {
		title: task.title,
		description: task.description,
	});

	const editTask = async () => {
		const isValid = await form.validate();

		if (!isValid) {
			return;
		}

		/**
		 * Call the onEdit function with the form data
		 */
		onEdit({
			...task,
			title: form.data.title as string,
			description: form.data.description as string,
		});
	};

	/**
	 * Disable the button if the form has not changed
	 * This prevents editing the task with the same old data
	 */
	const hasChanged = useMemo(() => {
		return (
			task.title !== form.data.title ||
			task.description !== form.data.description
		);
	}, [form.data]);

	return (
		<div className="bg-transparent p-4 border-t mt-4 border-gray-400">
			<h2 className="sr-only">Editing task: {task.title}</h2>

			<form
				className="flex flex-col gap-4"
				onSubmit={(e) => {
					e.preventDefault();
					editTask();
				}}
			>
				<div>
					<Input
						type="text"
						placeholder="Enter the task title"
						value={form.data.title as string}
						minLength={4}
						maxLength={50}
						onChange={(e) => form.handleChange(e, "title")}
						invalid={!!form.getError("title")}
					/>
					<span className="text-red-600 text-sm text-start block mt-1">
						{form.getError("title")}
					</span>
				</div>

				<div>
					<Input
						type="text"
						placeholder="Enter the task description"
						minLength={4}
						maxLength={255}
						value={form.data.description as string}
						onChange={(e) => form.handleChange(e, "description")}
						invalid={!!form.getError("description")}
					/>
					<span className="text-red-600 text-sm text-start block mt-1">
						{form.getError("description")}
					</span>
				</div>

				<div className="flex justify-end gap-4">
					<Button
						type="button"
						className="w-max saturate-0 mx-0"
						onClick={onCancel}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						className="w-max mx-0"
						loading={isEditing}
						disabled={isEditing || !hasChanged}
					>
						Edit Task
					</Button>
				</div>
			</form>
		</div>
	);
};

export default TaskEdit;

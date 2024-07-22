import React, { useState } from "react";
import { z } from "zod";
import useForm from "../hooks/useForm";
import { Input } from "./Input";
import { Button } from "./Button";

const TaskCreationForm: React.FC<{
	onTaskCreated: () => void;
}> = ({ onTaskCreated }) => {
	const [creatingTask, setCreatingTask] = useState(false);

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
		title: "",
		description: "",
	});

	/**
	 *
	 */
	const createTask = async () => {
		const isValid = await form.validate();

		if (!isValid) {
			return;
		}

		setCreatingTask(true);

		/**
		 * Send a POST request to the server to create a new task
		 */
		fetch("http://localhost:8000/tasks", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(form.data),
		}).then(async (response) => {
			const data = await response.json();
			setTimeout(() => {
				form.reset();
				setCreatingTask(false);
				onTaskCreated();
			}, 1000);
		});
	};

	return (
		<div className="text-center bg-slate-100 rounded-lg mt-16 p-4">
			<h2 className="font-medium text-xl">Create a new task</h2>

			<form
				className="flex flex-col gap-4 mt-4"
				onSubmit={(e) => {
					e.preventDefault();
					createTask();
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

				<Button
					type="submit"
					className="w-max mx-auto"
					loading={creatingTask}
					disabled={creatingTask}
				>
					Create Task
				</Button>
			</form>
		</div>
	);
};

export default TaskCreationForm;

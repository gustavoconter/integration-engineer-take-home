import React, { useState } from "react";
import { ActionButton } from "../../ActionButton";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { TaskListEmpty } from "./Empty";
import { Alert, ApiTaskResponse, Task } from "../../../types";
import { mergeClasses } from "../../../utils";
import TaskEdit from "../Edit";

const TaskList: React.FC<{
	tasks: Task[];
	addAlert: (alert: Alert) => void;
	setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}> = ({ tasks, addAlert, setTasks }) => {
	/**
	 * Controls the state of the task being deleted
	 */
	const [taskBeingDeleted, setTaskBeingDeleted] = useState<string | null>(null);
	const [deletingTask, setDeletingTask] = useState(false);

	/**
	 * Deletes a specific task
	 * @param id The uuid of the task to be deleted
	 */
	const deleteTask = async (id: string) => {
		setTaskBeingDeleted(id);
		setDeletingTask(true);

		fetch(`http://localhost:8000/tasks/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then(async (response) => {
				const data = (await response.json()) as ApiTaskResponse;

				const tasks = data.data?.tasks || [];

				setTasks(tasks);

				addAlert({
					type: "success",
					message: "Task deleted successfully",
				});

				/**
				 * Reset the deleting task state
				 */
				setTaskBeingDeleted(null);
				setDeletingTask(false);
			})
			.catch(() => {
				addAlert({
					type: "error",
					message: "An error occurred while deleting the task",
				});
				setTaskBeingDeleted(null);
				setDeletingTask(false);
			});
	};

	const [taskBeingEdited, setTaskBeingEdited] = useState<string | null>(null);
	const [editingTask, setEditingTask] = useState(false);

	/**
	 * Edits a specific task
	 * @param task The task that will overwrite the existing task
	 */
	const editTask = async (task: Task) => {
		setEditingTask(true);

		/**
		 * Send a POST request to the server to create a new task
		 */
		fetch("http://localhost:8000/tasks/" + task.id, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title: task.title,
				description: task.description,
			}),
		})
			.then(async (response) => {
				const data = (await response.json()) as ApiTaskResponse;
				const tasks = data.data?.tasks || [];
				setTasks(tasks);
				addAlert({
					type: "success",
					message: "Task edited successfully",
				});
				/**
				 * Reset the form and set the creating task state to false
				 */
				setEditingTask(false);
				cancelEdit();
			})
			.catch(() => {
				addAlert({
					type: "error",
					message: "Failed to edit task",
				});
				setEditingTask(false);
			});
	};

	/**
	 * Cancels the edit operation
	 */
	const cancelEdit = () => {
		setTaskBeingEdited(null);
		setEditingTask(false);
	};

	return (
		<div className="text-center bg-slate-100 rounded-lg mt-16 p-4">
			<h2 className="font-medium text-xl">View your current tasks</h2>
			<div className="mt-4">
				<div className="text-start flex flex-col gap-2">
					{tasks.map((task) => (
						<div key={task.id}>
							<div
								className={mergeClasses([
									"flex py-2 px-4 bg-white rounded-md",
									taskBeingEdited === task.id
										? "pointer-events-none opacity-25 select-none"
										: "",
								])}
							>
								<div className="grow flex flex-col">
									<h3
										className="font-medium block truncate max-w-[20ch]"
										title={task.title}
									>
										{task.title}
									</h3>
									<p
										className="text-slate-500 text-sm mt-1 block truncate max-w-[25ch]"
										title={task.description}
									>
										{task.description}
									</p>
								</div>
								<div className="flex items-center grow-0 shrink-0 gap-2">
									<ActionButton
										className="bg-cyan-100 hover:bg-cyan-300 text-cyan-500"
										onClick={() => {
											setTaskBeingEdited(task.id);
										}}
									>
										<PencilIcon className="w-5 h-5" />
									</ActionButton>
									<ActionButton
										className="bg-red-100  hover:bg-red-300 text-red-500"
										onClick={() => deleteTask(task.id)}
										loading={deletingTask && taskBeingDeleted === task.id}
										disabled={deletingTask && taskBeingDeleted === task.id}
									>
										<TrashIcon className="w-5 h-5" />
									</ActionButton>
								</div>
							</div>
							{taskBeingEdited === task.id && (
								<TaskEdit
									task={task}
									onCancel={cancelEdit}
									onEdit={editTask}
									isEditing={editingTask && taskBeingEdited === task.id}
									key={task.id}
								/>
							)}
						</div>
					))}
					{tasks.length === 0 && <TaskListEmpty />}
				</div>
			</div>
		</div>
	);
};

export { TaskList };

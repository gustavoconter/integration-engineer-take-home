import { useState, useEffect } from "react";
import TaskCreationForm from "./components/TaskCreationForm";

type Task = {
	id: string;
	title: string;
	description: string;
};

function App() {
	const [tasks, setTasks] = useState<Task[]>([]);

	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = async () => {
		const response = await fetch("http://localhost:8000/tasks");
		const tasks = await response.json();
		setTasks(tasks);
	};

	const deleteTask = async (id: string) => {};

	return (
		<main id="tasks">
			<section className="py-16 text-center bg-white">
				<div className="container mx-auto max-w-3xl">
					<h1 className="font-bold text-3xl text-orange-800">
						Task Management App
					</h1>
					<TaskCreationForm
						onTaskCreated={fetchTasks}
						key={"taskCreationForm"}
					/>
					<div className="text-center bg-slate-100 rounded-lg mt-16 p-4">
						<h2 className="font-medium text-xl">View your current tasks</h2>
						<div className="mt-4">
							<ul className="text-start flex flex-col gap-2">
								{tasks.map((task) => (
									<li
										key={task.id}
										className="flex py-2 px-4 bg-white rounded-md"
									>
										<div className="grow flex flex-col">
											<h3 className="font-medium">{task.title}</h3>
											<p className="text-slate-500 text-sm mt-1">
												{task.description}
											</p>
										</div>
										<div className="grid place-content-center grow-0 shrink-0">
											<button onClick={() => deleteTask(task.id)}>D</button>
										</div>
									</li>
								))}
								{tasks.length === 0 && (
									<li className="text-orange-950 text-center mt-4">
										<div className="mx-auto grid place-content-center h-12 w-12 rounded-full text-2xl text-orange-600 bg-orange-600/5 mb-4">
											:(
										</div>
										No tasks found. <br />
										Fill in the form above to create your first task!
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default App;

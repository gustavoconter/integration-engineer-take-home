import { useState, useEffect, useMemo } from "react";
import TaskCreate from "./components/Task/Create";
import { TaskList } from "./components/Task/List";
import { Alert, ApiTaskResponse, Task } from "./types";
import Alerts from "./components/Alerts";

function App() {
	const [tasks, setTasks] = useState<Task[]>([]);

	/**
	 * When the component mounts, fetch the tasks from the server
	 */
	useEffect(() => {
		fetchTasks();
	}, []);

	/**
	 * Fetches the tasks from the server on the initial render
	 */
	const fetchTasks = async () => {
		const response = await fetch("http://localhost:8000/tasks");

		const json = (await response.json()) as ApiTaskResponse;

		const tasks = json.data?.tasks || [];

		setTasks(tasks);
	};

	/**
	 * Alerts state
	 */
	const [rawAlerts, setAlerts] = useState<{
		[key: string]: Alert;
	}>({});

	/**
	 * Convert the alerts object to an array
	 */
	const alerts = useMemo(() => {
		return Object.values(rawAlerts);
	}, [rawAlerts]);

	/**
	 * Adds an alert to the alerts state
	 * @param alert The alert to be added
	 * @returns void
	 */
	const addAlert = (alert: Alert) => {
		/**
		 * Generate a random id for the alert
		 */
		const alertId = Math.ceil(Math.random() * 1000000);

		/**
		 * Add the alert to the alerts state
		 */
		setAlerts((state) => {
			state[alertId] = alert;
			return {
				...state,
			};
		});

		/**
		 * Remove the alert after 5 seconds
		 */
		setTimeout(() => {
			setAlerts((state) => {
				delete state[alertId];
				return {
					...state,
				};
			});
		}, 2500);
	};

	return (
		<main id="tasks">
			<Alerts alerts={alerts} />
			<section className="py-16 text-center bg-white">
				<div className="container mx-auto max-w-3xl">
					<h1 className="font-bold text-3xl text-orange-800">
						Task Management App
					</h1>
					<TaskCreate addAlert={addAlert} setTasks={setTasks} />
					<TaskList tasks={tasks} addAlert={addAlert} setTasks={setTasks} />
				</div>
			</section>
		</main>
	);
}

export default App;

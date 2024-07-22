const TaskListEmpty = () => {
	return (
		<li className="text-orange-950 text-center mt-4">
			<div className="mx-auto grid place-content-center h-12 w-12 rounded-full text-2xl text-orange-600 bg-orange-600/5 mb-4">
				:(
			</div>
			No tasks found. <br />
			Fill in the form above to create your first task!
		</li>
	);
};

export { TaskListEmpty };
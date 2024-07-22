const { v4: generateUuidv4 } = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const z = require("zod");

const app = express();
const PORT = process.env.PORT || 8000;

/**
 * Setup the middlewares
 */
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

/**
 * Zod schemas to validate required data
 */
const CREATE_TASK_SCHEMA = z.object({
	title: z.string().min(4).max(50),
	description: z.string().min(4).max(255),
});

const EDIT_TASK_SCHEMA = z.object({
	title: z.string().min(4).max(50).optional(),
	description: z.string().min(4).max(255).optional(),
});

/**
 * Use a map to simplify the get and delete operations
 */
const tasks = new Map();

/**
 * Get all tasks
 */
app.get("/tasks", (req, res) => {
	/**
	 * Return all tasks
	 */
	res.status(200).json({
		data: {
			tasks: Array.from(tasks.values()),
		},
	});
});

/**
 * Insert a new task
 */
app.post("/tasks", async (req, res) => {
	/**
	 * Get required data from the body
	 */
	const { title, description } = req.body;

	/**
	 * Validate the required data using a zod schema
	 */
	const validation = CREATE_TASK_SCHEMA.safeParse({ title, description });

	if (!validation.success) {
		res.status(400).json({
			data: {},
			error: {
				message:
					"The submitted data is invalid. Title and description are required.",
			},
		});
		return;
	}

	/**
	 * Create a new task object
	 */
	const newTask = {
		id: generateUuidv4(),
		title,
		description,
        createdAt: new Date().toISOString(),
        updatedAt: null,
	};

	/**
	 * Save the new task
	 */
	tasks.set(newTask.id, newTask);

	/**
	 * Return all tasks
	 */
	res.status(201).json({
		data: {
			tasks: Array.from(tasks.values()),
		},
	});
});

/**
 * Delete a task
 */
app.delete("/tasks/:id", (req, res) => {
	/**
	 * Get and validate the task id
	 */
	const { id } = req.params;

	if (!id || id === "") {
		return res.status(400).json({
			data: {},
			error: {
				message: "Task id is required.",
			},
		});
	}

	/**
	 * Verify if the task exists
	 */
	if (!tasks.has(id)) {
		return res.status(404).json({
			data: {},
			error: {
				message: "Task not found.",
			},
		});
	}

	/**
	 * Delete the task
	 */
	tasks.delete(id);

	/**
	 * Return all tasks
	 */
	res.status(200).json({
		data: {
			tasks: Array.from(tasks.values()),
		},
	});
});

/**
 * Edit a task
 */
app.put("/tasks/:id", (req, res) => {
	/**
	 * Get and validate the task id
	 */
	const { id } = req.params;

	if (!id || id === "") {
		return res.status(400).json({
			data: {},
			error: {
				message: "Task id is required.",
			},
		});
	}

	/**
	 * Verify if the task exists
	 */
	if (!tasks.has(id)) {
		return res.status(404).json({
			data: {},
			error: {
				message: "Task not found.",
			},
		});
	}

	/**
	 * Get the task data
	 */
	const task = tasks.get(id);

	/**
	 * Get and validate the new task data
	 */
	const { title, description } = req.body;

    const validation = EDIT_TASK_SCHEMA.safeParse({ title, description });

    if (!validation.success) { 
        return res.status(400).json({
            data: {},
            error: {
                message: "The submitted data is invalid.",
            },
        });
    }

	/**
	 * Update the task data, uses the || operator to make sure that if, the value is not provided, it default to the old value
	 */
	task.title = title || task.title;
	task.description = description || task.description;

    /**
     * Change the updatedAt only if one of the values is different from the old one
     */
    if (title !== task.title || description !== task.description) {
        task.updatedAt = new Date().toISOString();
    }

	/**
	 * Return all tasks
	 */
	res.status(200).json({
		data: {
			tasks: Array.from(tasks.values()),
		},
	});
});

/**
 * Start the server
 */
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
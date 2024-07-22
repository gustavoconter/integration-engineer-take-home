export type Task = {
	id: string;
	title: string;
	description: string;
	createdAt: string;
	updatedAt: string;
};

export type ApiBaseResponse<T> = {
	data: T;
	errors?: {
		message: string;
	}[];
};

export type ApiTaskResponse = ApiBaseResponse<{
	tasks: Task[];
}>;

export type Alert = {
	type: "error" | "success";
	message: string;
};

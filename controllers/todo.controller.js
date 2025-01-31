const Todo = require("../models/todo");
const { validateCreateTodo, validateEditTodo } = require("../utils/validator");

module.exports = {
	getAllTodos: async (req, res, next) => {
		try {

		} catch (err) {
			next(err);
		}
	},
	getTodoById: async (req, res, next) => {
		try {
			const todo = await Todo.getById({
				userId: req.userId,
				includeSubTodos: req.query.includeSubTodos,
				todoId: req.params.id,
			});

			return res.status(200).json({
				status: 'success',
				message: 'Successfully retrieved a task.',
				data: {
					todo,
				},
			});
		} catch (err) {
			next(err);
		}
	},
	createTodo: async (req, res, next) => {
		try {
			const { error, value } = validateCreateTodo(req.body);

			if (error) {
				throw error;
			}

			const todo = await Todo.create({ userId: req.userId, value });

			return res.status(201).json({
				status: 'success',
				message: 'Successfully added a new task.',
				data: {
					todo: {
						id: todo.insertedId.toString(),
					},
				},
			});
		} catch (err) {
			next(err);
		}
	},
	editTodoById: async (req, res, next) => {
		try {
			const { error, value } = validateEditTodo(req.body);

			if (error) {
				throw error;
			}

			const todo = await Todo.update({
				userId: req.userId,
				value,
				todoId: req.params.id,
			});

			return res.status(200).json({
				status: 'success',
				message: 'Successfully edited a task.',
				data: {
					todo: {
						id: todo._id.toString(),
					},
				},
			});
		} catch (err) {
			next(err);
		}
	},
	deleteTodoById: async (req, res, next) => {
		try {
			await Todo.delete({ userId: req.userId, todoId: req.params.id });

			return res.status(200).json({
				status: 'success',
				message: 'Successfully deleted a task.'
			});
		} catch (err) {
			next(err);
		}
	},
};

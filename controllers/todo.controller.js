const Todo = require("../models/todo");
const { validateCreateTodo } = require("../utils/validator");

module.exports = {
	getAllTodos: async (req, res, next) => {
		try {

		} catch (err) {
			next(err);
		}
	},
	getTodoById: async (req, res, next) => {
		try {

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

			const todo = await Todo.createTodo({ userId: req.userId, value });

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

		} catch (err) {
			next(err);
		}
	},
	deleteTodoById: async (req, res, next) => {
		try {
			
		} catch (err) {
			next(err);
		}
	},
};

const router = require('express').Router();
const {
	getAllTodos,
	getTodoById,
	createTodo,
	editTodoById,
	deleteTodoById,
} = require('../controllers/todo.controller');
const { verifyToken } = require('../middlewares/authentication');
const { todoIdPathValidator } = require('../middlewares/pathParamsValidator');

router.get(
	'/todos',
	getAllTodos
);

router.get(
	'/todos/:id',
	verifyToken,
	todoIdPathValidator,
	getTodoById
);

router.post(
	'/todos',
	verifyToken,
	createTodo
);

router.patch(
	'/todos/:id',
	verifyToken,
	todoIdPathValidator,
	editTodoById
);

router.delete(
	'/todos/:id',
	verifyToken,
	todoIdPathValidator,
	deleteTodoById
);

module.exports = router;

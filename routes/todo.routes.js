const router = require("express").Router();
const {
	getAllTodos,
	getTodoById,
	createTodo,
	editTodoById,
	deleteTodoById,
} = require("../controllers/todo.controller");
const {
	verifyToken,
} = require("../middlewares/authentication");

router.get("/todos", getAllTodos);
router.get("/todos/:id", getTodoById);
router.post("/todos", verifyToken, createTodo);
router.patch("/todos/:id", verifyToken, editTodoById);
router.delete("/todos/:id", verifyToken, deleteTodoById);

module.exports = router;

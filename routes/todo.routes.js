const router = require("express").Router();
const {
  getAllTodos,
  getTodoById,
  createTodo,
  editTodoById,
  deleteTodoById,
} = require("../controllers/todo.controller");
const { verifyToken } = require('../middlewares/authentication');
const { authorizeUserId } = require("../middlewares/authorization");

router.get('/todos', getAllTodos);
router.get('/todos/:id', getTodoById);
router.post('/todos', verifyToken, createTodo);
router.patch('/todos/:id', editTodoById);
router.delete('/todos/:id', deleteTodoById);

module.exports = router;

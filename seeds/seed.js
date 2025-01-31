require('dotenv').config();
const { connectToDB } = require('../configs/mongodb');
const { ObjectId } = require('mongodb');
const todos = require('./todo.json');

const seedDatabase = async (data) => {
    try {
        todos.forEach((todo) => {
            todo.userId = ObjectId.createFromHexString(todo.userId);
            todo.onDate = new Date(todo.onDate);
            todo.dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
            todo.doneAt = todo.doneAt ? new Date(todo.doneAt) : null;
            todo.createdAt = new Date(todo.createdAt);
            todo.updatedAt = new Date(todo.updatedAt);

            todo.subTodos?.forEach((subTodo) => {
                subTodo.dueDate = subTodo.dueDate ? new Date(subTodo.dueDate) : null;
                subTodo.doneAt = subTodo.doneAt ? new Date(subTodo.doneAt) : null;
                subTodo.createdAt = new Date(subTodo.createdAt);
                subTodo.updatedAt = new Date(subTodo.updatedAt);
            });
        });

        const db = await connectToDB();
        await db.collection('todo').insertMany(data);
        return todos.length;
    } catch (err) {
        throw err;
    }
};

seedDatabase(todos)
    .then((len) => {
        console.log(`Successfully inserted ${len} documents.`);
        process.exit(0);
    })
    .catch((err) => {
        console.log(`Failed to insert documents: ${err.message}`);
        process.exit(1);
    });
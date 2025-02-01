require('dotenv').config();
const { connectToDB } = require('../configs/mongodb');
const { ObjectId } = require('mongodb');
const todos = require('./todo.json');
const bcrypt = require('bcrypt');

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
        const todoResult = await db.collection('todo').insertMany(data);

        const userResult = await db.collection('user').insertMany([
            {
                _id: ObjectId.createFromHexString('6798a893be24105219451bc9'),
                fullName: 'Test User 1',
                email: 'user1@test.com',
                password: await bcrypt.hash('password123', 10),
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
            },
            {
                _id: ObjectId.createFromHexString('6798a893be24105219451bc1'),
                fullName: 'Test User 2',
                email: 'user2@test.com',
                password: await bcrypt.hash('password123', 10),
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
            },
        ]);

        return {
            todoLength: todoResult.insertedCount,
            userLength: userResult.insertedCount, 
        };
    } catch (err) {
        throw err;
    }
};

seedDatabase(todos)
    .then((data) => {
        console.log(`Successfully inserted ${data.todoLength + data.userLength} documents.`);
        process.exit(0);
    })
    .catch((err) => {
        console.log(`Failed to insert documents: ${err.message}`);
        process.exit(1);
    });
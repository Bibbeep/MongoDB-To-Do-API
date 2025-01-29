const { connectToDB } = require('../configs/mongodb');
const { ObjectId } = require('mongodb');
const APIError = require('../utils/error');

class Todo {
    static async create(data) {
        const {
            userId,
            value
        } = data;

        const {
            title,
            note = null,
            onDate,
            dueDate = null,
            subTodos = null,
        } = value;

        const db = await connectToDB();
        const now = new Date(Date.now());
        
        const returnData = await db.collection('todo').insertOne({
            userId: ObjectId.createFromHexString(userId),
            title,
            note,
            onDate: new Date(onDate),
            dueDate: dueDate ? new Date(dueDate) : null,
            subTodos: subTodos.length ? subTodos.map((todo) => {
                return {
                    title: todo.title,
                    note: todo.note || null,
                    dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
                    isDone: false,
                    doneAt: null,
                    createdAt: now,
                    updatedAt: now,
                };
            }) : null,
            isDone: false,
            doneAt: null,
            createdAt: now,
            updatedAt: now,
        });

        return returnData;
    }

    static async delete(data) {
        const {
            userId,
            todoId
        } = data;

        const db = await connectToDB();
        const todo = await db.collection('todo').findOne(
            { _id: ObjectId.createFromHexString(todoId) },
            { userId: true }
        );

        if (!todo) {
            throw new APIError(404, 'Todo does not exist!');
        } else if (todo.userId.toString() !== userId) {
            throw new APIError(403, 'Unauthorized! Cannot access other user\'s todo.');
        }

        await db.collection('todo').deleteOne({ _id: todo._id });
    }
}

module.exports = Todo;
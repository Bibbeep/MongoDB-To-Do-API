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

    static async update(data) {
        const {
            userId,
            value,
            todoId,
        } = data;

        const {
            title = undefined,
            note = undefined,
            onDate = undefined,
            dueDate = undefined,
            isDone = undefined,
            subTodos = undefined,
        } = value;

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

        const now = new Date(Date.now());

        const updatedTodo = await db.collection('todo').findOneAndUpdate(
            { _id: todo._id },
            {
                $set: {
                    title,
                    note,
                    onDate: onDate ? new Date(onDate) : undefined,
                    dueDate: dueDate ? new Date(dueDate) : undefined,
                    isDone,
                    doneAt: isDone === true ? now : undefined,
                    subTodos: subTodos?.length ? subTodos.map((todo) => {
                        return {
                            title: todo.title || undefined,
                            note: todo.note || undefined,
                            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
                            isDone: todo.isDone || undefined,
                            doneAt: todo.isDone === true ? now : undefined,
                            updatedAt: now,
                        };
                    }) : undefined,
                    updatedAt: now,
                },
            },
            { returnDocument: 'after' },
        );

        return updatedTodo;
    }
}

module.exports = Todo;
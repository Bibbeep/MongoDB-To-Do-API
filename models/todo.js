const { connectToDB } = require('../configs/mongodb');
const { ObjectId } = require('mongodb');

class Todo {
    static async createTodo(data) {
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
}

module.exports = Todo;
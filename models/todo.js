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

    static async getById(data) {
        const {
            userId,
            includeSubTodos,
            todoId,
        } = data;

        const isIncludeSubTodos = includeSubTodos ? (includeSubTodos === 'true') : true;
        const projection = isIncludeSubTodos ? undefined : { subTodos: isIncludeSubTodos };

        const db = await connectToDB();
        const todo = await db.collection('todo').findOne(
            { _id: ObjectId.createFromHexString(todoId) },
            { projection },
        );

        if (!todo) {
            throw new APIError(404, 'Todo does not exist!');
        } else if (todo.userId.toString() !== userId) {
            throw new APIError(403, 'Unauthorized! Cannot access other user\'s todo.');
        }

        const returnData = {
            id: todo._id.toString(),
            title: todo.title,
            note: todo.note,
            onDate: todo.onDate,
            dueDate: todo.dueDate,
            isDone: todo.isDone,
            doneAt: todo.doneAt,
            createdAt: todo.createdAt,
            updatedAt: todo.updatedAt,
            subTodos: todo.subTodos || null,
        };

        if (!returnData.subTodos) {
            delete returnData.subTodos;
        }

        return returnData;
    }

    static async getAll(data) {
        const {
            userId,
            value,
        } = data;

        const {
            userId: userIdParam,
            date,
            sortBy = 'date',
            page = 1,
            count = 10,
            includeSubTodos,
        } = value;
        
        if (userId !== userIdParam) {
            throw new APIError(403, 'Unauthorized! Cannot access other user\'s todo.');
        }

        // Filter
        const filters = { userId: ObjectId.createFromHexString(userIdParam) };

        if (date) {
            filters.onDate = date;
        }

        // Sorting
        const sortDate = sortBy === '-date' ? -1 : 1;

        // Pagination
        const skip = parseInt(count) * (parseInt(page) - 1);
        const limit = parseInt(count);

        // Projection
        const isIncludeSubTodos = includeSubTodos ? (includeSubTodos === 'true') : true;
        const projection = isIncludeSubTodos ? undefined : { subTodos: isIncludeSubTodos };

        const db = await connectToDB();
        const todos = await db.collection('todo').aggregate([
            {
                $match: filters,
            },
            {
                $sort: {
                    onDate: sortDate,
                },
            },
            {
                $facet: {
                    metadata: [{ $count: 'totalCount' }],
                    data:
                    [
                        ...(projection ? [{ $project: projection }] : []),
                        { $skip: skip },
                        { $limit: limit},
                    ],
                }
            },
        ]).toArray();

        const todoData = todos[0].data.map((todo) => {
            const data = {
                id: todo._id.toString(),
                title: todo.title,
                note: todo.note,
                onDate: todo.onDate,
                dueDate: todo.dueDate,
                isDone: todo.isDone,
                doneAt: todo.doneAt,
                createdAt: todo.createdAt,
                updatedAt: todo.updatedAt,
                subTodos: todo.subTodos || null,
            };

            if (!data.subTodos) {
                delete data.subTodos;
            }

            return data;
        });

        if (!todos[0].data.length) {
            todos[0].metadata.push({ totalCount: 0 });
        }

        const total = todos[0].metadata[0].totalCount;
        const totalPages = Math.ceil(todos[0].metadata[0].totalCount / limit);
        
        const next = ((parseInt(page) < totalPages) && (parseInt(page) >= 1)) ?
            `/api/v1/todos?userId=${userIdParam}&page=${parseInt(page) + 1}&count=${limit}&includeSubTodos=${isIncludeSubTodos}&sortBy=${sortBy}` :
            null;
            
        const prev = ((parseInt(page) <= totalPages) && (parseInt(page) > 1)) ?
            `/api/v1/todos?userId=${userIdParam}&page=${parseInt(page) - 1}&count=${limit}&includeSubTodos=${isIncludeSubTodos}&sortBy=${sortBy}` :
            null;
        
        let nextUrl = next, prevUrl = prev;
        if (date) {
            nextUrl = next ? next.concat(`&date=${date.toString().split('T')[0]}`) : null;
            prevUrl = prev ? prev.concat(`&date=${date.toString().split('T')[0]}`) : null;
        }

        return {
            todo: todoData,
            meta: {
                pagination: {
                    currentPage: parseInt(page),
                    links: {
                        next: nextUrl,
                        prev: prevUrl,
                    },
                    perPage: limit,
                    total,
                    totalPages,
                },
            },
        };
    }
}

module.exports = Todo;
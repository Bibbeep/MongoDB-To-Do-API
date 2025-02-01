const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URL;

class MongoDB {
    static #instance = null;

    constructor() {
        if (MongoDB.#instance) {
            throw new Error('Instantiating directly is not allowed!');
        }

        this.client = null;
    }

    async connect() {
        if (!this.client) {
            this.client = new MongoClient(uri);

            await this.client.connect();
            // console.log('MongoDB connected successfully.');
            this.db = this.client.db('todo_api');
        }

        return this.db;
    }

    getDB() {
        if (!this.db) {
            throw new Error('Connection to the database is not initialized yet.');
        }

        return this.db;
    }

    static getInstance() {
        if (!MongoDB.#instance) {
            MongoDB.#instance = new MongoDB();
        }

        return MongoDB.#instance;
    }
}

const mongoDB = MongoDB.getInstance();

module.exports = {
    connectToDB: async () => {
        await mongoDB.connect();
        return mongoDB.getDB();
    },
};
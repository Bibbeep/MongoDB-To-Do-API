require('dotenv').config();
const { connectToDB } = require('../configs/mongodb');

const resetDatabase = async () => {
    try {
        const db = await connectToDB();
        await db.collection('todo').deleteMany();
        await db.collection('user').deleteMany();
    } catch (err) {
        throw err;
    }
};

resetDatabase()
    .then(() => {
        console.log('Successfully reset the database.');
        process.exit(0);
    })
    .catch((err) => {
        console.log(`Failed to reset the database: ${err.message}`);
        process.exit(1);
    });
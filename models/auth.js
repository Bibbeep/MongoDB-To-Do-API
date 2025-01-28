const bcrypt = require('bcrypt');
const APIError = require('../utils/error');
const { connectToDB } = require('../configs/mongodb');

class Auth {
    static async createUser(data) {
        const {
            email,
            password,
            fullName,
        } = data;
        
        const db = await connectToDB();
        const user = await db.collection('user').findOne({ email });

        if (user) {
            throw new APIError(409, 'Email is already registered! Please use other email to register.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const returnData = await db.collection('user').insertOne({
            email,
            password: hashedPassword,
            fullName,
        });

        return returnData;
    }
}

module.exports = Auth;
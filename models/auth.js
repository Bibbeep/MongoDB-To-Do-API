const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const APIError = require('../utils/error');
const { connectToDB } = require('../configs/mongodb');
const JWT_SECRET = process.env.JWT_SECRET;

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

    static async login(data) {
        const {
            email,
            password,
        } = data;

        const db = await connectToDB();
        const user = await db.collection('user').findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new APIError(401, 'Email or password is incorrect!');
        }

        const accessToken = jwt.sign(
            {
                id: user._id.toString(),
                fullName: user.fullName,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            user: {
                id: user._id.toString(),
                fullName: user.fullName,
            },
            accessToken,
        };
    }
}

module.exports = Auth;
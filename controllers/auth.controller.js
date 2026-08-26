import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";

export const signUp = async (req, res, next) => {
 const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { name, email, password } = req.body;
        const existingUser = await  User.findOne({email})

        //check if a user is already exists
        if(existingUser){
            const error = new Error("User already exists")
            error.statusCode = 401
            throw error
        }

        //hash password
        const salt = await  bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create([
            {
                name, email, password: hashPassword
            }
        ], { session })

        const token = jwt.sign(
            {userId: newUser[0]._id},
            JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
        )

        res.status(201).json(
            {
                success: true,
                message: "User signed successfully",
                data: {
                    token,
                    user: newUser[0]
                }
            }
        )
    }catch (error){
        await session.abortTransaction()
        await session.endSession()
        next(error)
    }
}

export const signIn = async (req, res, next) => {

}

export const signOut = async (req, res, next) => {

}
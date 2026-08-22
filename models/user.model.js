import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        minlength: 3,
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\$+@\$+\.\$+/],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: 5,
    }
},{
    timestamps: true,
})

const User = mongoose.model('User', UserSchema);
export default User;
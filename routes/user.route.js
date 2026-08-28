import {Router} from 'express';
import {getUser, getUsers} from "../controllers/user.controller.js";
import {authorize} from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getUsers)
userRouter.get('/:id', authorize, getUser)
userRouter.post('/', (req, res) => {
    res.send({
        title: "create user"
    })
})
userRouter.put('/:id', (req, res) => {
    res.send({
        title: "update user by id"
    })
})
userRouter.delete('/:id', (req, res) => {
    res.send({
        title: "deleted user by id"
    })
})

export default userRouter;
import { Router } from 'express';
import {createSubscription, getUserSubscription} from "../controllers/subscription.controller.js";
import {authorize} from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
    res.send({
        title: "get all subscriptions",
    })
})

subscriptionRouter.get('/:id', (req, res) => {
    res.send({
        title: "get subscription by id",
    })
})

subscriptionRouter.post('/',authorize, createSubscription)

subscriptionRouter.put('/:id', (req, res) => {
    res.send({
        title: "update subscription",
    })
})

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({
        title: "get all subscriptions",
    })
})

subscriptionRouter.get('/user/:id', authorize, getUserSubscription)

subscriptionRouter.put('/cancel/:id', (req, res) => {
    res.send({
        title: "cancel subscription",
    })
})

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({
        title: "get upcoming renewals",
    })
})
export default subscriptionRouter;
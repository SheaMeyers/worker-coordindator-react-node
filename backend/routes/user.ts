import express, { Router, Request, Response } from 'express'

const userRouter: Router = express.Router();

userRouter.post('/api/sign-up', (req: Request, res: Response) => {
    res.status(201).send()
});

export default userRouter;

import express, { Router, Request, Response } from 'express'
import bcrypt from "bcrypt"
import { PrismaClient, User, Company } from '@prisma/client';

const prisma = new PrismaClient()
const userRouter: Router = express.Router();

userRouter.post('/api/sign-up', async (req: Request, res: Response) => {

    const { username, password, companyName } = req.body

    const encryptedPassword = await bcrypt.hash(password, 10)

    const company: Company = await prisma.company.create({
        data: { name: companyName }
    })

    const user: User = await prisma.user.create({
        data: {
            name: username,
            password: encryptedPassword,
            isAdmin: true,
            companyId: company.id
        }
    })

    res.status(201).send()
});

export default userRouter;

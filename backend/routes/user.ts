import express, { Router, Request, Response } from 'express'
import bcrypt from "bcrypt"
import { User, Company } from '@prisma/client';
import prismaClient from '../prisma/client';

const userRouter: Router = express.Router();

userRouter.post('/sign-up', async (req: Request, res: Response) => {

    const { username, password, companyName } = req.body

    if (!username || !password || !companyName) {
        return res.status(400).send('Invalid request body')
    }

    if (await prismaClient.user.findUnique({ where: { name: username } })) {
        return res.status(400).send(`User already exists with username ${username}`)
    }

    if (await prismaClient.company.findUnique({ where: { name: companyName } })) {
        return res.status(400).send(`Company already exists with username ${companyName}`)
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    const company: Company = await prismaClient.company.create({
        data: { name: companyName }
    })

    const user: User = await prismaClient.user.create({
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

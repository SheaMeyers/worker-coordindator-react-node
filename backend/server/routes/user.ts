import express, { Router, Request, Response } from 'express'
import bcrypt from "bcrypt"
import { User, Company } from '@prisma/client'
import prismaClient from '../client';
import { getTokens, updateUserTokens, refreshCookieOptions, removeUserTokens, getTokenFromAuthorizationHeader, getUserByToken } from '../tokens';

const userRouter: Router = express.Router();

userRouter.post('/sign-up', async (req: Request, res: Response) => {

    const { username, password, companyName } = req.body

    if (!username || !password || !companyName) {
        return res.status(400).send('Invalid request body')
    }

    if (await prismaClient.company.findUnique({ where: { name: companyName } })) {
        return res.status(400).send(`Company already exists with name ${companyName}`)
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    const company: Company = await prismaClient.company.create({
        data: { name: companyName }
    })

    const user: User = await prismaClient.user.create({
        data: {
            username,
            password: encryptedPassword,
            isAdmin: true,
            companyId: company.id
        }
    })

    const [token, refreshToken] = getTokens()

    updateUserTokens(user, token, refreshToken)

    res.cookie("refreshToken", refreshToken, refreshCookieOptions)

    res.status(201).send({token, isAdmin: user.isAdmin})
})

userRouter.post('/sign-in', async (req: Request, res: Response) => {
    const { username, password, companyName } = req.body

    if (!username || !password || !companyName) {
        return res.status(400).send('Invalid request body')
    }

    const user: User | null = await prismaClient.user.findFirst({
        where: {
            AND: [
                {
                    company: {
                        name: companyName
                    }
                },
                {
                    username
                }
            ]
        }
    })

    if (user == null)
        return res.status(401).send('Invalid company name, username or password')

    const isValidPassword = await bcrypt.compare(password, user.password)
	if (!isValidPassword) return res.status(401).send('Invalid company name, username or password')

    const [token, refreshToken] = getTokens()

    updateUserTokens(user, token, refreshToken)

    res.cookie("refreshToken", refreshToken, refreshCookieOptions)

    res.status(200).send({token, isAdmin: user.isAdmin})
})

userRouter.post('/logout', async (req: Request, res: Response) => {
    const token  = getTokenFromAuthorizationHeader(req.headers.authorization)

    try {
        await removeUserTokens(token)
    } catch {}

    res.clearCookie("refreshToken")

    res.status(200).send()
})

userRouter.post('/add-user', async (req: Request, res: Response) => {
    const token  = getTokenFromAuthorizationHeader(req.headers.authorization)

    const user = await getUserByToken(token)

    if (!user) return res.status(403).send()

    const { username, password, isAdmin } = req.body

    if (!username || !password ) {
        return res.status(400).send('Invalid request body')
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    await prismaClient.user.create({
        data: {
            username,
            password: encryptedPassword,
            isAdmin,
            companyId: user.companyId
        }
    })

    res.status(201).send()
})

userRouter.post('/add-message', async (req: Request, res: Response) => {
    const token  = getTokenFromAuthorizationHeader(req.headers.authorization)

    const user = await getUserByToken(token)

    if (!user) return res.status(403).send()

    const { content } = req.body

    if (!content) return res.status(400).send('Invalid request body')

    await prismaClient.message.create({
        data: {
            userId: user.id,
            content
        }
    })

    res.status(201).send()
})

userRouter.get('/get-users-and-messages', async (req: Request, res: Response) => {
    const token  = getTokenFromAuthorizationHeader(req.headers.authorization)

    const user = await getUserByToken(token)

    if (!user || !user.isAdmin) return res.status(403).send()

    const usersWithMessages: { username: string; Message: { content: string; }[]; }[] = await prismaClient.user.findMany({
        where: {
            companyId: user.companyId,
            isAdmin: false
        },
        select: {
            username: true,
            Message: {
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    content: true
                },
                take: 3
            },

        }
    })

    res.status(200).send(usersWithMessages)
})

export default userRouter

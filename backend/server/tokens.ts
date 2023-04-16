import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
import { User } from '@prisma/client'
import prismaClient from "./client"

export const refreshCookieOptions = {
	maxAge: 1000 * 60 * 60 * 24 * 30, //expires in a month
	// httpOnly: true, // cookie is only accessible by the server
	// secure: process.env.NODE_ENV === 'prod', // only transferred over https
	// sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
}

export const getTokens = (): [string, string] => {
	if (process.env.ACCESS_SECRET === undefined || process.env.REFRESH_SECRET === undefined) {
		throw new Error("Secrets are undefined")
	}

	const token = jwt.sign(
		{ randomId: uuidv4() }, 
		process.env.ACCESS_SECRET, 
		{ expiresIn: "5m" }
	)

	const refreshToken = jwt.sign(
		{ randomId: uuidv4() },
		process.env.REFRESH_SECRET,
		{ expiresIn: "30 days" }
	)

	return [token, refreshToken]
}

export const updateUserTokens = async (
	user: User,
	token: string,
	refreshToken: string
) =>  await prismaClient.user.update({
		where: {
			id: user.id
		},
		data: {
			token,
			refreshToken,
			oldTokens: [user.token || '', ...user.oldTokens]
				.filter((e) => e)
				.slice(0, 20),
			oldRefreshTokens: [user.refreshToken || '', ...user.oldRefreshTokens]
				.filter((e) => e)
				.slice(0, 20),
		},
	})

export const removeUserTokens = async (token: string = '', refreshToken: string = '') => {
	if (token === '' && refreshToken === '') {
		throw new Error('Either token or refresh token must be provided')
	}
	let user: User | null;
	if (token) {	
		user = await prismaClient.user.findFirst({ where : { token }})
	} else {
		user = await prismaClient.user.findFirst({ where : { refreshToken }})
	}

	if (user) {
		await prismaClient.user.update({
			where: {
				id: user.id
			},
			data: {
				token: null,
				refreshToken: null,
				oldTokens: [],
				oldRefreshTokens: [],
			},
		})
	}
}

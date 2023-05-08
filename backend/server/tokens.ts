import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
import { User } from '@prisma/client'
import client from "./client"

export const refreshCookieOptions = {
	maxAge: 1000 * 60 * 60 * 24 * 30, //expires in a month
	// httpOnly: true, // cookie is only accessible by the server
	// secure: process.env.NODE_ENV === 'prod', // only transferred over https
	// sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
}

export const getTokenFromAuthorizationHeader = (authorization: string | undefined): string => {
	if (!authorization) return ''
	
	const [_, token] = authorization.split(' ')

	return token
}

export const getTokens = (): [string, string] => {
	if (process.env.ACCESS_SECRET === undefined || process.env.REFRESH_SECRET === undefined) {
		throw new Error("Secrets are undefined")
	}

	const token = jwt.sign(
		{ randomId: uuidv4() }, 
		process.env.ACCESS_SECRET, 
		{ expiresIn: "30d" }
	)

	const refreshToken = jwt.sign(
		{ randomId: uuidv4() },
		process.env.REFRESH_SECRET,
		{ expiresIn: "30d" }
	)

	return [token, refreshToken]
}

export const setNewUserTokens = async (
	user: User,
	token: string,
	refreshToken: string
) =>  await client.user.update({
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

export const clearUserTokens = async (
	user: User
) =>  await client.user.update({
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

export const getUserByToken = async (token: string, refreshToken: string): Promise<User | null> => {

	let user: User | null = await client.user.findFirst({
		where: {
			OR: [
				{ token },
				{ refreshToken }
			]
		}
	})

	if (user && (user.token !== token || user.refreshToken !== refreshToken)) {
		await clearUserTokens(user)
		return null
	}

	if(!user) {
		user = await client.user.findFirst({
			where: {
				OR: [
					{ oldTokens: { has : token } },
					{ oldRefreshTokens: { has: refreshToken} }
				]
			}
		})

		if (user) {
			await clearUserTokens(user)
			return null
		}
	}

	if(user) {
		try {
			// Check that the tokens are still valid
			process.env.ACCESS_SECRET && jwt.verify(token, process.env.ACCESS_SECRET)
			process.env.REFRESH_SECRET && jwt.verify(refreshToken, process.env.REFRESH_SECRET)
		} catch (e) {
			// If here that means the tokens are no longer valid
			await clearUserTokens(user)
			return null
		}
	}

	return user
}

export const removeUserTokens = async (token: string, refreshToken: string): Promise<void> => {
	let user: User | null = await getUserByToken(token, refreshToken);

	if (user) {
		await clearUserTokens(user)
	}
}

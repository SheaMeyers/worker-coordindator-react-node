import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"

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

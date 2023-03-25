import { AuthedResponse } from "./interfaces"

export const signIn = async (companyName: string, username: string, password: string): Promise<AuthedResponse> => {
    const response = await fetch('/api/sign-in', {
        method: 'POST',
        headers: new Headers({ "Content-Type": "application/json"}),
        body: JSON.stringify({ companyName, username, password })
    })

    const result = await response.json()

    console.log(response)
    
    return {
        isAdmin: result.isAdmin,
        token: result.token
    } as AuthedResponse
}

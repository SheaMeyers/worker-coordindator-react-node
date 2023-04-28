import { AuthedResponse } from "./interfaces"


export const getAuthed = async (url: string, companyName: string, username: string, password: string): Promise<AuthedResponse> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({ "Content-Type": "application/json"}),
        body: JSON.stringify({ companyName, username, password })
    })

    if (!response.ok) {
        if (response.status === 401)
            return { success: false, error: "Invalid company name, username, or password"} as AuthedResponse
        
        return { success: false, error: "Unable to login.  Please try again later."} as AuthedResponse
    }

    const { isAdmin, token} = await response.json()

    return {
        success: true,
        isAdmin,
        token
    } as AuthedResponse
}


export const signIn = async (companyName: string, username: string, password: string): Promise<AuthedResponse> =>
    getAuthed('/api/sign-in', companyName, username, password)


export const signUp = async (companyName: string, username: string, password: string): Promise<AuthedResponse> =>
    getAuthed('/api/sign-up', companyName, username, password)

export const logOut = async (): Promise<void> => {
    const token = localStorage.getItem('token')
    await fetch('/api/logout', {
        method: 'POST',
        headers: new Headers({ 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }),
    })
}

import { AuthedResponse, UsersWithMessages } from "./interfaces"


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

    const { isAdmin, token } = await response.json()

    localStorage.setItem('isAdmin', isAdmin.toString())
    localStorage.setItem('token', token)

    return {
        success: true
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
    localStorage.removeItem("token");
    window.location.reload();
}

export const addUser = async (username: string, password: string, isAdmin: boolean): Promise<void> => {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/add-user', {
        method: 'POST',
        headers: new Headers({ 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }),
        body: JSON.stringify({ username, password, isAdmin })
    })
    if (!response.ok) {
        localStorage.removeItem("token")
        window.location.replace('/')
    } else {
        const { token } = await response.json()
        localStorage.setItem('token', token)
    }
}

export const addMessage = async (content: string): Promise<void> => {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/add-message', {
        method: 'POST',
        headers: new Headers({ 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }),
        body: JSON.stringify({ content })
    })
    if (!response.ok) {
        localStorage.removeItem("token")
        window.location.replace('/')
    } else {
        const { token } = await response.json()
        localStorage.setItem('token', token)
    }
}



export const getUsersWithMessages = async (): Promise<UsersWithMessages> => {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/get-users-and-messages', {
        method: 'GET',
        headers: new Headers({ 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        })
    })

    if (!response.ok) {
        localStorage.removeItem("token")
        window.location.replace('/')
        return []
    } else {
        const { token, usersWithMessages } = await response.json()
        localStorage.setItem('token', token)
        return usersWithMessages
    }
}

export type AuthedResponse = {
    success: true
    token: string
    isAdmin: boolean
} | {
    success: false
    error: string
}

export type UsersWithMessages = { 
    username: string; 
    Message: { 
        content: string; 
    }[]; 
}[]

export type AuthedResponse = {
    success: true
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

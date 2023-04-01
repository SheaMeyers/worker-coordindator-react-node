export type AuthedResponse = {
    success: true
    token: string
    isAdmin: boolean
} | {
    success: false
    error: string
}
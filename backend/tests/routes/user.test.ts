const request = require('supertest');
import app from "../../app";
import prismaClient from "../../prisma/client";

afterEach(async () => {
	await prismaClient.user.deleteMany({})
    await prismaClient.company.deleteMany({})
})

describe('Sign Up Tests', () => {
    test('Test signup successful', async () => {
        await request(app).post('/api/sign-up').send({
            "username": "Shea",
            "password": "Password1",
            "companyName": "MyComp"
        }).expect(201)
    
        const company = prismaClient.company.findUnique({
            where: {
                name: "MyComp"
            }
        })
        expect(company).not.toBeNull()
        
        const user = prismaClient.user.findFirst({
            where: {
                username: "Shea"
            }
        })
        expect(user).not.toBeNull()
        // Ensure password not stored in plain text
        expect(user).not.toBe("Password1")
    })
    
    test('Test signup unsuccessful when company already exists', async () => {
        await prismaClient.company.create({
            data: { name: "MyComp" }
        })
    
        const response = await request(app).post('/api/sign-up').send({
            "username": "Shea",
            "password": "Password1",
            "companyName": "MyComp"
        }).expect(400)
    
        expect(response.text).toBe("Company already exists with name MyComp")
    })
    
    test('Test signup unsuccessful with invalid request body', async () => {
        const response = await request(app).post('/api/sign-up').send({
            "username": "Shea",
            "password": "Password1"
        }).expect(400)
    
        expect(response.text).toBe("Invalid request body")
    })    
})

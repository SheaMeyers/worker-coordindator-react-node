import request from "supertest";
import { describe, expect, test, afterEach, beforeEach } from '@jest/globals';
import bcrypt from "bcrypt"
import app from "../../server/app";
import prismaClient from "../../server/client";
import { User } from "@prisma/client";

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

describe('Sign In Tests', () => {
    beforeEach(async () => {
        const company = await prismaClient.company.create({
            data: { name: "MyComp" }
        })
        const password = await bcrypt.hash("password", 10)
        await prismaClient.user.create({
            data: {
                username: "Shea",
                password,
                companyId: company.id,
                isAdmin: true
            }
        })
    })

    test('Test signin successful', async () => {
        const response = await request(app).post('/api/sign-in').send({
            "companyName": "MyComp",
            "username": "Shea",
            "password": "password"
        }).expect(200)

        expect(response.body.isAdmin).toBeTruthy()

        const user: User | null = await prismaClient.user.findFirst({
            where: {
                AND: [
                    {
                        company: {
                            name: "MyComp"
                        }
                    },
                    {
                        username: "Shea"
                    }
                ]
            }
        })

        expect(user).not.toBeNull()
        expect(response.body.token).toBe(user?.token)
    })

    test('Test signin unsuccessful with bad password', async () => {
        await request(app).post('/api/sign-in').send({
            "companyName": "MyComp",
            "username": "Shea",
            "password": "badpassword"
        }).expect(400)
    })

    test('Test signin unsuccessful with bad company name', async () => {
        await request(app).post('/api/sign-in').send({
            "companyName": "BadMyComp",
            "username": "Shea",
            "password": "password"
        }).expect(400)
    })

    test('Test signin unsuccessful with bad username', async () => {
        await request(app).post('/api/sign-in').send({
            "companyName": "MyComp",
            "username": "BadShea",
            "password": "password"
        }).expect(400)
    })
})

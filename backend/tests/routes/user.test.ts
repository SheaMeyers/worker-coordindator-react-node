const request = require('supertest');
import { Company } from "@prisma/client";
import app from "../../app";
import prismaClient from "../../prisma/client";

afterEach(async () => {
	await prismaClient.user.deleteMany({})
    await prismaClient.company.deleteMany({})
})

test('Test signup successful', async () => {
    await request(app).post('/api/sign-up').send({
        "username": "Shea",
        "password": "Password1",
        "companyName": "MyComp"
    }).expect(201)

    const user = prismaClient.user.findUnique({
        where: {
            name: "Shea"
        }
    })
    expect(user).not.toBeNull()
    // Ensure password not stored in plain text
    expect(user).not.toBe("Password1")
})

test('Test signup unsuccessful', async () => {
    const company: Company = await prismaClient.company.create({
        data: { name: "MyComp" }
    })

    await prismaClient.user.create({
        data: {
            name: "Shea",
            password: "FakeEncryptedPassword",
            companyId: company.id,
            isAdmin: true
        }
    })

    const response = await request(app).post('/api/sign-up').send({
        "username": "Shea",
        "password": "Password1",
        "companyName": "MyComp"
    }).expect(400)

    expect(response.text).toBe("User in company MyComp already exists with username Shea")
})

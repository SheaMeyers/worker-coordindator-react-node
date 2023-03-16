const request = require('supertest');
import app from "../../index";
import prismaClient from "../../prisma/client";

afterEach(async () => {
	await prismaClient.user.deleteMany({})
    await prismaClient.company.deleteMany({})
})

test('Test signup successful', async () => {
    const response = await request(app).post('/api/sign-up').send({
        "username": "Shea",
        "password": "Password1",
        "companyName": "MyComp"
    }).expect(201)
})
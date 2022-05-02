import app from '../app.js'
import supertest from "supertest"
import mongoose from 'mongoose'
import dotenv from "dotenv"
import jest from "jest"

dotenv.config()

const client = supertest(app)


describe("Testing the environment", () => {

    beforeAll(async () => {
        console.log("beforeAll")
        await mongoose.connect(process.env.MONGO_URL_TEST)
    })

    it("Should test that the test endpoint is returning a success message", async () => {
        const response = await client.get("/test")

        console.table(response.body)
        expect(response.body.message).toBe("Hello, World!")
    })


    const validUser = {
        "name": "Test 1",
        "email": "guest@gmail.com",
        "password": "test."
    }

    it("should test than when registering a new user we are receiving a 201 status, a user id and token", async () => {
        const response = await client.post("/user/register").send(validUser)

        expect(response.status).toBe(201)

        console.table(response.body)
        expect(response.body._id).toBeDefined()
        expect(response.body.accessToken).toBeDefined()

    })

    const invalidUser = {
        name: "100"
    }

    it("should test that when registering a new user with invalid data we receive 400", async () => {

        const response = await client.post("/user/register").send(invalidUser)

        expect(response.status).toBe(400)
    })

    afterAll(async () => {
        console.log("afterAll")
        // await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })

})
import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        version: "v0.0.1",
        title: "API Documentation Event Management System",
        description:
            "This is the API documentation for the Event Management System. It provides details about the available endpoints, request parameters, and response formats.",
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Development server",
        },
        {
            url: "https://backend-acara-wine.vercel.app/api",
            description: "Production server",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            registerRequest: {
                fullName: "John Doe",
                email: "john@example.com",
                userName: "johndoe",
                password: "password123",
                confirmPassword: "password123",
            },
            activationRequest: {
                activationCode: "abxyz1234",
            },
            loginRequest: {
                identifier: "JohnDoe",
                password: "password123",
            },
        },
    },
}

const outputFile = "./swagger-output.json";
const endpointsFile = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFile, doc);

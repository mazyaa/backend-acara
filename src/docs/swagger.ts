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
                type: "object",
                properties: {
                    fullName: {
                        type: "string",
                        description: "Full name of the user",
                        example: "John Doe",
                    },
                    email: {
                        type: "string",
                        format: "email",
                        description: "Email address of the user",
                        example: "johndoe@gmail.com",
                    },
                    userName: {
                        type: "string",
                        description: "Username of the user",
                        example: "johndoe123",
                    },
                    password: {
                        type: "string",
                        description: "Password of the user",
                        example: "password123",
                    },
                    confirmPassword: {
                        type: "string",
                        description: "Confirmation of the user's password",
                        example: "password123",
                    },
                },
                required: [
                    "fullName",
                    "email",
                    "userName",
                    "password",
                    "confirmPassword",
                ],
            },
            activationRequest: {
                type: "object",
                properties: {
                    activationCode: {
                        type: "string",
                        description: "Activation code sent to the user's email",
                        example: "1234567890abcdef",
                    },
                },
                required: ["activationCode"],
            },
            loginRequest: {
                type: "object",
                properties: {
                    identifier: {
                        type: "string",
                        description: "Email or username of the user",
                        example: "mazyaa123",
                    },
                    password: {
                        type: "string",
                        description: "Password of the user",
                        example: "password123",
                    },
                },
                required: ["identifier", "password"],
            },
        },
    },
}

const outputFile = "./swagger-output.json";
const endpointsFile = ["../routes/api.ts"];

swaggerAutogen({ openApi: "3.0.0" })(outputFile, endpointsFile, doc);

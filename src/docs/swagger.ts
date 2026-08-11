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
      url: "http://localhost:5000/api",
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
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "",
        banner: "fileUrl",
        category: "category ObjectId",
        description: "",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
          region: "region id",
          coordinates: [0, 0],
          address: "malingping street, city, country",
        },
        isOnline: false,
        isFeatured: false,
        isPublish: false,
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
      CreateBannerRequest: {
        title: "banner carousel 3",
        image: "banner3.png",
        isShow: true,
      },
      CreateTicketRequest: {
        price: 20000,
        name: "Ticket REGULER",
        events: "6a52493779ae721bc35865eb",
        description: "Ticket REGULER - course NEXT JS",
        quantity: 200,
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFile = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFile, doc);

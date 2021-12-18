module.exports = {
  swagger: "2.0",
  info: {
    version: "1.0.0",
    title: "Users API",
    description: "Users microservice API available endpoints",
    contact: {
      name: "Pablo Massuh",
      email: "pablomassuh@homtail.com ",
    },
  },
  host: "ubademy-users-api.herokuapp.com",
  basePath: "/",
  tags: [
    {
      name: "user",
      description: "The following endpoints provides support for end user application frontend",
    },
  ],
  paths: {
    "/login": {
      post: {
        tags: ["user"],
        summary: "User login",
        description: "Allows user to enter app",
        operationId: "postLogin",
        parameters: [{
          in: "body",
          name: "body",
          schema: {
            $ref: "#/components/schemas/RequestLogin",
          },
          required: true,
        }],
        responses: {
          200: {
            description: "OK login",
            schema: {
              $ref: "#/components/schemas/ResponseLogin",
            },
          },
          404: {
            description: "User not found",
            schema: {
              $ref: "#/components/schemas/ErrorWrongPassword",
            },
          },
          401: {
            description: "Not authorized for invalid password",
            schema: {
              $ref: "#/components/schemas/ErrorWrongPassword",
            },
          },
          500: {
            description: "Error: Internal Server Error",
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      //Request
      RequestLogin: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Your email",
            example: "john@example.com",
            required: true,
          },
          password: {
            type: "string",
            description: "Your password",
            example: "Passw0rd1234",
            minlength: 8,
            required: true,
          },
        },
      },
      ResponseLogin: {
        type: "object",
        properties: {
          auth: {
            type: "boolean",
          },
          token: {
            type: "string",
            example: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYWJsb21hc3N1aEBnbWFpbC5jb20iLCJpYXQiOjE2Mzk2ODA5NTYsImV4cCI6MTYzOTY4ODE1Nn0.zXrdT2CZ6qqCDGpusNogwwWrwvZBWjlnUJ6tCl_vAZU",
          },
          user: {
            type: "object",
            properties: {
              id: {
                type: "string",
                example: "6161da733dbb2500114bc6cf"
              },
              firstName: {
                type: "string",
                example: "Pablo"
              },
              lastName: {
                type: "string",
                example: "Massuh"
              },
              email: {
                type: "string",
                example: "pablomassuh@hotmail.com"
              },
              placeId: {
                type: "string",
                description: "It's the id of the user's city",
                example: "ChIJWcbC2mUso5URjTfoNV12W7k"
              },
              interests: {
                type: "array",
                description: "It's an array of string of the user's interests",
                example: "['COOKING', 'YOGA']"
              },
              googleData: {
                type: "object",
                properties: {
                  displayName: {
                    type: "string",
                    example: "Pablo Massuh",
                  },
                  userId: {
                    type: "string",
                    example: "pZ5ImYPG57TsR4ZqqpBuiuYJFy06"
                  },
                  picture: {
                    type: "string",
                    description: "URL with the user picture",
                    example: "https://lh3.googleusercontent.com/a-/AOh14Gip9foTlZxrU9AEz4VH14M8VjL-fYbu_EX3J9lgvjI=s96-c"
                  }
                }
              }
            },
          }
        },
      },
      //Response: 400,500..
      ErrorAuthentication: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "the cause of the error",
            example: "There is no authorization headers",
          },
        },
      },
      ErrorWrongPassword: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "the cause of the error",
            example: "Sorry, email or password incorrect.",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "the cause of the error",
            example: "There was an error with login.",
          },
        },
      },
    },
    securitySchemes: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
  },
};

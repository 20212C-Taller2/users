module.exports = {
  openapi: "3.0.2",
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
    {
      name: "admin",
      description: "The following endpoints provides support for backoffice application",
    },
  ],
  paths: {
    "/login": {
      post: {
        tags: ["user"],
        summary: "User login",
        description: "Allows user to enter app",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestLogin",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "OK login",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseLogin",
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorWrongPassword",
                },
              },
            },
          },
          401: {
            description: "Not authorized for invalid password",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorWrongPassword",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/login/admin": {
      post: {
        tags: ["admin"],
        summary: "Admin login",
        description: "Allows admin to enter backoffice app",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestLogin",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "OK login",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseLogin",
                },
              },
            },
          },
          404: {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorWrongPassword",
                },
              },
            },
          },
          401: {
            description: "Not authorized for invalid password",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorWrongPassword",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/login/google": {
      post: {
        tags: ["user"],
        summary: "Admin login",
        description: "Allows admin to enter backoffice app",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestGoogleLogin",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "OK login",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseLogin",
                },
              },
            },
          },
          401: {
            description: "Not authorized for invalid password",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorWrongPassword",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/register": {
      post: {
        tags: ["user"],
        summary: "User registration",
        description: "Allows user to be registered",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestRegister",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "OK register",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseLogin",
                },
              },
            },
          },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BadRequest",
                },
              },
            },
          },
          409: {
            description: "User already registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Conflict",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/register/admin": {
      post: {
        tags: ["admin"],
        summary: "Admin registration",
        description: "Allows admin to be registered",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestRegister",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "OK register",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseLogin",
                },
              },
            },
          },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/BadRequest",
                },
              },
            },
          },
          409: {
            description: "User already registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Conflict",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users": {
      get: {
        tags: ["admin", "user"],
        summary: "User list",
        description: "get a list of users",
        parameters: [
          {
            name: "offset",
            in: "query",
            schema: {
              type: "integer",
              default: 0,
            },
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              default: 10,
            },
          },
          {
            name: "appUsers",
            in: "query",
            description: "When it is true returns only app users and not all users",
            schema: {
              type: "bool",
            },
          },
        ],
        responses: {
          200: {
            description: "Return users list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/GetUsers",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["user"],
        summary: "Get users by ids",
        description: "Given an array of user ids the endpoint returns all those users",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestGetUsersByIds",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Return users list",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseGetUsersByIds",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users/blocked": {
      get: {
        tags: ["admin"],
        summary: "User blocked",
        description: "Check if a user is blocked. Email user is obtained from request headers",
        parameters: [],
        responses: {
          200: {
            description: "Return a boolean that indicates if the user is blocked",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    blocked: {
                      type: "bool",
                      example: "false",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "The user does not exist",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorNotFound",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users/:id": {
      patch: {
        tags: ["user"],
        summary: "Update a user",
        description: "Receives the specific user's attributes to be updated",
        parameters: [
          {
            in: "path",
            description: "User id",
            type: "string",
            required: true,
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestPatchUser",
              },
            },
          },
          required: true,
        },
        responses: {
          204: {
            description: "Nothing to return",
          },
          400: {
            description: "Invalid user id format",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorInvalidIdFormat",
                },
              },
            },
          },
          404: {
            description: "The user does not exist",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorNotFound",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["user"],
        summary: "Get user",
        description: "Get user given a user id",
        parameters: [
          {
            in: "path",
            description: "User id",
            type: "string",
            required: true,
          },
        ],
        responses: {
          200: {
            description: "Requested user",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
          400: {
            description: "Invalid user id format",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorInvalidIdFormat",
                },
              },
            },
          },
          404: {
            description: "The user does not exist",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorNotFound",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users/:id/block": {
      post: {
        tags: ["admin"],
        summary: "Block a user",
        description: "Receives user id to be blocked",
        parameters: [
          {
            in: "path",
            description: "User id",
            type: "string",
            required: true,
          },
        ],
        responses: {
          204: {
            description: "Nothing to return",
          },
          400: {
            description: "Invalid user id format or user is already blocked",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorInvalidIdFormat",
                },
              },
            },
          },
          404: {
            description: "The user does not exist",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorNotFound",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["admin"],
        summary: "Unblock a user",
        description: "Receives user id to be unblocked",
        parameters: [
          {
            in: "path",
            description: "User id",
            type: "string",
            required: true,
          },
        ],
        responses: {
          204: {
            description: "Nothing to return",
          },
          400: {
            description: "Invalid user id format or user is already unblocked",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorInvalidIdFormat",
                },
              },
            },
          },
          404: {
            description: "The user does not exist",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorNotFound",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/users/notify": {
      post: {
        tags: ["user"],
        summary: "Send push notification",
        description: "Send a push notification with message to a user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestNotify",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Return a boolean that indicates if the message was sent",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messageSent: {
                      type: "bool",
                      example: "true",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Invalid user id format or the message is empty",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorInvalidIdFormat",
                },
              },
            },
          },
          404: {
            description: "The user does not exist",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorNotFound",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
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
      RequestGetUsersByIds: {
        type: "array",
        items: {
          type: "string",
        },
        example: ["618b0a115174460011e7898c", "61649b014eae860011ceb0db"],
      },
      RequestGoogleLogin: {
        type: "object",
        properties: {
          googleToken: {
            type: "string",
            description: "The google token",
            example: "asjdhflasgug45jth5n6lj6h6l65nk4l433",
            required: true,
          },
        },
      },
      RequestPatchUser: {
        type: "object",
        description: "At least one attribute must be present in the body",
        properties: {
          password: {
            type: "string",
            description: "Your password",
            example: "Passw0rd1234",
            minlength: 8,
          },
          firstName: {
            type: "string",
            example: "Pablo",
          },
          lastName: {
            type: "string",
            example: "Massuh",
          },
          email: {
            type: "string",
            example: "pablomassuh@hotmail.com",
            required: true,
          },
          placeId: {
            type: "string",
            description: "It's the id of the user's city",
            example: "ChIJWcbC2mUso5URjTfoNV12W7k",
          },
          interests: {
            type: "array",
            description: "It's an array of string of the user's interests",
            example: "['COOKING', 'YOGA']",
          },
          fcmtoken: {
            type: "string",
            description: "It's the firebase token to be used in push notifications ",
            example: "faskjfladsfjkljk4k43kjvjasgjlktgjkljkl56jkdk33l2",
          },
        },
      },
      RequestNotify: {
        type: "object",
        properties: {
          to: {
            type: "string",
            example: "6161da733dbb2500114bc6cf",
          },
          from: {
            type: "string",
            example: "61649b014eae860011ceb0db",
          },
          message: {
            type: "string",
            example: "Message example!",
          },
        },
      },
      RequestRegister: {
        type: "object",
        properties: {
          password: {
            type: "string",
            description: "Your password",
            example: "Passw0rd1234",
            minlength: 8,
            required: true,
          },
          firstName: {
            type: "string",
            example: "Pablo",
            required: true,
          },
          lastName: {
            type: "string",
            example: "Massuh",
            required: true,
          },
          email: {
            type: "string",
            example: "pablomassuh@hotmail.com",
            required: true,
          },
          placeId: {
            type: "string",
            description: "It's the id of the user's city",
            example: "ChIJWcbC2mUso5URjTfoNV12W7k",
          },
          interests: {
            type: "array",
            description: "It's an array of string of the user's interests",
            example: "['COOKING', 'YOGA']",
          },
        },
      },
      GetUsers: {
        type: "object",
        properties: {
          users: {
            type: "array",
            items: {
              $ref: "#/components/schemas/User",
            },
          },
        },
      },
      ResponseGetUsersByIds: {
        type: "array",
        items: {
          $ref: "#/components/schemas/User",
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
            example:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwYWJsb21hc3N1aEBnbWFpbC5jb20iLCJpYXQiOjE2Mzk2ODA5NTYsImV4cCI6MTYzOTY4ODE1Nn0.zXrdT2CZ6qqCDGpusNogwwWrwvZBWjlnUJ6tCl_vAZU",
          },
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
      //Response: 400, 404, 500..
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
      ErrorInvalidIdFormat: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "The given id has a not valid format",
            example: "Invalid user id format.",
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
      ErrorNotFound: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "the cause of the error",
            example: "User not found",
          },
        },
      },
      BadRequest: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "the invalid field",
            example: "Password cannot be empty.",
          },
        },
      },
      Conflict: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "The reason of the conflict",
            example: " Sorry, email example@gmail.com is already registered.",
          },
        },
      },
      // Properties
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "6161da733dbb2500114bc6cf",
          },
          firstName: {
            type: "string",
            example: "Pablo",
          },
          lastName: {
            type: "string",
            example: "Massuh",
          },
          email: {
            type: "string",
            example: "pablomassuh@hotmail.com",
          },
          placeId: {
            type: "string",
            description: "It's the id of the user's city",
            example: "ChIJWcbC2mUso5URjTfoNV12W7k",
          },
          interests: {
            type: "array",
            description: "It's an array of string of the user's interests",
            example: "['COOKING', 'YOGA']",
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
                example: "pZ5ImYPG57TsR4ZqqpBuiuYJFy06",
              },
              picture: {
                type: "string",
                description: "URL with the user picture",
                example: "https://lh3.googleusercontent.com/a-/AOh14Gip9foTlZxrU9AEz4VH14M8VjL-fYbu_EX3J9lgvjI=s96-c",
              },
            },
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

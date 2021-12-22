# Users microservice

[![Build Status](https://app.travis-ci.com/20212C-Taller2/users.svg?branch=main)](https://app.travis-ci.com/20212C-Taller2/users)
[![Coverage Status](https://coveralls.io/repos/github/20212C-Taller2/users/badge.svg?branch=main)](https://coveralls.io/github/20212C-Taller2/users?branch=main)

## Interface

Endpoint's description are available in: https://ubademy-users-api.herokuapp.com/docs/
 

## Start application
After cloning the git repository, execute:

```javascript
$ npm install
$ npm start
```

And the app will be running on http://localhost:3000/

## Running tests
To execute the tests just do in the console:

```javascript
$ cd [your_project]
$ npm test
```

and you will see the results:

```javascript
/GET invalid route
    ✔ should return a 404 error (126ms)
    ✔ should return a 404 error with Origin header too
    ✔ should return a 404 error with Access-Control-Request-Method header too
    ✔ should return a 404 error with Access-Control-Request-Headers header too
    ✔ should return a 200 for OPTIONS method

/GET index default route
    ✔ should return a name and api version

Model Database
    ✔ should connect with valid credentials
    ✔ should not connect with invalid credentials
    ✔ should disconnect after being connected

/login route
    ✔ should return a 404 for empty request body

    With existent created User
          ✔ should return 200 for valid admin login
          ✔ should return 404 for valid admin trying to login as user
          ✔ should return 500 for internal error

/login route
    ✔ should return a 404 for empty request body

    With existent created User
          ✔ should return 401 not authorized for invalid password
          ✔ should return 200 for valid user login
          ✔ should return 404 for valid user trying to login as admin
          ✔ should return 500 for internal error

    With a blocked user
      ✔ should return 401 not authorized for valid credentials

middleware.ErrorHandler
    ✔ should handle error

/register/admin route
    ✔ should return a 400 for no email address
    ✔ should return a 400 for invalid email address
    ✔ should return a 400 for empty First name
    ✔ should return a 400 for empty first name
    ✔ should return a 400 for empty password

    With an already created User
          ✔ should return 409 trying to re register that user
          ✔ should return 200 for valid new admin registration
          ✔ should return 500 for internal error

/register route
    ✔ should return a 400 for no email address
    ✔ should return a 400 for invalid email address
    ✔ should return a 400 for empty First name
    ✔ should return a 400 for empty first name
    ✔ should return a 400 for empty password

    With an already created User
          ✔ should return 409 trying to re register that user
          ✔ should return 200 for valid new user registration  (839ms)
          ✔ should return 500 for internal error

/users/:id route
    ✔ should return a 403 error due to lack of request token
    ✔ should return a 401 error for invalid token
    ✔ should return a 401 error for expired token
    ✔ should return a 400 error for invalid user id format
    ✔ should return a 404 error for non existent user id
    ✔ should return 500 for internal error

    with an already created user
          ✔ should return 400 if there is nothing to update about the user
          ✔ should return 409 if there for an already registered email
          ✔ should update the user

/users/:id/block route
    ✔ should return a 403 error due to lack of request token
    ✔ should return a 403 error due to lack of request token
    ✔ should return a 401 error for invalid token
    ✔ should return a 401 error for invalid token
    ✔ should return a 401 error for expired token

    with valid credential but not admin user
          ✔ should be not authorized
    
    with admin user
          ✔ should return a 400 error for invalid user id format
          ✔ should return a 400 error for invalid user id format
          ✔ should return a 404 error for non existent user id
          ✔ should return a 404 error for non existent user id
          ✔ should return 500 for internal error
          ✔ should return 500 for internal error
    
    with a non blocked user
            ✔ should block it
            ✔ should fail trying to un block it
    
    with a blocked user
            ✔ should unblock it
            ✔ should fail trying to block it again


62 passing (5s)
```

const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const assertArrays = require("chai-arrays");
chai.use(assertArrays);
const application = require("../../app");
const proxyquire = require("proxyquire");
const tokenService = require("./../../services/login/tokenService");
const config = require("./../../config/config");
const MockLogger = require("./../mocks/MockLogger");
const mockLogger = MockLogger.buildLogger(false);

const databaseWithMockLogger = proxyquire("../../model/Database", {
  "../services/log/logService": mockLogger,
});
const mockDatabase = proxyquire("../model/databaseTestHelper", {
  "./../../model/Database": databaseWithMockLogger,
});
const User = require("../../model/schema/User");
const moment = require("moment");
const jwt = require("jwt-simple");
const userId = "6161dd05b63b290011ba11ba";

const invalidToken = "invalid-token";
const testFirstName = "testFirstName";
const testLastName = "testLastName";
const testEmail = "tes@tes.com";
const testPassword = "123456";
const validToken = tokenService.createExpireToken(testEmail, config.TOKEN_EXPIRATION_TIME_IN_HS);

describe("/tasks/:id route", () => {
  beforeEach(async () => {
    await mockDatabase.createInMemoryDataBase();
  });

  afterEach(async () => {
    await mockDatabase.destroyInMemoryDataBase();
  });

  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .patch("/users/" + userId)
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .patch("/users/" + userId)
      .set("Authorization", "Bearer " + invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return a 401 error for expired token", (done) => {
    const payload = {
      sub: testEmail,
      iat: moment().unix(),
    };
    const expiredToken = jwt.encode(payload, config.TOKEN_SECRET);
    chai
      .request(application)
      .patch("/users/" + userId)
      .set("Authorization", "Bearer " + expiredToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return a 400 error for invalid user id format", (done) => {
    chai
      .request(application)
      .patch("/users/1")
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res.body).to.have.property("message").to.be.equal("Invalid user id format");
        expect(res).to.have.status(400);
        done();
      });
  });
  it("should return a 404 error for non existent user id", (done) => {
    chai
      .request(application)
      .patch("/users/" + userId)
      .set("Authorization", "Bearer " + validToken)
      .end((err, res) => {
        expect(res.body)
          .to.have.property("message")
          .to.be.equal("There is no user with id: " + userId);
        expect(res).to.have.status(404);
        done();
      });
  });
  it("should return 500 for internal error", (done) => {
    const userMock = {
      findById: async function (orderNumber) {
        return new Promise((resolve, reject) => {
          reject("findById: Failing on purpose");
        });
      },
    };
    const usersWithMockedUser = proxyquire("../../routes/users", {
      "../model/schema/User": userMock,
      "../services/log/logService": mockLogger,
    });

    const application = proxyquire("../../app", {
      "./routes/users": usersWithMockedUser,
    });

    chai
      .request(application)
      .patch("/users/" + userId)
      .set("Authorization", "Bearer " + validToken)
      .send({
        email: testEmail,
        password: testPassword,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });

  describe("with an already created user", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
      const user = new User({
        _id: userId,
        firstName: testFirstName,
        lastName: testLastName,
        email: testEmail,
        password: testPassword,
      });
      await user.save();
    });

    it("should return 400 if there is nothing to update about the user", (done) => {
      const application = proxyquire("../../app", {});
      chai
        .request(application)
        .patch("/users/" + userId)
        .set("Authorization", "Bearer " + validToken)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message").to.be.equal("There is nothing to update");
          done();
        });
    });

    it("should update the user", (done) => {
      const application = proxyquire("../../app", {});
      chai
        .request(application)
        .patch("/users/" + userId)
        .set("Authorization", "Bearer " + validToken)
        .send({
          email: "new@validmail.com",
          firstName: "new first name",
          lastName: "new last name",
        })
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });
  });
});
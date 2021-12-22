const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const assertArrays = require("chai-arrays");
chai.use(assertArrays);
const proxyquire = require("proxyquire");
const tokenService = require("./../../services/login/tokenService");
const config = require("./../../config/config");
const MockLogger = require("./../mocks/MockLogger");
const mockLogger = MockLogger.buildLogger(false);
const constants = require("../../model/constants");
const MockQueue = require("./../mocks/MockQueue");

const databaseWithMockLogger = proxyquire("../../model/Database", {
  "../services/log/logService": mockLogger,
});
const mockDatabase = proxyquire("../model/databaseTestHelper", {
  "./../../model/Database": databaseWithMockLogger,
});

const serviceMetricsWithMockQueue = proxyquire("../../services/metricsService", {
  amqplib: MockQueue,
  "./../services/log/logService": mockLogger,
});

const userWithMockedMetricsService = proxyquire("../../routes/users", {
  "../services/metricsService": serviceMetricsWithMockQueue,
});

const application = proxyquire("../../app", {
  "./routes/users": userWithMockedMetricsService,
});

const User = require("../../model/schema/User");
const moment = require("moment");
const jwt = require("jwt-simple");
const userId = "6161dd05b63b290011ba11ba";
const adminId = "6161dd05b63b290011ba11b2";

const invalidToken = "invalid-token";
const testFirstName = "testFirstName";
const testLastName = "testLastName";
const testEmail = "tes@tes.com";
const testOtherEmail = "tesOther@tes.com";
const adminEmail = "admin@admin.com";
const testPassword = "123456";
const testPlaceId = "ChIJgTwKgJcpQg0RaSKMYcHeNsQ";
const validToken = tokenService.createExpireToken(testEmail, config.TOKEN_EXPIRATION_TIME_IN_HS);
const adminToken = tokenService.createExpireToken(adminEmail, config.TOKEN_EXPIRATION_TIME_IN_HS);

describe("/users/:id route", () => {
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
        placeId: testPlaceId,
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
          expect(res.body).to.have.property("message").to.be.equal("There is nothing valid to update");
          done();
        });
    });

    it("should return 409 if there for an already registered email", (done) => {
      const application = proxyquire("../../app", {});
      const user = new User({
        firstName: testFirstName,
        lastName: testLastName,
        email: testOtherEmail,
        password: testPassword,
        placeId: testPlaceId,
      });
      user.save().then(() => {
        chai
          .request(application)
          .patch("/users/" + userId)
          .set("Authorization", "Bearer " + validToken)
          .send({
            email: testOtherEmail,
          })
          .end((err, res) => {
            expect(res).to.have.status(409);
            expect(res.body)
              .to.have.property("message")
              .to.be.equal("Sorry, email " + testOtherEmail + " is already registered.");
            done();
          });
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
          placeId: "newPlaceId",
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

describe("/users/:id/block route", () => {
  beforeEach(async () => {
    await mockDatabase.createInMemoryDataBase();
  });

  afterEach(async () => {
    await mockDatabase.destroyInMemoryDataBase();
  });

  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .post("/users/" + userId + "/block")
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 403 error due to lack of request token", (done) => {
    chai
      .request(application)
      .delete("/users/" + userId + "/block")
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .post("/users/" + userId + "/block")
      .set("Authorization", "Bearer " + invalidToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it("should return a 401 error for invalid token", (done) => {
    chai
      .request(application)
      .delete("/users/" + userId + "/block")
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
      .post("/users/" + userId + "/block")
      .set("Authorization", "Bearer " + expiredToken)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  describe("with valid credential but not admin user", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
      const notAdmin = new User({
        _id: adminId,
        firstName: testFirstName,
        lastName: testLastName,
        email: testEmail,
        password: testPassword,
        blocked: false,
        placeId: testPlaceId,
      });
      await notAdmin.save();
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });

    it("should be not authorized", (done) => {
      const application = proxyquire("../../app", {});
      chai
        .request(application)
        .post("/users/" + userId + "/block")
        .set("Authorization", "Bearer " + validToken)
        .end(async (err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("message").to.be.equal("User is not allowed to perform the action.");
          done();
        });
    });
  });

  describe("with admin user", () => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
      const admin = new User({
        _id: adminId,
        firstName: testFirstName,
        lastName: testLastName,
        email: adminEmail,
        password: testPassword,
        blocked: false,
        roles: [constants.ADMIN_ROLE],
        placeId: testPlaceId,
      });
      await admin.save();
    });

    afterEach(async () => {
      await mockDatabase.destroyInMemoryDataBase();
    });

    it("should return a 400 error for invalid user id format", (done) => {
      chai
        .request(application)
        .post("/users/1/block")
        .set("Authorization", "Bearer " + adminToken)
        .end((err, res) => {
          expect(res.body).to.have.property("message").to.be.equal("Invalid user id format");
          expect(res).to.have.status(400);
          done();
        });
    });
    it("should return a 400 error for invalid user id format", (done) => {
      chai
        .request(application)
        .delete("/users/1/block")
        .set("Authorization", "Bearer " + adminToken)
        .end((err, res) => {
          expect(res.body).to.have.property("message").to.be.equal("Invalid user id format");
          expect(res).to.have.status(400);
          done();
        });
    });

    it("should return a 404 error for non existent user id", (done) => {
      chai
        .request(application)
        .post("/users/" + userId + "/block")
        .set("Authorization", "Bearer " + adminToken)
        .end((err, res) => {
          expect(res.body)
            .to.have.property("message")
            .to.be.equal("There is no user with id: " + userId);
          expect(res).to.have.status(404);
          done();
        });
    });
    it("should return a 404 error for non existent user id", (done) => {
      chai
        .request(application)
        .delete("/users/" + userId + "/block")
        .set("Authorization", "Bearer " + adminToken)
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
        .delete("/users/" + userId + "/block")
        .set("Authorization", "Bearer " + adminToken)
        .send({
          email: testEmail,
          password: testPassword,
        })
        .end((err, res) => {
          expect(res).to.have.status(500);
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
        .post("/users/" + userId + "/block")
        .set("Authorization", "Bearer " + adminToken)
        .send({
          email: testEmail,
          password: testPassword,
        })
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });

    describe("with a non blocked user", () => {
      beforeEach(async () => {
        await mockDatabase.createInMemoryDataBase();
        const user = new User({
          _id: userId,
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail,
          password: testPassword,
          blocked: false,
          placeId: testPlaceId,
        });
        await user.save();
      });

      it("should block it", (done) => {
        chai
          .request(application)
          .post("/users/" + userId + "/block")
          .set("Authorization", "Bearer " + adminToken)
          .end(async (err, res) => {
            expect(res).to.have.status(204);
            const updatedUser = await User.findById(userId);
            expect(updatedUser.blocked).to.be.true;
            expect(MockQueue.hasMessage(serviceMetricsWithMockQueue.USER_BLOCKED_METRIC)).not.to.be.undefined;
            done();
          });
      });

      it("should fail trying to un block it", (done) => {
        const application = proxyquire("../../app", {});
        chai
          .request(application)
          .delete("/users/" + userId + "/block")
          .set("Authorization", "Bearer " + adminToken)
          .end(async (err, res) => {
            expect(res).to.have.status(400);
            const updatedUser = await User.findById(userId);
            expect(updatedUser.blocked).to.be.false;
            done();
          });
      });

      afterEach(async () => {
        await mockDatabase.destroyInMemoryDataBase();
      });
    });
    describe("with a blocked user", () => {
      beforeEach(async () => {
        await mockDatabase.createInMemoryDataBase();
        const user = new User({
          _id: userId,
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail,
          password: testPassword,
          blocked: true,
          placeId: testPlaceId,
        });
        await user.save();
      });

      it("should unblock it", (done) => {
        chai
          .request(application)
          .delete("/users/" + userId + "/block")
          .set("Authorization", "Bearer " + adminToken)
          .end(async (err, res) => {
            expect(res).to.have.status(204);
            const updatedUser = await User.findById(userId);
            expect(updatedUser.blocked).to.be.false;
            expect(MockQueue.hasMessage(serviceMetricsWithMockQueue.USER_UNBLOCKED_METRIC)).not.to.be.undefined;
            done();
          });
      });

      it("should fail trying to block it again", (done) => {
        const application = proxyquire("../../app", {});
        chai
          .request(application)
          .post("/users/" + userId + "/block")
          .set("Authorization", "Bearer " + adminToken)
          .end(async (err, res) => {
            expect(res).to.have.status(400);
            const updatedUser = await User.findById(userId);
            expect(updatedUser.blocked).to.be.true;
            done();
          });
      });

      afterEach(async () => {
        await mockDatabase.destroyInMemoryDataBase();
      });
    });
  });
});

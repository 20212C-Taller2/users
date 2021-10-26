const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = require("chai").expect;
chai.use(chaiHttp);
const assertArrays = require("chai-arrays");
chai.use(assertArrays);
const application = require("../../app");
const proxyquire = require("proxyquire");
const bcrypt = require("bcryptjs");
const MockLogger = require("./../mocks/MockLogger");
const mockLogger = MockLogger.buildLogger(false);

const databaseWithMockLogger = proxyquire("../../model/Database", {
  "../services/log/logService": mockLogger,
});
const mockDatabase = proxyquire("../model/databaseTestHelper", {
  "./../../model/Database": databaseWithMockLogger,
});

const User = require("../../model/schema/User");

const testFirstName = "testFirstName";
const testLastName = "testLastName";
const testEmail = "tes@tes.com";
const testPassword = "123456";
const testPlaceId = "ChIJgTwKgJcpQg0RaSKMYcHeNsQ";

describe("/login route", () => {
  beforeEach(async () => {
    await mockDatabase.createInMemoryDataBase();
  });

  afterEach(async () => {
    await mockDatabase.destroyInMemoryDataBase();
  });

  it("should return a 404 for empty request body", (done) => {
    chai
      .request(application)
      .post("/login")
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message").to.be.equal("Sorry, email or password incorrect.");
        done();
      });
  });

  describe("With existent created User", (done) => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
      const user = new User({
        firstName: testFirstName,
        lastName: testLastName,
        email: testEmail,
        password: bcrypt.hashSync(testPassword, 8),
        placeId: testPlaceId,
      });
      await user.save();
    });

    it("should return 401 not authorized for invalid password", (done) => {
      chai
        .request(application)
        .post("/login")
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail,
          password: "wrongPassword",
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("auth").to.be.equal(false);
          expect(res.body).to.have.property("token").to.be.equal(null);
          expect(res.body).to.have.property("message").to.be.equal("Sorry, email or password incorrect.");
          done();
        });
    });

    it("should return 200 for valid user login ", (done) => {
      chai
        .request(application)
        .post("/login")
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail,
          password: testPassword,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("auth").to.be.equal(true);
          expect(res.body).to.have.property("token").to.be.not.equal(null);
          expect(res.body).to.have.property("user").to.be.not.equal(null);
          expect(res.body.user).to.have.property("id").to.be.not.equal(null);
          expect(res.body.user).to.have.property("firstName").to.be.equal(testFirstName);
          expect(res.body.user).to.have.property("lastName").to.be.equal(testLastName);
          expect(res.body.user).to.have.property("email").to.be.equal(testEmail);
          expect(res.body.user).to.have.property("placeId").to.be.equal(testPlaceId);
          done();
        });
    });

    it("should return 404 for valid user trying to login as admin", (done) => {
      chai
        .request(application)
        .post("/login/admin")
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail,
          password: testPassword,
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("message").to.be.equal("Sorry, email or password incorrect.");
          done();
        });
    });

    it("should return 500 for internal error", (done) => {
      const userMock = {
        findOne: async function (orderNumber) {
          return new Promise((resolve, reject) => {
            reject("findOne: Failing on purpose");
          });
        },
      };
      const loginWithMockedUser = proxyquire("../../routes/login", {
        "../model/schema/User": userMock,
        "../services/log/logService": mockLogger,
      });

      const application = proxyquire("../../app", {
        "./routes/login": loginWithMockedUser,
      });

      chai
        .request(application)
        .post("/login")
        .send({
          email: testEmail,
          password: testPassword,
        })
        .end((err, res) => {
          expect(res).to.have.status(500);
          done();
        });
    });
  });

  describe("With a blocked user", (done) => {
    beforeEach(async () => {
      await mockDatabase.createInMemoryDataBase();
      const user = new User({
        firstName: testFirstName,
        lastName: testLastName,
        email: testEmail,
        password: bcrypt.hashSync(testPassword, 8),
        blocked: true,
        placeId: testPlaceId,
      });
      await user.save();
    });

    it("should return 401 not authorized for valid credentials", (done) => {
      chai
        .request(application)
        .post("/login")
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail,
          password: testPassword,
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property("auth").to.be.equal(false);
          expect(res.body).to.have.property("token").to.be.equal(null);
          expect(res.body).to.have.property("message").to.be.equal("The user is blocked.");
          done();
        });
    });
  });
});

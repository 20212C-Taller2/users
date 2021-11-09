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

describe("/register route", () => {
  beforeEach(async () => {
    await mockDatabase.createInMemoryDataBase();
  });

  afterEach(async () => {
    await mockDatabase.destroyInMemoryDataBase();
  });

  it("should return a 400 for no email address", (done) => {
    chai
      .request(application)
      .post("/register")
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").to.be.equal("Invalid email address.");
        done();
      });
  });

  it("should return a 400 for invalid email address", (done) => {
    chai
      .request(application)
      .post("/register")
      .send({ email: "invalid" })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").to.be.equal("Invalid email address.");
        done();
      });
  });

  it("should return a 400 for empty First name", (done) => {
    chai
      .request(application)
      .post("/register")
      .send({ email: testEmail, firstName: "   " })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").to.be.equal("Invalid empty First Name.");
        done();
      });
  });

  it("should return a 400 for empty first name", (done) => {
    chai
      .request(application)
      .post("/register")
      .send({ email: testEmail, firstName: testFirstName, lastName: "  " })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").to.be.equal("Invalid empty Last Name.");
        done();
      });
  });

  it("should return a 400 for empty password", (done) => {
    chai
      .request(application)
      .post("/register")
      .send({ email: testEmail, firstName: testFirstName, lastName: testLastName })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("message").to.be.equal("Password cannot be empty.");
        done();
      });
  });

  describe("With an already created User", (done) => {
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

    it("should return 409 trying to re register that user", (done) => {
      chai
        .request(application)
        .post("/register")
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail,
          password: testPassword,
          placeId: testPlaceId,
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body)
            .to.have.property("message")
            .to.be.equal("Sorry, email " + testEmail + " is already registered.");
          done();
        });
    });

    it("should return 200 for valid new user registration ", (done) => {
      chai
        .request(application)
        .post("/register")
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: "new@validmail.com",
          password: testPassword,
          placeId: testPlaceId,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("auth").to.be.equal(true);
          expect(res.body).to.have.property("token").to.be.not.equal(null);
          expect(res.body.user).to.have.property("id").to.be.not.equal(null);
          expect(res.body.user).to.have.property("firstName").to.be.equal(testFirstName);
          expect(res.body.user).to.have.property("lastName").to.be.equal(testLastName);
          expect(res.body.user).to.have.property("email").to.be.equal("new@validmail.com");
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
      const registerWithMockedUser = proxyquire("../../routes/register", {
        "../model/schema/User": userMock,
        "../services/log/logService": mockLogger,
      });

      const application = proxyquire("../../app", {
        "./routes/register": registerWithMockedUser,
      });

      chai
        .request(application)
        .post("/register")
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail,
          password: testPassword,
          placeId: testPlaceId,
        })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property("message").to.be.equal("There was a problem registering the user.");
          done();
        });
    });
  });
});

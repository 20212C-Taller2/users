const expect = require("chai").expect;
const proxyquire = require("proxyquire");
const MockLogger = require("./../mocks/MockLogger");

const DEBUG_MODE = false;
const genericErrorMessage = "FAILING ON PURPOSE";

function log(message) {
  if (DEBUG_MODE) {
    console.log(message);
  }
}

const mockLogger = MockLogger.buildLogger(false);

describe("Model Database", async () => {
  it("should connect with valid credentials", async () => {
    const moongoseMock = {
      connect: async function (user, pass) {
        log("moongoseMock:: connect => OK");
      },
      set: function () {},
    };

    const database = proxyquire("../../model/Database", {
      mongoose: moongoseMock,
      "../services/log/logService": mockLogger,
    });

    const result = await database.connect();
    expect(result).to.be.equals(undefined);
  });

  it("should not connect with invalid credentials", async () => {
    const moongoseMock = {
      connect: async function (user, pass) {
        log("moongoseMock:: connect => FAILED");
        return new Promise((resolve, reject) => {
          reject(genericErrorMessage);
        });
      },
      set: function () {},
    };

    const database = proxyquire("../../model/Database", {
      mongoose: moongoseMock,
      "../services/log/logService": mockLogger,
    });

    const result = await database.connect();
    expect(result).to.be.equals(undefined);
  });

  it("should disconnect after being connected", async () => {
    const moongoseMock = {
      connect: async function (user, pass) {
        log("moongoseMock:: connect => OK");
      },
      disconnect: async function () {
        log("moongoseMock:: disconnect => OK");
      },
      set: function () {},
    };

    const database = proxyquire("../../model/Database", {
      mongoose: moongoseMock,
      "../services/log/logService": mockLogger,
    });

    await database.connect();
    const result = await database.disconnect();
    expect(result).to.be.equals(undefined);
  });
});

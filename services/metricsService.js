const amqp = require("amqplib");
const config = require("./../config/config");
const queue = config.METRICS_QUEUE;
const logger = require("./../services/log/logService");

const USER_LOGIN_METRIC = "user-login";
const USER_FEDERATED_LOGIN_METRIC = "user-federated-login";
const USER_REGISTER_METRIC = "user-register";
const USER_FEDERATED_REGISTER_METRIC = "user-federated-register";
const USER_BLOCKED_METRIC = "user-blocked";
const USER_UNBLOCKED_METRIC = "user-unblocked";

module.exports = {
  publishMetric: async (operation) => {
    const connection = await amqp.connect(config.CLOUDAMQP_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue);
    const message = {
      id: Math.random().toString(32).slice(2, 6),
      date: new Date(),
      service: "users",
      operation: operation,
    };
    logger.log(`Sending message to "${queue}" queue: `, JSON.stringify(message));
    const sent = await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    if (!sent) {
      logger.error(`Fails sending message to "${queue}" queue`, message);
    }
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  },
  USER_LOGIN_METRIC,
  USER_FEDERATED_LOGIN_METRIC,
  USER_REGISTER_METRIC,
  USER_FEDERATED_REGISTER_METRIC,
  USER_BLOCKED_METRIC,
  USER_UNBLOCKED_METRIC,
};

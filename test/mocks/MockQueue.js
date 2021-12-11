let messages = [];
module.exports = {
  connect: async (url) => {
    return {
      async createChannel() {
        return {
          async assertQueue(name) {
            messages = [];
          },
          async sendToQueue(queue, message, settings) {
            const content = JSON.parse(message.toString());
            messages.push(content);
            return true;
          },
          close() {},
        };
      },
      close() {},
    };
  },
  hasMessage: function (operation) {
    return messages.find((queueMessage) => queueMessage.operation === operation);
  },
};

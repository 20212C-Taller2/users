const needle = require("needle");
const config = require("./../config/config.js");

module.exports = {
  createSubscriber: async (userId) => {
    return new Promise((resolve, reject) => {
      needle.post(
        config.SUBSCRIPTION_SERVICE_URL + "/subscribers/",
        {
          subscriber_id: userId,
        },
        { json: true },
        (err, res) => {
          if (err) {
            reject(err);
          } else if (res.statusCode !== 200) {
            reject(res.body);
          } else {
            resolve();
          }
        }
      );
    });
  },
};

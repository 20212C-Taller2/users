module.exports = {
  buildAdmin(validToken = true, decodedToken) {
    return {
      initializeApp(options) {},
      credential: {
        cert(credentials) {},
      },
      auth() {},
      verifyIdToken(token) {
        return new Promise((resolve, reject) => {
          if (validToken) {
            return resolve(decodedToken);
          } else {
            reject();
          }
        });
      },
    };
  },
};

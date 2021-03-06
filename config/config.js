module.exports = {
  MONGODB_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/users",
  MONGODB_CONFIG: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  TOKEN_EXPIRATION_TIME_IN_HS: process.env.TOKEN_EXPIRATION_TIME_IN_HS || 2,
  TOKEN_SECRET: process.env.TOKEN_SECRET || "users-ultra-secret-token-value",
  FIREBASE_SECRET: process.env.FIREBASE_SECRET || "{}",
  METRICS_QUEUE: process.env.QUEUE || "service-metrics",
  CLOUDAMQP_URL: process.env.CLOUDAMQP_URL || "amqps://localhost",
  SUBSCRIPTION_SERVICE_URL: process.env.SUBSCRIPTION_SERVICE_URL || "https://ubademy-subscriptions-api.herokuapp.com",
};

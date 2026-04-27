const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
  if (env.skipDbConnect) {
    console.warn("[db] MongoDB connection skipped because SKIP_DB_CONNECT=true");
    return null;
  }

  if (!env.mongoUri) {
    throw new Error("MONGO_URI is missing. Add it to .env before starting the server.");
  }

  const connection = await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: env.mongoServerSelectionTimeoutMS,
  });

  console.log(`[db] Connected to MongoDB at ${connection.connection.host}`);
  return connection;
};

module.exports = connectDB;

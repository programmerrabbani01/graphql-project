import colors from "colors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import mongoDBConnection from "./config/db.js";
import cookieParser from "cookie-parser";
import express from "express";
import tokenVerify from "./middlewares/verifyToken.js";

// dotenv configuration
dotenv.config();

// environment configuration
const PORT = process.env.PORT || 6060;

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom context function to parse cookies and set the user context
const context = async ({ req, res }) => {
  const cookies = cookieParser.JSONCookies(req.cookies);
  const token = req.headers.authorization?.split(" ")[1] || cookies.accessToken;

  let user = null;
  if (token) {
    user = await tokenVerify(token);
  }
  return { user, req, res };
};

// Create Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Server configuration
const serverListen = async () => {
  await mongoDBConnection();

  await startStandaloneServer(server, {
    context: async ({ req, res }) => {
      app(req, res, () => {}); // Manually run middleware
      return context({ req, res });
    },
    listen: {
      port: PORT,
    },
  });

  console.log(`Starting server on port ${PORT}`.bgGreen.black);
};

serverListen();

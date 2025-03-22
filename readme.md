# Fitness AI Project

This project is a **Fitness AI** application that leverages OpenAI for AI-powered features and uses Chroma Db for Ai data storage. The project is built using the **MERN stack** (MongoDB, Express, React, Node.js) with a focus on fitness-related AI functionalities.

## Prerequisites

Before you can run the project locally, ensure you have the following installed:

- **Node.js**: Version 20 or later.
- **MongoDB**: A MongoDB Atlas account (or a local MongoDB instance).
- **Docker** (optional, for local database or other services).

## Environment Variables

The project requires the following environment variables to run. You can set them in a `.env` file in the root of your project or export them in your terminal.

```env
OPENAI_API_KEY=your-openai-api-key-here
MONGO_URL=your-mongodb-connection-string-here
BASE_URL=http://localhost
NODE_ENV=development
AUTH_SERVICE_URL_PROD=https://your-prod-auth-url-here
AUTH_SERVICE_URL_DEV=https://your-dev-auth-url-here
AUTH_SERVICE_URL_LOCAL=http://localhost:5000/accounts/verify-jwt
PORT=5000
CHROMA_PORT=8000
```

import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import chalk from "chalk";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    console.log(
      chalk.bgGreen.black.bold(" ✓ SUCCESS ") +
        " " +
        chalk.greenBright.bold("Database initialized successfully!")
    );
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1); // status code means failure, 0 is success
  }
}

app.get("/", (req, res) => {
  res.send("It's working!");
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      chalk.bgBlue.white.bold(" ^_- Server is up and running") +
        " " +
        chalk.blueBright.bold("on PORT", PORT)
    );
  });
});

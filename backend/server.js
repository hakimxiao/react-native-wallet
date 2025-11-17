import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import chalk from "chalk";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json());

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

app.post("/api/transactions", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || amount == undefined || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
      INSERT INTO transactions(user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating transaction", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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

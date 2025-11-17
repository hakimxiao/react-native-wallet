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

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const transaction = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.status(200).json(transaction);
  } catch (e) {
    console.log("Error getting transaction", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING * 
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deletting transaction", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/transactions/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions 
      WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions 
      WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions 
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error getting the summary", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      chalk.bgBlue.white.bold(" ^_- Server is up and running ") +
        " " +
        chalk.blueBright.bold("on PORT", PORT)
    );
  });
});

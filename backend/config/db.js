import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

// Create a SQL connection using our URL
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
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

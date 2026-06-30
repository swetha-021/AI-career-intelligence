import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initializeDatabase() {
  const db = await open({
    filename: "./jobs.db",
    driver: sqlite3.Database,
  });

await db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    resume BLOB NOT NULL,
    coverLetter TEXT NOT NULL,
    appliedDate TEXT NOT NULL
  )
`);
  return db;
}
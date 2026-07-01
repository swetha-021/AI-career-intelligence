"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
async function initializeDatabase() {
    const db = await (0, sqlite_1.open)({
        filename: "./jobs.db",
        driver: sqlite3_1.default.Database,
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
//# sourceMappingURL=database.js.map
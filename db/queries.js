const e = require("express");
const pool = require("./pool");

async function findUserByEmail(email) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows;
}

async function createUser(firstname, lastname, email, isadmin, password) {
  if (isadmin) {
    await pool.query(
      "INSERT INTO users (firstname, lastname, email, status, is_admin, password) VALUES ($1, $2, $3, $4, $5, $6)",
      [firstname, lastname, email, "True", isadmin, password],
    );
  } else {
    await pool.query(
      "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)",
      [firstname, lastname, email, password],
    );
  }
}

async function updateUserStatus(id) {
  await pool.query("UPDATE users SET status = 'True' WHERE id = $1", [id]);
}

async function getAllMessages() {
  const { rows } = await pool.query(
    "SELECT * FROM messages INNER JOIN users ON users.id = messages.user_id",
  );
  return rows;
}

async function removeMessage(messageId) {
  await pool.query("DELETE FROM messages WHERE message_id = $1", [messageId]);
}

async function addMessage(user_id, title, text) {
  await pool.query(
    "INSERT INTO messages (user_id, title, text) VALUES ($1, $2, $3)",
    [user_id, title, text],
  );
}

module.exports = {
  findUserByEmail,
  createUser,
  updateUserStatus,
  getAllMessages,
  addMessage,
  removeMessage,
};

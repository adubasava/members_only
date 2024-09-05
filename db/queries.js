const pool = require("./pool");

async function findUserByEmail(email) {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows;
}

async function findUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows;
}

async function createUser(firstname, lastname, email, password) {
  await pool.query(
    "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)",
    [firstname, lastname, email, password],
  );
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

async function getMessageById(messageId) {
  const { rows } = await pool.query("SELECT * FROM messages WHERE id = $1", [
    messageId,
  ]);
  return rows;
}

async function addMessage(text, username) {
  await pool.query("INSERT INTO messages (text, username) VALUES ($1, $2)", [
    text,
    username,
  ]);
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserStatus,
  getAllMessages,
  addMessage,
  getMessageById,
};

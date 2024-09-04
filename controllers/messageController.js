const db = require("../db/queries");

async function getMessages(req, res) {
  const messages = await db.getAllMessages();
  res.render("index", { title: "Mini Messageboard", messages: messages });
}

async function renderForm(req, res) {
  res.render("form", { title: "Mini Messageboard" });
}

async function renderMessage(req, res) {
  const messageId = parseInt(req.params.id) + 1;
  const message = await db.getMessageById(messageId);
  res.render("message", {
    title: "Mini Messageboard",
    message: message,
  });
}

async function addNewMessage(req, res) {
  const { messageText, messageUser } = req.body;
  await db.addMessage(messageText, messageUser);
  res.redirect("/");
}

module.exports = {
  getMessages,
  addNewMessage,
  renderForm,
  renderMessage,
};

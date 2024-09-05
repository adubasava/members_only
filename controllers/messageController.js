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

async function deleteMessage(req, res) {
  const messageId = req.params.id;
  const messages = await db.getAllMessages();
  try {
    await db.removeMessage(messageId);
    //res.redirect("/");
    res.render("index", {
      user: req.user,
      messages: messages,
    });
  } catch {
    res.render("index", {
      messages: messages,
      user: req.user,
      errorMessage: "Error deliting Message",
    });
  }
}

module.exports = {
  getMessages,
  addNewMessage,
  renderForm,
  renderMessage,
  deleteMessage,
};

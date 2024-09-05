const db = require('../db/queries');
const { validationResult } = require('express-validator');
const myValidationResult = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

async function renderForm(req, res) {
  res.render('messages/new', { title: '', text: '', user: req.user });
}

async function addNewMessage(req, res) {
  const messages = await db.getAllMessages();
  const { title, text } = req.body;
  const errors = myValidationResult(req).array();
  if (errors.length > 0) {
    return res.render('messages/new', {
      errorMessage: errors.join(' '),
      title: title,
      text: text,
      user: req.user,
    });
  }
  try {
    await db.addMessage(req.user.id, title, text);
    res.redirect('/');
  } catch {
    res.render('index', {
      messages: messages,
      user: req.user,
      errorMessage: 'Error adding Message',
    });
  }
}

async function deleteMessage(req, res) {
  const messageId = req.params.id;
  const messages = await db.getAllMessages();
  try {
    await db.removeMessage(messageId);
    res.redirect('/');
  } catch {
    res.render('index', {
      messages: messages,
      user: req.user,
      errorMessage: 'Error deliting Message',
    });
  }
}

module.exports = {
  addNewMessage,
  renderForm,
  deleteMessage,
};

const db = require('../db/queries');

async function getMembership(req, res) {
  res.render('users/membership', { user: req.user });
}

async function updateMembership(req, res) {
  if (req.user) {
    const { secret } = req.body;
    if (secret !== process.env.SECRET) {
      return res.render('users/membership', {
        errorMessage: 'Wrong password!',
        user: req.user,
      });
    }
    try {
      await db.updateUserStatus(req.user.id);
      res.redirect('/');
    } catch (err) {
      return next(err);
    }
  } else {
    res.render('login', {
      errorMessage: 'Login first!',
      email: '',
      password: '',
      user: req.user,
    });
  }
}

module.exports = {
  getMembership,
  updateMembership,
};

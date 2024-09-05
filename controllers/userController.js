const db = require('../db/queries');

async function getMembership(req, res) {
  res.render('users/membership', { user: req.user });
}

async function updateMembership(req, res) {
  if (req.user) {
    const { secret } = req.body;
    console.log(req.user);
    if (secret !== process.env.SECRET) {
      return res.render('users/membership', {
        errorMessage: 'Wrong password!',
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
    });
  }
}

module.exports = {
  getMembership,
  updateMembership,
};

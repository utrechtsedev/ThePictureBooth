// middlewares/auth.js

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('../config/database');

const sessionStore = new SequelizeStore({
  db: sequelize
});

// Initialize the session store - this creates the sessions table
sessionStore.sync();

const Session = session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
  },
});

const requireAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: "Niet geautoriseerd" });
    }
    next();
  };

module.exports = {Session, requireAuth};
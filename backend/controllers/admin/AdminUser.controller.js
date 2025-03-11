// AdminUser.controller.js
const { models } = require('../../models/index')
const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
    try {
      console.log(req.body)
      const { username, password } = req.body;
      const admin = await models.AdminUser.findOne({where: {username: username}})
      if (!admin) return res.status(401).json({ error: "Gebruiker niet gevonden" });
  
      const validPassword = await bcrypt.compare(password, admin.password_hash);
      if (!validPassword) return res.status(401).json({ error: "Ongeldig wachtwoord" });
  
      // Store user session
      req.session.userId = admin.id;
      req.session.role = admin.role;
  
      res.json({ message: "Success" });
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: "Server error" });
    }
};

exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Uitloggen mislukt" });
    
        res.clearCookie("session_cookie", {
          domain: process.env.DOMAIN,
          path: "/",
          httpOnly: true,
          secure: true,
        });
        res.sendStatus(200);
      });
};
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.session.userId;
  
    try {
      if (!userId) {
        return res.status(401).json({error: "Je bent niet ingelogd"})
      }
      const admin = await models.AdminUser.findOne({where: {id: userId}});
      if (!admin) {
        return res.status(401).json({ error: "Gebruiker niet gevonden" });
      }
  
      // Verify old password
      const validPassword = await bcrypt.compare(oldPassword, admin.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: "Ongeldig huidig wachtwoord" });
      }
  
      // Hash new password and update
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password_hash = hashedPassword;
      await admin.save();
  
      res.json({ message: "Wachtwoord succesvol gewijzigd" });
    } catch (error) {
      console.error("Wachtwoord wijzigen fout:", error);
      res.status(500).json({ error: "Server error tijdens wachtwoord wijziging" });
    }
};
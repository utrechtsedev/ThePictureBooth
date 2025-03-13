const { sequelize } = require("../config/database.js");
const { models } = require('./index.js')
const bcrypt = require("bcrypt");

(async () => {
  try {
    await sequelize.sync({ force: true }); // Gebruik { force: true } om de database te resetten
    console.log("✅ Database is gesynchroniseerd!");

    // ✅ Check of er al een admin bestaat
    const adminExists = await models.AdminUser.findOne({ where: { username: "admin" } });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await models.AdminUser.create({
        username: "admin",
        password_hash: hashedPassword,
        role: "superadmin",
      });
      console.log("✅ Standaard admin-account aangemaakt! (Gebruiker: admin, Wachtwoord: admin123)");
    } else {
      console.log("⚠️ Admin account bestaat al.");
    }
  } catch (error) {
    console.error("❌ Fout bij synchroniseren van database:", error);
  } finally {
    await sequelize.close();
  }
})();

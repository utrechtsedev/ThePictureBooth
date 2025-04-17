import { sequelize } from "./database.js";
import { models } from "../models/index.js"
import bcrypt from "bcrypt";

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
        email: "admin@gmail.com",
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

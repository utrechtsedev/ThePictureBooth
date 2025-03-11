const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config/database.js"); 
const { Session } = require('./middlewares/auth.js')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

//  CORS correct instellen
app.use(cors({
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options("*", cors()); //  Verwerk preflight CORS requests

app.use(Session);



//  API Routes
const customerRoutes = require("./routes/customer.route.js");
const adminRoutes = require("./routes/admin.route.js");
const photoboothRoutes = require("./routes/photobooths.route.js");
const reservationRoutes = require("./routes/reservations.route.js");
const paymentRoutes = require("./routes/payments.route.js");

app.use("/api/customers", customerRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/photobooths", photoboothRoutes);
app.use("/api/reservations",reservationRoutes);
app.use("/api/payments", paymentRoutes);





//  Verbinding maken met de database en server starten
const PORT = 4000;

sequelize.authenticate()
  .then(() => {
    console.log(" Verbonden met de database!");

    app.listen(PORT, () => {
      console.log(` Server draait op http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error(" Kan geen verbinding maken met de database:", err);
  });

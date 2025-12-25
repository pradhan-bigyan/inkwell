const express = require("express");
const cors = require("cors");
const { checkConnection } = require("./db/connect");
const app = express();
const router = require("./routes/routes");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://inkwell-7ehe.onrender.com"],
    credentials: true,
  })
);

app.use(helmet());

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

const PORT = process.env.PORT || 8000;

app.use("/api", router);

const start = async () => {
  try {
    await checkConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;

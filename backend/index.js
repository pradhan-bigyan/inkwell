const express = require("express");
const cors = require("cors");
const { checkConnection } = require("./db/connect");
const app = express();
const router = require("./routes/routes");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

const PORT = 8000;

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

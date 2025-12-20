const express = require("express");
const cors = require("cors");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const PORT = 8000;

app.get("/", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

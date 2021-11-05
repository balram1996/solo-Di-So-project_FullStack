const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/Post");

dotenv.config();

const app = express();
app.use(express.json());
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, UseUnifiedTopology: true },
  () => {
    console.log("connected to mongoDB");
  }
);

//middleware
app.use(express());
app.use(helmet());
app.use(morgan("common"))

app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute)

app.listen(8000, () => {
  console.log("server is listning on port 8000");
});

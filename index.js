const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require("./routes/users")

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 5000, () => {
  console.log('App is running..');
});

app.use(express.json());

app.use("/api/users",userRoute);

app.get('/api/test',()=>{
    console.log('test')
});
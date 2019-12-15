const mongoose = require('mongoose');
const db = mongoose
  .connect(
    "mongodb+srv://admin:admin@node-nov-amohn.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(db => console.log("db is connected"))
  .catch(error => console.error(error));

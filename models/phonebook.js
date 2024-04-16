const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// const url = `mongodb+srv://tedkahcom:${password}@cluster0.bkuenha.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`;
const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB", error.message);
  });

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("phoneBook", phoneBookSchema);

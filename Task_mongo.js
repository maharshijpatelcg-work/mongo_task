const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/TaskNew")
  .then(() => console.log("MongoDb Connected Successfully"))
  .catch((error) => console.log("MongoDb connection Failed", error));

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

const User = mongoose.model("User", userSchema);

app.get("/allusers", async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/adduser", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/addusers", async (req, res) => {
  try {
    const users = await User.insertMany(req.body);
    res.status(201).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/updateuser/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const updateUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch("/updateuser/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const updateUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete("/deleteuser/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

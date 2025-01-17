require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const User = require("./modules/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));

const atlasdb = process.env.MONGO_ATLAS;
mongoose.connect(atlasdb)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Route for signup page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.post("/signup", async (req, res) => {
    const { firstName, middleName, lastName, email, phone, country, state, city, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const newUser = new User({
            firstName,
            middleName,
            lastName,
            email,
            phone,
            country,
            state,
            city,
            password,
        });
        await newUser.save();

        console.log("User registered successfully");
        res.redirect("/login");
    } catch (error) {
        console.log("User not saved:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route for login page
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        console.log("Login successful");
        res.send("Welcome, " + user.firstName + "!");
    } catch (error) {
        console.log("Error during login:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});

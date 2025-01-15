const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const User = require("./modules/user");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));

mongoose.connect('mongodb://localhost:27017/signup')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

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
        res.redirect("/")
    } catch (error) {
        console.log("User not saved");
    }
});


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});

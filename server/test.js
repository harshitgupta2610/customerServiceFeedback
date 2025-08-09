const mongoose = require("mongoose");

// Database Address
const url = "mongodb://localhost:27017/GFG";

// Connecting to database
mongoose.connect(url).then((ans) => {
    console.log("Connected Successfully");
}).catch((err) => {
    console.log("Error in the Connection:", err);
});

// Calling Schema class
const Schema = mongoose.Schema;

// Creating Structure of the collection
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, default: 8 },
    skills: [{ type: String }],
    dob: { type: Date },
});

// Student model
const Student = mongoose.model("Student", studentSchema);

// Creating Student document from Model
let student1 = new Student({
    name: "GFG",
    age: 12,
    skills: ["Drawing", "Craft", "Football"],
    dob: new Date("2010-08-08"),
});

// Saving to database
student1.save().then(async (doc) => {
    if (doc) {
        console.log("The student data saved successfully");
        console.log("Saved document:", doc);
    }
}).catch((err) => {
    console.log("Error saving student:", err);
}).finally(() => {
    // Close the connection after operation
    mongoose.connection.close().then(() => {
        console.log("MongoDB connection closed");
    });
});

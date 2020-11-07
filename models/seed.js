// Used to seed the database with apps and roles
const dotenv = require("dotenv");
const App = require("./App");
const Role = require("./Role");
const mongoose = require("mongoose");
const path = require("path");

// Loading env variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Connect to DB
const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.DB_URL, options);

mongoose.connection.on("connected", function () {
  console.log("Database connection established!");
});

mongoose.connection.on("error", function (err) {
  console.log("Database connection connection error: " + err);
});

mongoose.connection.on("disconnected", function () {
  console.log("Database disconnected");
});

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("App terminated... Database connection closed");
    process.exit(0);
  });
});

// Seeding roles
Role.create([
  { name: "student", _apps: [], _userId: [] },
  { name: "professor", _apps: [], _userId: [] },
])
  .then((roles) => {
    console.log("[Model: Roles] seeded successfully");
    return roles;
  })
  .then((roles) => {
    // Seeding apps and populating with roles
    App.create([
      {
        name: "Logistics Reservation",
        desc: "Automation of box booking",
        _roles: [...roles],
        features: [{ name: "Automatic" }, { name: "Fast" }],
      },
      {
        name: "Document and Services",
        desc: "Automation of document withdrawal",
        _roles: [...roles],
        features: [{ name: "Transcript" }, { name: "RandomDoc" }],
      },
      {
        name: "Job App",
        desc: "Official Job App for students",
        _roles: [...roles],
        features: [
          { name: "Add Job" },
          { name: "Find Job" },
          { name: "Update Job" },
        ],
      },
      {
        name: "Admin Dashboard",
        desc: "Administrator interface to manage website settings",
        _roles: [...roles],
        features: [
          { name: "Add User" },
          { name: "Remove User" },
          { name: "Ban User" },
        ],
      },
    ]).then(() => {
      console.log("[Model: Apps] seeded successfully");
      mongoose.disconnect();
      console.log("Seeding terminated... Database connection closed\n");
      console.log("You can now safely run `npm start`");
      process.exit(0);
    });
  })
  .catch((err) => console.error(err));

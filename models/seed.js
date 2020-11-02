// Used to seed the database with apps and roles
const dotenv = require("dotenv");
const App = require("./App");
const Role = require("./Role");
const mongoose = require("mongoose");
const path = require("path");

// Loading env variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

mongoose.connect(
  process.env.DB_URL,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("[FOR SEEDING] Connection to DB established!")
);

// Seeding roles
Role.create([
  { name: "student", _apps: [], _userId: [] },
  { name: "professor", _apps: [], _userId: [] },
])
  .then((roles) => {
    console.log("Roles Seeded Successfully");
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
    ]);
  })
  .then((apps) => console.log("Apps Seeded Successfully"))
  .catch((err) => console.error(err));

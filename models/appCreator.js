const readline = require("readline");
const App = require("./App");
const Roles = require("./Role");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// Loading env variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

function dbConnect() {
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
}

async function appCreator() {
  let newApp = new App({ name: "", desc: "", featues: [], _roles: [] });
  const roles = await Roles.find().lean();
  const rolesStr = roles.map((role) => role.name);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const rolesQuestions = () => {
    rl.question(
      `Choose Roles ( Current Roles: ${rolesStr}): `,
      async (roles) => {
        newApp._roles = [...findRolesIDs(roles.toString().split(","))];
        await newApp.save();
        console.log(`${newApp.name} Has Been Successfully Created!`);
        mongoose.disconnect();
        console.log("Database connection closed\n");
        console.log("You can now safely run `npm start`");
        rl.close();
        rl.removeAllListeners();
      }
    );
  };

  const findRolesIDs = (rolesNames) => {
    const ids = [];
    rolesNames.forEach((role) => {
      roles.forEach((role2) => {
        if (role === role2.name) {
          ids.push(role2._id);
        }
      });
    });
    return ids;
  };

  rl.question("Enter Application's Name: ", (name) => {
    newApp.name = name;
    rl.question("Enter Application's Description: ", (desc) => {
      newApp.desc = desc;
      let featuresCounter = 1;
      rl.setPrompt(
        `Enter Feature n${featuresCounter} | (Leave Blank to Finish): `
      );
      rl.prompt();
      rl.on("line", (feature) => {
        // Finishing features and starting roles assignment
        if (feature === "") {
          rolesQuestions();
        } else {
          newApp.features.push({ name: feature });
          featuresCounter++;
          rl.setPrompt(
            `Enter Feature n${featuresCounter} | (Leave Blank to Finish): `
          );
          rl.prompt();
        }
      }).on("close", () => process.exit(0));
    });
  });
}

dbConnect();
appCreator();

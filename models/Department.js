const mongoose = require("mongoose");

const floorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async name =>
        (await Floor.where({ name }).countDocuments()) === 0,
      message: name => `Name ${name} is already taken`
    }
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  boxes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Box" }],
  capacity: {
    type: Number,
    validate: {
      validator: capacity => Number.isInteger(capacity) && capacity > 0,
      message: "Capacity value is not a positive integer"
    }
  }
});

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: async name =>
        (await Department.where({ name }).countDocuments()) === 0,
      message: name => `Name ${name} is already taken`
    }
  },
  floors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Floor" }],
  capacity: {
    type: Number,
    validate: {
      validator: capacity => Number.isInteger(capacity) && capacity > 0,
      message: "Capacity value is not a positive integer"
    }
  }
});

departmentSchema.pre("save", function preSave(next) {
  let deptCapacity = this.floors.reduce((accumulator, floor) => {
    return accumulator + floor.capacity;
  }, 0);
  this.capacity = deptCapacity;
  next();
});

const Floor = mongoose.model("Floor", floorSchema);
const Department = mongoose.model("Department", departmentSchema);
module.exports = {
  Floor: mongoose.model("Floor", floorSchema),
  Department: mongoose.model("Department", departmentSchema)
};

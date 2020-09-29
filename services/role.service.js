const Role = require("../models/Role");

function roleService() {
  //Get role (userId)
  async function getRoleByUserId(userId) {
    const query = { _userId: userId };
    return Role.findOne(query);
  }

  //Get RoleId by role Name
  async function getRoleIdByRoleName(roleName) {
    return Role.findOne({ name: roleName }, { _id: 1 });
  }

  //Get apps by role

  //return functions
  return {
    getRoleByUserId,
    getRoleIdByRoleName
  };
}

module.exports = roleService;

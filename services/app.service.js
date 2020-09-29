const App = require("../models/App");

function appService() {
  /*
  //Not needed at the moment
  //ADD App
  async function addApp(userData){
    return App.create(userData);
  }

  //Get  APPS
  async function getApps(){
    return App.find({});
  }

  //Delete APP
  //Edit APP

  //Get App feature (by app name), return the features of an app
  //Problem: It return documents
  //Needs a fix
  async function getAppFeatures(appName){
    const query = {name: appName}
    return App.find(query, {_id:0,features:1})
  }

  //Get app name (by feature)
  async function getAppByFeature(feature){
    const query = {"features.name": feature}
    return App.find(query, {_id:0,name:1})
  }
  */
  //Get Apps by RoleId, return an array of apps(objects)
  async function getAppsByRoleId(roleId) {
    const query = { _roles: roleId };
    return App.find(query, { _id: 0, _roles: 0, "features._id": 0 });
  }

  return {
    getAppsByRoleId
  };
}

module.exports = appService;

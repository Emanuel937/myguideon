
const DestinationModel  = require('./models/destinationModal');
const UserAdminModel    = require('./models/useradminModal'); 
const UserproModel = require('./models/userproModel');
const ActivitiesModel = require('./models/activitiesModel');
const RolePermissionsModel = require('./models/RolePermissionsModel');


const tables = {}

/******************************TABLES*********************************************** */
tables.destination =  new  DestinationModel();

tables.userAdmin   =  new  UserAdminModel();

tables.userpro = new UserproModel();

tables.activities = new  ActivitiesModel();

tables.role_permissions = new RolePermissionsModel();

/*************************EXPORT****************************************************** */
module.exports = new Proxy(tables, {
    get(obj, prop) {
      if (prop in obj) return obj[prop];
  
      throw new ReferenceError(
        `tables.${prop} is not defined . Did you want register it in ${__filename}?`,
      );
    },
  });
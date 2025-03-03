const DestinationModel = require('./models/destinationModal');
const UserAdminModel = require('./models/useradminModal'); 
const ActivitiesModel = require('./models/activitiesModel');

const tables = {}

/******************************TABLES*********************************************** */
tables.destination =  new  DestinationModel();
tables.userAdmin   =  new  UserAdminModel();
tables.activities = new  ActivitiesModel();


/*************************EXPORT****************************************************** */
module.exports = new Proxy(tables, {
    get(obj, prop) {
      if (prop in obj) return obj[prop];
  
      throw new ReferenceError(
        `tables.${prop} is not defined . Did you want register it in ${__filename}?`,
      );
    },
  });
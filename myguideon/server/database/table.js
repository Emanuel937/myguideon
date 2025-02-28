const DestinationModal  = require('./models/destinationModal');
const UserAdminModal    = require('./models/useradminModal'); 

const tables            = {

}

tables.destination =  new  DestinationModal ();
tables.userAdmin   =  new  UserAdminModal()



module.exports = tables;
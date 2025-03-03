const sendMail   = require('./transporter');
const hostLink   = require('./host');
const UserAdmin  =  require('../../database/models/useradminModal');


// notify the author of destination 
// when his destinaiton is set to published status 
// it sent a email to the author 
// other notification send email to all admin that 
// have right to update the destination  


//make a template for email then ...




exports.notifyTheAuthor = async (status, destinationID, authorID) => {
    if (status.toLowerCase().includes("published")) {
       
        const [author] = await UserAdmin.findById(authorID);

        if (author.length > 0) {
            const html = `<h1>Votre destination ${destinationID} a été publiée</h1>
                          <p>Consultez-la ici : <a href="${hostLink}/destination/overview/${destinationID}">${hostLink}/destination/overview/${destinationID}</a></p>`;

            sendMail(author[0].email, 'Destination publiée', html);
        }
    }
};

exports.notifyAllAdmin = async (status, destinationID) => {
    if (!status.toLowerCase().includes('pending validation')) return;

    const [admins] = await UserAdmin.findAll();

    const html = `<h1>Validation requise</h1>
                  <p>Une destination (${destinationID}) attend validation.</p>
                  <p><a href="${hostLink}/admin?page=list_destination&isEdit=yes&destinationID=${destinationID}">Valider</a></p>`;

    admins.forEach(admin => sendMail(admin.email, "Validation requise", html));
};

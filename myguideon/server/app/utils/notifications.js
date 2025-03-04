const sendMail = require('./transporter');
const { host } = require('./host');
const UserAdmin = require('../../database/models/useradminModal');

// Notification pour l'auteur lorsque la destination est publiée
exports.notifyTheAuthor = async (status, destinationID, authorID) => {
    if (status.toLowerCase().includes("published")) {
        console.log('Notification à l\'auteur en cours...');

        const [author] = await UserAdmin.findById(authorID);

        if (author.length > 0) {
            const destinationURL = `${host}/destination/overview/${encodeURIComponent(destinationID)}`;
            
            const html = `<h1>Votre destination a été publiée</h1>
                          <p>Consultez-la ici : 
                             <a href="${destinationURL}" target="_blank" 
                                style="color: blue; text-decoration: underline;">
                                Voir ma destination
                             </a>
                          </p>`;

            sendMail(author[0].email, 'Destination publiée', html);
        }
    }
};

// Notification pour tous les admins lorsqu'une destination est en attente de validation
exports.notifyAllAdmin = async (status, destinationID) => {
    if (!status.toLowerCase().includes('pending validation')) return;

    const [admins] = await UserAdmin.findAll();
    
    const destinationURL = `${host}/admin?page=list_destination&isEdit=yes&destinationID=${encodeURIComponent(destinationID)}`;

    const html = `<h1>Validation requise</h1>
                  <p>Une destination (ID: ${destinationID}) est en attente de validation.</p>
                  <p>
                    <a href="${destinationURL}" target="_blank" rel="noopener noreferrer"
                       style="color: blue; text-decoration: underline;">
                       ➡️ Cliquez ici pour valider
                    </a>
                  </p>`;

    admins.forEach(admin => sendMail(admin.email, "Validation requise", html));
};

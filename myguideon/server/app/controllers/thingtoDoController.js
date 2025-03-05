const destinationController = {
    async addThingtoDo(req, res) {
        try{
        console.log('hello emanuel', req.body); // Voir si les champs texte arrivent
        console.log('File uploaded:', req.files); // Vérifier si l'image est bien reçue
        res.send('hellom testing done');
        }catch(error){
            console.log(error);
        }
    }
}

module.exports = destinationController;

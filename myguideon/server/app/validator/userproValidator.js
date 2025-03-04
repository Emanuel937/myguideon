const Joi = require('joi');

/****************Validation pour l'ajout d'un userpro *****************/
const addUserProSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    company_name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    password: Joi.string().min(8).required(),
    imageAlt: Joi.string().allow(null, ''),
    imageDescription: Joi.string().allow(null, ''),
    description: Joi.string().min(10).allow(null, ''),
    profile_image: Joi.string().allow(null, '')
});

/****************** Validation pour la mise à jour d'un UserPro ******************/
const updateUserProSchema = Joi.object({
    name: Joi.string().min(3).max(100).optional(),
    company_name: Joi.string().min(3).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
    password: Joi.string().min(8).optional(),
    imageAlt: Joi.string().allow(null, ''),
    imageDescription: Joi.string().allow(null, ''),
    description: Joi.string().min(10).allow(null, ''),
    profile_image: Joi.string().allow(null, '')
}).min(1);  // 🔄 Au moins un champ doit être fourni

/****************** Validation pour la mise à jour du mot de passe ******************/
const updatePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required()
});

/******************Validation pour l'authentification*************************** */
const authUserProShema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

/**********************Fonctions de validations********************************* */
/******************************************************************************** */
module.exports = {
    addUserProValidation: (data) => addUserProSchema.validate(data),
    updateUserProValidation: (data) => updateUserProSchema.validate(data),
    updatePasswordValidation: (data) => updatePasswordSchema.validate(data),
    authUserProValidation: (data) => authUserProShema.validate(data)
};
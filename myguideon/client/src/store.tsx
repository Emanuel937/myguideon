// store.ts
import { configureStore } from '@reduxjs/toolkit';

// Si vous avez un reducer, l'importer ici
import rootReducer from './reducers'; // Exemple d'importation

// Créez votre store
export const store = configureStore({
  reducer: rootReducer, // Passez votre rootReducer ici
});

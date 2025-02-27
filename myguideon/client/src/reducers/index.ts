import { combineReducers } from 'redux';

// Exemple de reducer (vous pouvez en ajouter plusieurs si nécessaire)
const someReducer = (state = {}, action: any) => {
  switch (action.type) {
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  some: someReducer,
});

export default rootReducer;

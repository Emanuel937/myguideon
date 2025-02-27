import 'bootstrap/dist/css/bootstrap.min.css';
import './public-page/assets/styles/css/global.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes/route';
import { createContext, useState } from 'react';

// Créer le contexte
interface AppContextType {
  submitFunction: () => void;
  setSubmitFunction: (func: () => void) => void;
}


const AppContext = createContext<AppContextType | null>(null);

function App() {
  const [submitFunction, setSubmitFunction] = useState<() => void>(() => {});

  return (
    <AppContext.Provider value={{ submitFunction, setSubmitFunction}}>
      <Router>
        <Routes>
          {routes.map((router, index) => {
            return (
              <Route
                key={index}
                path={router.path}
                element={router.element}
              />
            );
          })}
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}
export { AppContext };
export default App;

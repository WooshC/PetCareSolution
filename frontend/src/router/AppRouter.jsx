import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {routes.map((r, index) => (
          <Route key={index} path={r.path} element={r.element} />
        ))}
      </Routes>
    </Router>
  );
};

export default AppRouter;

import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';


function App() {

  return (
    <div className="antialiased text-text font-sans min-h-screen bg-background">
      <Routes>

        <Route
          path="/dashboard"
          element={
            <Dashboard />
          }
        />

      </Routes>
    </div>
  );
}

export default App;

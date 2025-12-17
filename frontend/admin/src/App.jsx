import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Organizers from './pages/Organizers';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Revenue from './pages/Revenue';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="organizers" element={<Organizers />} />
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="revenue" element={<Revenue />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Breathe } from './pages/Breathe';
import { Meditate } from './pages/Meditate';
import { Journal } from './pages/Journal';
import { Profile } from './pages/Profile';
import { Sounds } from './pages/Sounds';
import { Habits } from './pages/Habits';
import { Resources } from './pages/Resources';
import { Sos } from './pages/Sos';
import { Stretch } from './pages/Stretch';
import { Weekly } from './pages/Weekly';
import { Visualize } from './pages/Visualize';

function AppShell() {
  const { isOnboarded } = useApp();

  if (!isOnboarded) return <Onboarding />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/respirer" element={<Breathe />} />
        <Route path="/mediter" element={<Meditate />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/sons" element={<Sounds />} />
        <Route path="/habitudes" element={<Habits />} />
        <Route path="/ressources" element={<Resources />} />
        <Route path="/sos" element={<Sos />} />
        <Route path="/etirements" element={<Stretch />} />
        <Route path="/bilan" element={<Weekly />} />
        <Route path="/visualisations" element={<Visualize />} />
        <Route path="/profil" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}

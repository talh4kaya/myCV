import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Competitions from './pages/Competitions';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import ErrorBoundary from './components/ErrorBoundary';
import { ChatbotProvider } from './components/ChatbotContext';
import MakapakaFullscreen from './components/MakapakaFullscreen';
import RouteMeta from './components/RouteMeta';

// oyun sayfası (ve yapay zeka kütüphanesi) yalnızca açılınca indirilir
const Mangala = lazy(() => import('./pages/Mangala'));

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <RouteMeta />
        <ChatbotProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/yarismalarim" element={<Competitions />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route
              path="/mangala"
              element={
                <Suspense fallback={null}>
                  <Mangala />
                </Suspense>
              }
            />
            {/* olmayan bir adrese gidilirse boş sayfa yerine anasayfaya dön */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <MakapakaFullscreen />
        </ChatbotProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

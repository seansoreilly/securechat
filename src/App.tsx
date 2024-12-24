import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SecureChat } from './components/SecureChat';
import { CreateRoom } from './components/CreateRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/securechat" replace />} />
        <Route path="/securechat" element={<CreateRoom />} />
        <Route path="/securechat/:roomId" element={<SecureChat />} />
      </Routes>
    </Router>
  );
}

export default App;

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import SharedLayout from "./components/SharedLayout.jsx";
import Login from "./pages/Login.jsx";
import { SupabaseAuthProvider } from "./integrations/supabase/auth.jsx";
import Settings from "./pages/Settings.jsx";
import InteractiveTable from "./pages/InteractiveTable.jsx";
import Chatbot from "./pages/Chatbot.jsx"; // Import the Chatbot page
import TrelloBoard from "./pages/TrelloBoard.jsx"; // Import the TrelloBoard page
import { Toaster } from 'sonner';
import MapPage from "./pages/Map.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Import the ProtectedRoute component

function App() {
  return (
    <SupabaseAuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/interactive-table" element={<InteractiveTable />} />
            <Route path="/chatbot" element={<Chatbot />} /> {/* Add the Chatbot route */}
            <Route path="/map" element={<MapPage />} />
            <Route path="/trello-board" element={<ProtectedRoute><TrelloBoard /></ProtectedRoute>} /> {/* Add the TrelloBoard route */}
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </SupabaseAuthProvider>
  );
}

export default App;
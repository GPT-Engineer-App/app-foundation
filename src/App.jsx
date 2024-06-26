import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import SharedLayout from "./components/SharedLayout.jsx";
import Login from "./pages/Login.jsx";
import { SupabaseAuthProvider } from "./integrations/supabase/auth.jsx";
import Settings from "./pages/Settings.jsx";
import InteractiveTable from "./pages/InteractiveTable.jsx";
import { Toaster } from 'sonner';

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
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </SupabaseAuthProvider>
  );
}

export default App;
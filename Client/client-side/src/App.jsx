import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Landing from "./pages/Landing";
import BrowseItems from "./pages/BrowseItems";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import MyLostItems from "./pages/MyLostItems";
import MyFoundItems from "./pages/MyFoundItems";
import MyClaims from "./pages/MyClaims";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Landing & Public Pages */}
                <Route path="/" element={<Landing />} />
                <Route path="/items" element={<BrowseItems />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard & Profile */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Report Lost & Found */}
                <Route path="/lost-item" element={<ReportLost />} />
                <Route path="/report-lost" element={<ReportLost />} />
                <Route path="/found-item" element={<ReportFound />} />
                <Route path="/report-found" element={<ReportFound />} />

                {/* My Items & Claims */}
                <Route path="/see-lost-item" element={<MyLostItems />} />
                <Route path="/my-lost-items" element={<MyLostItems />} />
                <Route path="/see-found-item" element={<MyFoundItems />} />
                <Route path="/my-found-items" element={<MyFoundItems />} />
                <Route path="/my-claims" element={<MyClaims />} />

                {/* Admin Management */}
                <Route path="/admin" element={<Admin />} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;

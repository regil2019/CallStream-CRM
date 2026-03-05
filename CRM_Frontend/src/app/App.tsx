import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { Sidebar } from "./components/Layout/Sidebar";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { ClientsList } from "./components/Clients/ClientsList";
import { ProjectsList } from "./components/Projects/ProjectsList";
import { Reference } from "./components/Reference/Reference";
import { Statistics } from "./components/Statistics/Statistics";

function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authMode === "login" ? (
      <Login onToggleMode={() => setAuthMode("register")} />
    ) : (
      <Register onToggleMode={() => setAuthMode("login")} />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "clients":
        return <ClientsList />;
      case "projects":
        return <ProjectsList />;
      case "reference":
        return <Reference />;
      case "statistics":
        return <Statistics />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className="lg:pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.15,
                ease: "easeOut",
              }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

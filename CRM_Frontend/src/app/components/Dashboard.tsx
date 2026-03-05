import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ClientsPage } from "./pages/ClientsPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { CallsPage } from "./pages/CallsPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { Reference as ReferencesPage } from "./Reference/Reference";
import { Toaster } from "./ui/sonner";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

type PageType = "clients" | "projects" | "calls" | "statistics" | "references";

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<PageType>("clients");

  const renderPage = () => {
    switch (currentPage) {
      case "clients":
        return <ClientsPage />;
      case "projects":
        return <ProjectsPage />;
      case "calls":
        return <CallsPage />;
      case "statistics":
        return <StatisticsPage />;
      case "references":
        return <ReferencesPage />;
      default:
        return <ClientsPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        user={user}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
      <Toaster position="top-right" />
    </div>
  );
}

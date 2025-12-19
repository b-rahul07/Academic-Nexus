import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/context/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { MainLayout } from "@/components/MainLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Login from "@/pages/Login";
import ChangePassword from "@/pages/ChangePassword";
import NotFound from "@/pages/not-found";

// Placeholder Pages
import StudentDashboard from "@/pages/student/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import SeatingDashboard from "@/pages/seating/Dashboard";
import ClubDashboard from "@/pages/club/Dashboard";

interface CurrentUser {
  id: string;
  role: string;
  name?: string;
}

interface NavCard {
  title: string;
  items: { label: string; href: string }[];
}

const getNavItems = (role?: string): NavCard[] => {
  if (!role) return [];

  switch (role) {
    case 'admin':
      return [
        {
          title: 'Users',
          items: [
            { label: 'Add Student', href: '/admin/dashboard?tab=students' },
            { label: 'Manage Faculty', href: '/admin/dashboard?tab=seating' },
            { label: 'Club Coordinators', href: '/admin/dashboard?tab=club' },
          ],
        },
        {
          title: 'Exams',
          items: [
            { label: 'Seating Allocation', href: '/admin/dashboard?tab=seating-alloc' },
            { label: 'Hall Tickets', href: '/admin/dashboard?tab=tickets' },
          ],
        },
      ];
    case 'student':
      return [
        {
          title: 'Academics',
          items: [
            { label: 'Dashboard', href: '/student/dashboard' },
            { label: 'Study Support', href: '/student/dashboard?tab=study' },
          ],
        },
        {
          title: 'Exams',
          items: [
            { label: 'Hall Ticket', href: '/student/dashboard?tab=ticket' },
            { label: 'Seating Info', href: '/student/dashboard?tab=seating' },
          ],
        },
      ];
    case 'seating_manager':
      return [
        {
          title: 'Allocation',
          items: [
            { label: 'Generate Seating', href: '/seating/dashboard' },
            { label: 'View Rooms', href: '/seating/dashboard?tab=rooms' },
          ],
        },
      ];
    case 'club_coordinator':
      return [
        {
          title: 'Events',
          items: [
            { label: 'Dashboard', href: '/club/dashboard' },
            { label: 'Manage Events', href: '/club/dashboard?tab=events' },
          ],
        },
      ];
    default:
      return [];
  }
};

function ProtectedRoute({ component: Component, requiredRole }: { component: any, requiredRole: string }) {
  const currentUserJson = localStorage.getItem('currentUser');
  
  if (!currentUserJson) {
    return <Redirect to="/" />;
  }

  const currentUser: CurrentUser = JSON.parse(currentUserJson);

  // If role doesn't match, redirect to their correct dashboard
  if (currentUser.role !== requiredRole) {
    const roleMap: Record<string, string> = {
      'student': '/student/dashboard',
      'admin': '/admin/dashboard',
      'seating_manager': '/seating/dashboard',
      'club_coordinator': '/club/dashboard',
    };
    return <Redirect to={roleMap[currentUser.role] || '/'} />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/change-password" component={ChangePassword} />
      
      {/* Student Routes */}
      <Route path="/student/dashboard">
        <ProtectedRoute component={() => <MainLayout userRole="student"><StudentDashboard /></MainLayout>} requiredRole="student" />
      </Route>
      <Route path="/student/*">
        <ProtectedRoute component={() => <MainLayout userRole="student"><StudentDashboard /></MainLayout>} requiredRole="student" />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <ProtectedRoute component={() => <MainLayout userRole="admin"><AdminDashboard /></MainLayout>} requiredRole="admin" />
      </Route>
      <Route path="/admin/*">
        <ProtectedRoute component={() => <MainLayout userRole="admin"><AdminDashboard /></MainLayout>} requiredRole="admin" />
      </Route>

      {/* Seating Routes */}
      <Route path="/seating/dashboard">
        <ProtectedRoute component={() => <MainLayout userRole="seating_manager"><SeatingDashboard /></MainLayout>} requiredRole="seating_manager" />
      </Route>
      <Route path="/seating/*">
        <ProtectedRoute component={() => <MainLayout userRole="seating_manager"><SeatingDashboard /></MainLayout>} requiredRole="seating_manager" />
      </Route>

      {/* Club Routes */}
      <Route path="/club/dashboard">
        <ProtectedRoute component={() => <MainLayout userRole="club_coordinator"><ClubDashboard /></MainLayout>} requiredRole="club_coordinator" />
      </Route>
      <Route path="/club/*">
        <ProtectedRoute component={() => <MainLayout userRole="club_coordinator"><ClubDashboard /></MainLayout>} requiredRole="club_coordinator" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const currentUserJson = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
  const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ErrorBoundary>
          <AppLayout>
            <Router />
          </AppLayout>
        </ErrorBoundary>
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;

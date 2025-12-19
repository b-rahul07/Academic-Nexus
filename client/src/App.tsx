import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/context/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
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
        <ProtectedRoute component={StudentDashboard} requiredRole="student" />
      </Route>
      <Route path="/student/*">
        <ProtectedRoute component={StudentDashboard} requiredRole="student" />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <ProtectedRoute component={AdminDashboard} requiredRole="admin" />
      </Route>
      <Route path="/admin/*">
        <ProtectedRoute component={AdminDashboard} requiredRole="admin" />
      </Route>

      {/* Seating Routes */}
      <Route path="/seating/dashboard">
        <ProtectedRoute component={SeatingDashboard} requiredRole="seating_manager" />
      </Route>
      <Route path="/seating/*">
        <ProtectedRoute component={SeatingDashboard} requiredRole="seating_manager" />
      </Route>

      {/* Club Routes */}
      <Route path="/club/dashboard">
        <ProtectedRoute component={ClubDashboard} requiredRole="club_coordinator" />
      </Route>
      <Route path="/club/*">
        <ProtectedRoute component={ClubDashboard} requiredRole="club_coordinator" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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

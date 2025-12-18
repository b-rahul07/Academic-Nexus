import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider, useApp } from "@/context/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Login from "@/pages/Login";
import ChangePassword from "@/pages/ChangePassword";
import NotFound from "@/pages/not-found";

// Placeholder Pages (We will implement these next)
import StudentDashboard from "@/pages/student/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import SeatingDashboard from "@/pages/seating/Dashboard";
import ClubDashboard from "@/pages/club/Dashboard";

function ProtectedRoute({ component: Component, role }: { component: any, role: string }) {
  const { userRole } = useApp();
  
  if (!userRole) return <Redirect to="/" />;
  if (userRole !== role && role !== 'any') return <Redirect to="/" />;
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/change-password" component={ChangePassword} />
      
      {/* Student Routes */}
      <Route path="/student/dashboard">
        <ProtectedRoute component={StudentDashboard} role="student" />
      </Route>
      <Route path="/student/*">
        <ProtectedRoute component={StudentDashboard} role="student" />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <ProtectedRoute component={AdminDashboard} role="admin" />
      </Route>
       <Route path="/admin/*">
        <ProtectedRoute component={AdminDashboard} role="admin" />
      </Route>

      {/* Seating Routes */}
      <Route path="/seating/dashboard">
        <ProtectedRoute component={SeatingDashboard} role="seating_manager" />
      </Route>
       <Route path="/seating/*">
        <ProtectedRoute component={SeatingDashboard} role="seating_manager" />
      </Route>

      {/* Club Routes */}
      <Route path="/club/dashboard">
        <ProtectedRoute component={ClubDashboard} role="club_coordinator" />
      </Route>
       <Route path="/club/*">
        <ProtectedRoute component={ClubDashboard} role="club_coordinator" />
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

import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider, useApp } from "@/context/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

// Placeholder Pages (We will implement these next)
import StudentDashboard from "@/pages/student/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import SeatingDashboard from "@/pages/seating/Dashboard";
import ClubDashboard from "@/pages/club/Dashboard";

function ProtectedRoute({ component: Component, role }: { component: any, role: string }) {
  const { userRole } = useApp();
  
  if (!userRole) return <Redirect to="/" />;
  // Simple role check - in a real app this would be more robust
  if (userRole !== role && role !== 'any') return <Redirect to="/" />;
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      
      {/* Student Routes */}
      <Route path="/student">
        <ProtectedRoute component={StudentDashboard} role="student" />
      </Route>
      <Route path="/student/*">
        <ProtectedRoute component={StudentDashboard} role="student" />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} role="admin" />
      </Route>
       <Route path="/admin/*">
        <ProtectedRoute component={AdminDashboard} role="admin" />
      </Route>

      {/* Seating Routes */}
      <Route path="/seating">
        <ProtectedRoute component={SeatingDashboard} role="seating_manager" />
      </Route>
       <Route path="/seating/*">
        <ProtectedRoute component={SeatingDashboard} role="seating_manager" />
      </Route>

      {/* Club Routes */}
      <Route path="/club">
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
        <AppLayout>
           <Router />
        </AppLayout>
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;

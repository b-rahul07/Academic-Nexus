import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider, useApp } from "@/context/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
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
      <Route path="/student">
        <ProtectedRoute component={StudentDashboard} role="Student" />
      </Route>
      <Route path="/student/*">
        <ProtectedRoute component={StudentDashboard} role="Student" />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} role="Admin" />
      </Route>
       <Route path="/admin/*">
        <ProtectedRoute component={AdminDashboard} role="Admin" />
      </Route>

      {/* Seating Routes */}
      <Route path="/seating">
        <ProtectedRoute component={SeatingDashboard} role="SeatingManager" />
      </Route>
       <Route path="/seating/*">
        <ProtectedRoute component={SeatingDashboard} role="SeatingManager" />
      </Route>

      {/* Club Routes */}
      <Route path="/club">
        <ProtectedRoute component={ClubDashboard} role="ClubCoordinator" />
      </Route>
       <Route path="/club/*">
        <ProtectedRoute component={ClubDashboard} role="ClubCoordinator" />
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

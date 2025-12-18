import { useState } from 'react';
import { useLocation } from 'wouter';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Shield, Users, PartyPopper, Lock, ArrowRight, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import bgImage from '@assets/generated_images/abstract_executive_dark_background_with_glassmorphism_elements.png';
import logo from '@assets/generated_images/minimalist_academic_university_logo_emblem.png';

export default function Login() {
  const { login } = useApp();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState<string | null>(null);
  const [showDevMode, setShowDevMode] = useState(false);

  const handleLogin = (role: string, path: string, displayName?: string) => {
    setLoading(role);
    setTimeout(() => {
      login(role as any);
      if (displayName) {
        toast({
          title: "Welcome!",
          description: `Logged in as ${displayName}`,
          duration: 2000,
        });
      }
      setLocation(path);
    }, 800);
  };

  const handleDevLogin = (role: string, path: string, displayName: string) => {
    handleLogin(role, path, displayName);
    setShowDevMode(false);
  };

  const roles = [
    { id: 'student', label: 'Student Portal', icon: GraduationCap, path: '/student', color: 'from-blue-500 to-cyan-500' },
    { id: 'admin', label: 'Administrator', icon: Shield, path: '/admin', color: 'from-purple-500 to-pink-500' },
    { id: 'seating_manager', label: 'Seating Manager', icon: Users, path: '/seating', color: 'from-emerald-500 to-teal-500' },
    { id: 'club_coordinator', label: 'Club Coordinator', icon: PartyPopper, path: '/club', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

      <div className="relative z-10 w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Branding */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center justify-center md:justify-start gap-4 mb-4">
             <img src={logo} alt="Logo" className="w-16 h-16 border-2 border-white/20 rounded-full p-2 bg-black/40 backdrop-blur-xl" />
             <h1 className="text-5xl md:text-7xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50 tracking-tighter">
               Nexus
             </h1>
          </div>
          <p className="text-xl text-muted-foreground font-light max-w-md mx-auto md:mx-0">
            The next generation Integrated Academic & Examination Management System.
          </p>
          <div className="flex gap-4 justify-center md:justify-start text-sm text-muted-foreground/60">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Scalable</span>
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Enterprise</span>
          </div>
        </div>

        {/* Right Side: Login Grid */}
        <div className="grid grid-cols-1 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleLogin(role.id, role.path)}
              className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-white/10 backdrop-blur-md p-4 transition-all hover:bg-white/20 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] text-left"
              disabled={!!loading}
              data-testid={`button-login-${role.id}`}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-purple-400 shadow-inner">
                    <role.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all">
                      {role.label}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-cyan-300 transition-colors">
                      Access dashboard
                    </p>
                  </div>
                </div>
                
                <ArrowRight className={`w-5 h-5 text-purple-400 transition-all group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] ${loading === role.id ? 'opacity-0' : 'opacity-100'}`} />
                
                {loading === role.id && (
                  <div className="absolute right-6 animate-spin h-5 w-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full" />
                )}
              </div>
            </button>
          ))}

          {/* Dev Mode Dropdown */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">Quick Access (No Password Required)</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDevMode(!showDevMode)}
                className="gap-2"
                data-testid="button-dev-mode-toggle"
              >
                <Zap className="w-4 h-4" />
                {showDevMode ? 'Hide' : 'Dev Mode'}
              </Button>
            </div>

            {showDevMode ? (
              <div className="space-y-2 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-purple-500/30">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDevLogin('admin', '/admin', 'Super Admin')}
                  disabled={!!loading}
                  className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-cyan-500 border-none text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                  data-testid="button-dev-super-admin"
                >
                  <Shield className="w-3 h-3" />
                  Super Admin
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDevLogin('student', '/student', 'Rahul (Exam Tomorrow)')}
                  disabled={!!loading}
                  className="w-full justify-start gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-purple-500 border-none text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                  data-testid="button-dev-student-rahul"
                >
                  <GraduationCap className="w-3 h-3" />
                  Student: Rahul
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDevLogin('club_coordinator', '/club', 'Club Coordinator')}
                  disabled={!!loading}
                  className="w-full justify-start gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-cyan-500 hover:to-purple-600 border-none text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                  data-testid="button-dev-club-coordinator"
                >
                  <PartyPopper className="w-3 h-3" />
                  Club Coordinator
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDevLogin('student', '/student', 'Demo Student')}
                  disabled={!!loading}
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 border-none text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  data-testid="button-demo-student"
                >
                  Demo Student
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDevLogin('admin', '/admin', 'Demo Admin')}
                  disabled={!!loading}
                  className="bg-gradient-to-r from-cyan-600 to-purple-500 hover:from-cyan-500 hover:to-purple-600 border-none text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                  data-testid="button-demo-admin"
                >
                  Demo Admin
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDevLogin('seating_manager', '/seating', 'Demo Manager')}
                  disabled={!!loading}
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 border-none text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  data-testid="button-demo-manager"
                >
                  Demo Manager
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

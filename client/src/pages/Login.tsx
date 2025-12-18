import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Shield, Users, PartyPopper, Lock, ArrowRight } from 'lucide-react';
import bgImage from '@assets/generated_images/abstract_executive_dark_background_with_glassmorphism_elements.png';
import logo from '@assets/generated_images/minimalist_academic_university_logo_emblem.png';

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    { id: 'Student', label: 'Student Portal', icon: GraduationCap, path: '/student', color: 'from-blue-500 to-cyan-500' },
    { id: 'Admin', label: 'Administrator', icon: Shield, path: '/admin', color: 'from-purple-500 to-pink-500' },
    { id: 'SeatingManager', label: 'Seating Manager', icon: Users, path: '/seating', color: 'from-emerald-500 to-teal-500' },
    { id: 'ClubCoordinator', label: 'Club Coordinator', icon: PartyPopper, path: '/club', color: 'from-orange-500 to-red-500' },
  ];

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setShowForm(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identifier || !password || !selectedRole) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();

      localStorage.setItem('userId', data.id);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('identifier', data.identifier);

      toast({
        title: "Success",
        description: `Logged in as ${data.identifier}`,
      });

      if (data.is_first_login) {
        setLocation('/change-password');
      } else {
        const roleMap: Record<string, string> = {
          'Student': '/student',
          'Admin': '/admin',
          'SeatingManager': '/seating',
          'ClubCoordinator': '/club',
        };
        setLocation(roleMap[data.role] || '/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showForm && selectedRole) {
    const role = roles.find(r => r.id === selectedRole);
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-2 text-center">
            <Button
              variant="ghost"
              onClick={() => { setShowForm(false); setSelectedRole(null); setIdentifier(''); setPassword(''); }}
              className="mb-4"
              data-testid="button-back-to-roles"
            >
              ← Back to Roles
            </Button>
            <div className="flex justify-center mb-4">
              {role && <role.icon className="w-8 h-8 text-blue-400" />}
            </div>
            <h1 className="text-2xl font-bold">{role?.label}</h1>
            <p className="text-sm text-muted-foreground">
              Login with your identifier and password
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Identifier</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Enter your Roll No, Admin ID, or Faculty ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={loading}
                required
                data-testid="input-identifier"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              data-testid="button-login-submit"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="text-xs text-center text-muted-foreground">
            <p className="mb-2">Demo Credentials:</p>
            <p>ID: <code className="bg-muted px-1 rounded">admin</code></p>
            <p>Password: <code className="bg-muted px-1 rounded">admin</code></p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
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

        <div className="grid grid-cols-1 gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-white/10 backdrop-blur-md p-4 transition-all hover:bg-white/20 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] text-left"
              disabled={loading}
              data-testid={`button-login-role-${role.id}`}
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
                
                <ArrowRight className="w-5 h-5 text-purple-400 transition-all group-hover:translate-x-1 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

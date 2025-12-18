import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, RotateCcw, Loader2 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { EmptyState } from '@/components/EmptyState';
import type { User } from '@shared/schema';

export function UserManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('student');

  // Fetch all users
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
  });

  // Register mutations
  const registerStudentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/users/register/student', 'POST', data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Student registered successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const registerManagerMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/users/register/seating-manager', 'POST', data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Seating Manager registered successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const registerCoordinatorMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/users/register/club-coordinator', 'POST', data),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Club Coordinator registered successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (userId: string) => apiRequest('/api/users/reset-password', 'POST', { userId }),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Password reset to DOB successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Register and manage system users</p>
      </div>

      <Tabs defaultValue="register" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Register Users</TabsTrigger>
          <TabsTrigger value="users">View Users</TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="manager">Seating Manager</TabsTrigger>
              <TabsTrigger value="coordinator">Club Coordinator</TabsTrigger>
            </TabsList>

            {/* Register Student */}
            <TabsContent value="student">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Register Student
                  </CardTitle>
                  <CardDescription>Password will be automatically set to DOB (DDMMYYYY)</CardDescription>
                </CardHeader>
                <CardContent>
                  <StudentRegistrationForm 
                    onSubmit={(data) => registerStudentMutation.mutate(data)}
                    isLoading={registerStudentMutation.isPending}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register Seating Manager */}
            <TabsContent value="manager">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Register Seating Manager
                  </CardTitle>
                  <CardDescription>Password will be automatically set to DOB (DDMMYYYY)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ManagerRegistrationForm 
                    onSubmit={(data) => registerManagerMutation.mutate(data)}
                    isLoading={registerManagerMutation.isPending}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Register Club Coordinator */}
            <TabsContent value="coordinator">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Register Club Coordinator
                  </CardTitle>
                  <CardDescription>Password will be automatically set to DOB (DDMMYYYY)</CardDescription>
                </CardHeader>
                <CardContent>
                  <CoordinatorRegistrationForm 
                    onSubmit={(data) => registerCoordinatorMutation.mutate(data)}
                    isLoading={registerCoordinatorMutation.isPending}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* View Users */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Registered Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Identifier</th>
                      <th className="text-left py-3 px-4 font-medium">Department/Club</th>
                      <th className="text-left py-3 px-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-white/5">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4"><span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{user.role}</span></td>
                        <td className="py-3 px-4 font-mono text-xs">{user.identifier}</td>
                        <td className="py-3 px-4 text-muted-foreground">{user.department || user.club_name || '-'}</td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resetPasswordMutation.mutate(user.id)}
                            disabled={resetPasswordMutation.isPending}
                            data-testid={`button-reset-password-${user.id}`}
                            className="gap-2"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Reset
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <EmptyState title="No users registered" description="Register new users to see them listed here" />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StudentRegistrationForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    department: '',
    year: '1',
    dob: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      identifier: formData.rollNo,
      department: formData.department,
      year: parseInt(formData.year),
      dob: formData.dob.replace(/[^0-9]/g, ''),
    });
    setFormData({ name: '', rollNo: '', department: '', year: '1', dob: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="John Doe"
          required
          data-testid="input-student-name"
        />
      </div>

      <div>
        <Label htmlFor="rollNo">Roll Number</Label>
        <Input
          id="rollNo"
          value={formData.rollNo}
          onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
          placeholder="CS-2025-001"
          required
          data-testid="input-student-rollno"
        />
      </div>

      <div>
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          placeholder="Computer Science"
          required
          data-testid="input-student-dept"
        />
      </div>

      <div>
        <Label htmlFor="year">Year</Label>
        <select
          id="year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          data-testid="select-student-year"
        >
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>
      </div>

      <div>
        <Label htmlFor="dob">Date of Birth (DDMMYYYY)</Label>
        <Input
          id="dob"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          placeholder="15031999"
          required
          data-testid="input-student-dob"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full gap-2" data-testid="button-register-student">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Registering...' : 'Register Student'}
      </Button>
    </form>
  );
}

function ManagerRegistrationForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    facultyId: '',
    dob: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      identifier: formData.facultyId,
      dob: formData.dob.replace(/[^0-9]/g, ''),
    });
    setFormData({ name: '', facultyId: '', dob: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Dr. Jane Smith"
          required
          data-testid="input-manager-name"
        />
      </div>

      <div>
        <Label htmlFor="facultyId">Faculty ID</Label>
        <Input
          id="facultyId"
          value={formData.facultyId}
          onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
          placeholder="FAC-001"
          required
          data-testid="input-manager-facid"
        />
      </div>

      <div>
        <Label htmlFor="dob">Date of Birth (DDMMYYYY)</Label>
        <Input
          id="dob"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          placeholder="20051985"
          required
          data-testid="input-manager-dob"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full gap-2" data-testid="button-register-manager">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Registering...' : 'Register Seating Manager'}
      </Button>
    </form>
  );
}

function CoordinatorRegistrationForm({ onSubmit, isLoading }: { onSubmit: (data: any) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    clubName: '',
    dob: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      identifier: formData.studentId,
      clubName: formData.clubName,
      dob: formData.dob.replace(/[^0-9]/g, ''),
    });
    setFormData({ name: '', studentId: '', clubName: '', dob: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Alex Johnson"
          required
          data-testid="input-coordinator-name"
        />
      </div>

      <div>
        <Label htmlFor="studentId">Student ID</Label>
        <Input
          id="studentId"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          placeholder="CS-2023-045"
          required
          data-testid="input-coordinator-studid"
        />
      </div>

      <div>
        <Label htmlFor="clubName">Club Name</Label>
        <Input
          id="clubName"
          value={formData.clubName}
          onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
          placeholder="Robotics Club"
          required
          data-testid="input-coordinator-club"
        />
      </div>

      <div>
        <Label htmlFor="dob">Date of Birth (DDMMYYYY)</Label>
        <Input
          id="dob"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          placeholder="12102002"
          required
          data-testid="input-coordinator-dob"
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full gap-2" data-testid="button-register-coordinator">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Registering...' : 'Register Club Coordinator'}
      </Button>
    </form>
  );
}

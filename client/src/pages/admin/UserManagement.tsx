import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Loader2 } from 'lucide-react';

export function UserManagement() {
  const { toast } = useToast();

  const [studentName, setStudentName] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('');
  const [studentYear, setStudentYear] = useState('1');
  const [studentDob, setStudentDob] = useState('');
  const [studentLoading, setStudentLoading] = useState(false);

  const [seatingName, setSeatingName] = useState('');
  const [seatingId, setSeatingId] = useState('');
  const [seatingDesignation, setSeatingDesignation] = useState('');
  const [seatingDob, setSeatingDob] = useState('');
  const [seatingLoading, setSeatingLoading] = useState(false);

  const [clubName, setClubName] = useState('');
  const [clubId, setClubId] = useState('');
  const [clubClubName, setClubClubName] = useState('');
  const [clubDob, setClubDob] = useState('');
  const [clubLoading, setClubLoading] = useState(false);

  const dobToPassword = (dob: string) => {
    const [year, month, day] = dob.split('-');
    return `${day}${month}${year}`;
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName || !studentRollNo || !studentDepartment || !studentDob) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setStudentLoading(true);
    try {
      const password = dobToPassword(studentDob);
      const { error } = await supabase
        .from('users')
        .insert({
          id: studentRollNo,
          password,
          role: 'student',
          name: studentName,
          department: studentDepartment,
          year: parseInt(studentYear),
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Student ${studentRollNo} created successfully`,
      });

      setStudentName('');
      setStudentRollNo('');
      setStudentDepartment('');
      setStudentYear('1');
      setStudentDob('');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to create student";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setStudentLoading(false);
    }
  };

  const handleAddSeatingManager = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!seatingName || !seatingId || !seatingDesignation || !seatingDob) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSeatingLoading(true);
    try {
      const password = dobToPassword(seatingDob);
      const { error } = await supabase
        .from('users')
        .insert({
          id: seatingId,
          password,
          role: 'seating_manager',
          name: seatingName,
          designation: seatingDesignation,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Seating Manager ${seatingId} created successfully`,
      });

      setSeatingName('');
      setSeatingId('');
      setSeatingDesignation('');
      setSeatingDob('');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to create seating manager";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setSeatingLoading(false);
    }
  };

  const handleAddClubCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clubName || !clubId || !clubClubName || !clubDob) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setClubLoading(true);
    try {
      const password = dobToPassword(clubDob);
      const { error } = await supabase
        .from('users')
        .insert({
          id: clubId,
          password,
          role: 'club_coordinator',
          name: clubName,
          club_name: clubClubName,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Club Coordinator ${clubId} created successfully`,
      });

      setClubName('');
      setClubId('');
      setClubClubName('');
      setClubDob('');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to create club coordinator";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setClubLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Create and manage system users</p>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="seating">Seating Managers</TabsTrigger>
          <TabsTrigger value="club">Club Coordinators</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Student
              </CardTitle>
              <CardDescription>Create a new student account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Name</Label>
                    <Input
                      id="student-name"
                      placeholder="Full name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      disabled={studentLoading}
                      required
                      data-testid="input-student-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-roll">Roll Number</Label>
                    <Input
                      id="student-roll"
                      placeholder="e.g., R101"
                      value={studentRollNo}
                      onChange={(e) => setStudentRollNo(e.target.value)}
                      disabled={studentLoading}
                      required
                      data-testid="input-student-roll"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-dept">Department</Label>
                    <Input
                      id="student-dept"
                      placeholder="e.g., CSE"
                      value={studentDepartment}
                      onChange={(e) => setStudentDepartment(e.target.value)}
                      disabled={studentLoading}
                      required
                      data-testid="input-student-dept"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-year">Year</Label>
                    <select
                      id="student-year"
                      value={studentYear}
                      onChange={(e) => setStudentYear(e.target.value)}
                      disabled={studentLoading}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      data-testid="select-student-year"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student-dob">Date of Birth (for password)</Label>
                  <Input
                    id="student-dob"
                    type="date"
                    value={studentDob}
                    onChange={(e) => setStudentDob(e.target.value)}
                    disabled={studentLoading}
                    required
                    data-testid="input-student-dob"
                  />
                  <p className="text-xs text-muted-foreground">Password will be DDMMYYYY format of DOB</p>
                </div>

                <Button type="submit" disabled={studentLoading} className="w-full" data-testid="button-add-student">
                  {studentLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {studentLoading ? 'Creating...' : 'Create Student'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seating" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Seating Manager
              </CardTitle>
              <CardDescription>Create a new seating manager account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSeatingManager} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seating-name">Name</Label>
                    <Input
                      id="seating-name"
                      placeholder="Full name"
                      value={seatingName}
                      onChange={(e) => setSeatingName(e.target.value)}
                      disabled={seatingLoading}
                      required
                      data-testid="input-seating-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seating-id">Faculty ID</Label>
                    <Input
                      id="seating-id"
                      placeholder="e.g., FAC001"
                      value={seatingId}
                      onChange={(e) => setSeatingId(e.target.value)}
                      disabled={seatingLoading}
                      required
                      data-testid="input-seating-id"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seating-designation">Designation</Label>
                  <Input
                    id="seating-designation"
                    placeholder="e.g., Associate Professor"
                    value={seatingDesignation}
                    onChange={(e) => setSeatingDesignation(e.target.value)}
                    disabled={seatingLoading}
                    required
                    data-testid="input-seating-designation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seating-dob">Date of Birth (for password)</Label>
                  <Input
                    id="seating-dob"
                    type="date"
                    value={seatingDob}
                    onChange={(e) => setSeatingDob(e.target.value)}
                    disabled={seatingLoading}
                    required
                    data-testid="input-seating-dob"
                  />
                  <p className="text-xs text-muted-foreground">Password will be DDMMYYYY format of DOB</p>
                </div>

                <Button type="submit" disabled={seatingLoading} className="w-full" data-testid="button-add-seating">
                  {seatingLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {seatingLoading ? 'Creating...' : 'Create Seating Manager'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="club" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Club Coordinator
              </CardTitle>
              <CardDescription>Create a new club coordinator account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddClubCoordinator} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="club-name">Name</Label>
                    <Input
                      id="club-name"
                      placeholder="Full name"
                      value={clubName}
                      onChange={(e) => setClubName(e.target.value)}
                      disabled={clubLoading}
                      required
                      data-testid="input-club-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="club-id">Coordinator ID</Label>
                    <Input
                      id="club-id"
                      placeholder="e.g., CID001"
                      value={clubId}
                      onChange={(e) => setClubId(e.target.value)}
                      disabled={clubLoading}
                      required
                      data-testid="input-club-id"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="club-club-name">Club Name</Label>
                  <Input
                    id="club-club-name"
                    placeholder="e.g., Robotics Club"
                    value={clubClubName}
                    onChange={(e) => setClubClubName(e.target.value)}
                    disabled={clubLoading}
                    required
                    data-testid="input-club-club-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="club-dob">Date of Birth (for password)</Label>
                  <Input
                    id="club-dob"
                    type="date"
                    value={clubDob}
                    onChange={(e) => setClubDob(e.target.value)}
                    disabled={clubLoading}
                    required
                    data-testid="input-club-dob"
                  />
                  <p className="text-xs text-muted-foreground">Password will be DDMMYYYY format of DOB</p>
                </div>

                <Button type="submit" disabled={clubLoading} className="w-full" data-testid="button-add-club">
                  {clubLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {clubLoading ? 'Creating...' : 'Create Club Coordinator'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../../../lib/supabase';
import { Plus, Loader2 } from 'lucide-react';

export function UserManagement() {
  const { toast } = useToast();

  // Student form state
  const [studentName, setStudentName] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('');
  const [studentYear, setStudentYear] = useState('1');
  const [studentDob, setStudentDob] = useState('');
  const [studentLoading, setStudentLoading] = useState(false);

  // Seating Manager form state
  const [seatingName, setSeatingName] = useState('');
  const [seatingId, setSeatingId] = useState('');
  const [seatingDob, setSeatingDob] = useState('');
  const [seatingLoading, setSeatingLoading] = useState(false);

  // Club Coordinator form state
  const [clubName, setClubName] = useState('');
  const [clubId, setClubId] = useState('');
  const [clubClubName, setClubClubName] = useState('');
  const [clubDob, setClubDob] = useState('');
  const [clubLoading, setClubLoading] = useState(false);

  // Convert YYYY-MM-DD to DDMMYYYY format for password
  const dobToPassword = (dob: string) => {
    const [year, month, day] = dob.split('-');
    return `${day}${month}${year}`;
  };

  // Add Student
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
          password: password,
          role: 'student',
          name: studentName,
          department: studentDepartment,
          year: parseInt(studentYear),
          dob: studentDob,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Student ${studentRollNo} created successfully`,
      });

      // Reset form
      setStudentName('');
      setStudentRollNo('');
      setStudentDepartment('');
      setStudentYear('1');
      setStudentDob('');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create student",
        variant: "destructive",
      });
    } finally {
      setStudentLoading(false);
    }
  };

  // Add Seating Manager
  const handleAddSeatingManager = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!seatingName || !seatingId || !seatingDob) {
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
          password: password,
          role: 'seating_manager',
          name: seatingName,
          dob: seatingDob,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Seating Manager ${seatingId} created successfully`,
      });

      // Reset form
      setSeatingName('');
      setSeatingId('');
      setSeatingDob('');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create seating manager",
        variant: "destructive",
      });
    } finally {
      setSeatingLoading(false);
    }
  };

  // Add Club Coordinator
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
          password: password,
          role: 'club_coordinator',
          name: clubName,
          club_name: clubClubName,
          dob: clubDob,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Club Coordinator ${clubId} created successfully`,
      });

      // Reset form
      setClubName('');
      setClubId('');
      setClubClubName('');
      setClubDob('');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create club coordinator",
        variant: "destructive",
      });
    } finally {
      setClubLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-muted-foreground">Add new users to the system</p>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students">Add Student</TabsTrigger>
          <TabsTrigger value="seating">Add Seating Manager</TabsTrigger>
          <TabsTrigger value="club">Add Club Coordinator</TabsTrigger>
        </TabsList>

        {/* Add Student Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
              <CardDescription>Register a new student in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-name">Full Name *</Label>
                    <Input
                      id="student-name"
                      type="text"
                      placeholder="Enter student name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                      data-testid="input-student-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-roll-no">Roll Number *</Label>
                    <Input
                      id="student-roll-no"
                      type="text"
                      placeholder="e.g., R101"
                      value={studentRollNo}
                      onChange={(e) => setStudentRollNo(e.target.value)}
                      required
                      data-testid="input-student-roll-no"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-department">Department *</Label>
                    <Input
                      id="student-department"
                      type="text"
                      placeholder="e.g., Computer Science"
                      value={studentDepartment}
                      onChange={(e) => setStudentDepartment(e.target.value)}
                      required
                      data-testid="input-student-department"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-year">Year *</Label>
                    <select
                      id="student-year"
                      value={studentYear}
                      onChange={(e) => setStudentYear(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      data-testid="select-student-year"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="student-dob">Date of Birth (Password will be DDMMYYYY) *</Label>
                    <Input
                      id="student-dob"
                      type="date"
                      value={studentDob}
                      onChange={(e) => setStudentDob(e.target.value)}
                      required
                      data-testid="input-student-dob"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={studentLoading}
                  className="w-full"
                  data-testid="button-add-student"
                >
                  {studentLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Student
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Seating Manager Tab */}
        <TabsContent value="seating">
          <Card>
            <CardHeader>
              <CardTitle>Add New Seating Manager</CardTitle>
              <CardDescription>Register a new seating manager in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSeatingManager} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seating-name">Full Name *</Label>
                    <Input
                      id="seating-name"
                      type="text"
                      placeholder="Enter name"
                      value={seatingName}
                      onChange={(e) => setSeatingName(e.target.value)}
                      required
                      data-testid="input-seating-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seating-id">Faculty ID *</Label>
                    <Input
                      id="seating-id"
                      type="text"
                      placeholder="e.g., FAC001"
                      value={seatingId}
                      onChange={(e) => setSeatingId(e.target.value)}
                      required
                      data-testid="input-seating-id"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="seating-dob">Date of Birth (Password will be DDMMYYYY) *</Label>
                    <Input
                      id="seating-dob"
                      type="date"
                      value={seatingDob}
                      onChange={(e) => setSeatingDob(e.target.value)}
                      required
                      data-testid="input-seating-dob"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={seatingLoading}
                  className="w-full"
                  data-testid="button-add-seating-manager"
                >
                  {seatingLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Seating Manager
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Club Coordinator Tab */}
        <TabsContent value="club">
          <Card>
            <CardHeader>
              <CardTitle>Add New Club Coordinator</CardTitle>
              <CardDescription>Register a new club coordinator in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddClubCoordinator} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="club-name">Full Name *</Label>
                    <Input
                      id="club-name"
                      type="text"
                      placeholder="Enter name"
                      value={clubName}
                      onChange={(e) => setClubName(e.target.value)}
                      required
                      data-testid="input-club-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="club-id">Student ID *</Label>
                    <Input
                      id="club-id"
                      type="text"
                      placeholder="e.g., SID001"
                      value={clubId}
                      onChange={(e) => setClubId(e.target.value)}
                      required
                      data-testid="input-club-id"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="club-club-name">Club Name *</Label>
                    <Input
                      id="club-club-name"
                      type="text"
                      placeholder="e.g., Tech Club"
                      value={clubClubName}
                      onChange={(e) => setClubClubName(e.target.value)}
                      required
                      data-testid="input-club-club-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="club-dob">Date of Birth (Password will be DDMMYYYY) *</Label>
                    <Input
                      id="club-dob"
                      type="date"
                      value={clubDob}
                      onChange={(e) => setClubDob(e.target.value)}
                      required
                      data-testid="input-club-dob"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={clubLoading}
                  className="w-full"
                  data-testid="button-add-club-coordinator"
                >
                  {clubLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add Club Coordinator
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Armchair, Download, Shuffle, Map } from 'lucide-react';

const GRID_SIZE = 8;

export default function SeatingDashboard() {
  const [allocated, setAllocated] = useState(false);

  // Generate a mock grid of seats
  // 0: Empty, 1: Student A (Dept CS), 2: Student B (Dept ME) - ensure no adjacent same colors
  const generateSeating = () => {
    setAllocated(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Seating Allocation</h1>
          <p className="text-muted-foreground">Manage exam halls and optimize student placement.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
          <Button onClick={generateSeating} disabled={allocated} className={allocated ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
            {allocated ? <span className="flex items-center"><Map className="w-4 h-4 mr-2"/> Allocated</span> : <span className="flex items-center"><Shuffle className="w-4 h-4 mr-2"/> Auto-Allocate</span>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Input parameters for allocation logic.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Examination Hall</Label>
                <Select defaultValue="main-hall">
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-hall">Main Hall (Capacity: 300)</SelectItem>
                    <SelectItem value="lab-1">Computer Lab 1 (Capacity: 60)</SelectItem>
                    <SelectItem value="room-204">Room 204 (Capacity: 40)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Students</Label>
                  <Input type="number" defaultValue="64" />
                </div>
                <div className="space-y-2">
                  <Label>Benches per Row</Label>
                  <Input type="number" defaultValue="8" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Departments (to separate)</Label>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs border border-blue-500/30">CS (Computer Science)</span>
                  <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-400 text-xs border border-orange-500/30">ME (Mechanical)</span>
                  <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs border border-purple-500/30">EE (Electrical)</span>
                </div>
              </div>
            </CardContent>
          </Card>

           <Card className="glass-card">
            <CardHeader>
              <CardTitle>Student List</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="relative mb-4">
                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search student..." className="pl-8" />
               </div>
               <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                 {[...Array(10)].map((_, i) => (
                   <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5 text-sm">
                     <span>Student {100 + i}</span>
                     <span className="text-xs text-muted-foreground">CS-YEAR-3</span>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle>Room Layout Visualizer</CardTitle>
              <CardDescription>
                {allocated ? "Allocation complete. Mixing factor: 100%" : "Waiting for allocation..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full aspect-square md:aspect-video bg-black/40 rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/10 px-4 py-1 rounded-b text-xs uppercase tracking-widest text-muted-foreground">Instructor Podium</div>
                
                <div className="grid grid-cols-8 gap-2 md:gap-4 mt-8">
                  {[...Array(64)].map((_, i) => {
                    // Simple mock logic for visualization
                    let status = 'empty';
                    if (allocated) {
                      // Checkerboard pattern simulation for departments
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      status = (row + col) % 2 === 0 ? 'dept1' : 'dept2';
                    }

                    return (
                      <div 
                        key={i} 
                        className={`
                          w-6 h-6 md:w-10 md:h-10 rounded-md flex items-center justify-center text-[8px] md:text-[10px] font-mono transition-all duration-500
                          ${status === 'empty' ? 'bg-white/5 border border-white/10' : ''}
                          ${status === 'dept1' ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-100' : ''}
                          ${status === 'dept2' ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.5)] scale-100' : ''}
                        `}
                      >
                         {allocated ? i + 1 : <Armchair className="w-3 h-3 md:w-4 md:h-4 opacity-20" />}
                      </div>
                    );
                  })}
                </div>

                {allocated && (
                  <div className="absolute bottom-4 right-4 flex gap-4 text-xs bg-black/80 p-2 rounded border border-white/10">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded"></div> CS Dept</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded"></div> ME Dept</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

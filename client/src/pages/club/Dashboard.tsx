import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar as CalendarIcon, Clock, MapPin, AlertCircle, Check, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useToast } from '@/hooks/use-toast';

// Mock Data
const initialEvents = [
  { id: '1', title: 'Robotics Workshop', date: new Date(2025, 11, 20), status: 'approved', dept: 'Engineering' },
  { id: '2', title: 'Annual Drama Fest', date: new Date(2025, 11, 22), status: 'pending', dept: 'Arts' },
  { id: '3', title: 'Debate Championship', date: new Date(2025, 11, 25), status: 'rejected', dept: 'Humanities' },
  { id: '4', title: 'AI Symposium', date: new Date(2025, 11, 28), status: 'pending', dept: 'CS' },
];

export default function ClubDashboard() {
  const [events, setEvents] = useState(initialEvents);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [conflict, setConflict] = useState(false);
  const { toast } = useToast();

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    // Fake conflict check logic
    if (newDate && (newDate.getDate() === 15 || newDate.getDate() === 22)) {
       setConflict(true);
       toast({
         title: "Conflict Detected",
         description: "This date clashes with an existing exam.",
         variant: "destructive",
       });
    } else {
       setConflict(false);
    }
  };

  const addEvent = () => {
     if (date) {
       setEvents([...events, { id: Date.now().toString(), title: "New Event", date: date, status: 'pending', dept: 'Club' }]);
       toast({
         title: "Event Submitted",
         description: "New event proposal added to pending list.",
       });
     }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const sourceItems = events.filter(e => e.status === sourceStatus);
    const destItems = events.filter(e => e.status === destStatus);
    const otherItems = events.filter(e => e.status !== sourceStatus && e.status !== destStatus);

    const [removed] = sourceItems.splice(source.index, 1);
    
    // Create new event object with updated status
    const movedEvent = { ...removed, status: destStatus };

    // Insert into destination
    if (sourceStatus === destStatus) {
       sourceItems.splice(destination.index, 0, movedEvent);
       setEvents([...otherItems, ...sourceItems]);
    } else {
       destItems.splice(destination.index, 0, movedEvent);
       setEvents([...otherItems, ...sourceItems, ...destItems]);
       
       toast({
         title: "Status Updated",
         description: `Event moved to ${destStatus}.`,
         className: destStatus === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : ''
       });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Club Events</h1>
          <p className="text-muted-foreground">Coordinate and approve campus activities.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="btn-new-event"><Plus className="w-4 h-4" /> New Event Request</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Submit Event Proposal</DialogTitle>
              <DialogDescription>
                Check for conflicts before submitting.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Event Name
                </Label>
                <Input id="name" defaultValue="Tech Talk" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Date</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* CONFLICT CHECKER UI */}
              <div className="col-span-4">
                {conflict ? (
                  <div className="rounded-md bg-red-500/10 p-3 border border-red-500/20 flex items-start gap-3 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-500">Conflict Detected!</p>
                      <p className="text-xs text-red-400">An exam is scheduled for this date in the Main Hall.</p>
                    </div>
                  </div>
                ) : date ? (
                   <div className="rounded-md bg-emerald-500/10 p-3 border border-emerald-500/20 flex items-start gap-3 animate-in slide-in-from-top-2">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-emerald-500">Date Available</p>
                      <p className="text-xs text-emerald-400">No conflicts found in the master schedule.</p>
                    </div>
                  </div>
                ) : null}
              </div>

            </div>
            <DialogFooter>
              <Button type="submit" disabled={conflict} onClick={addEvent}>Submit Proposal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          
          {['pending', 'approved', 'rejected'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided, snapshot) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col h-full bg-white/5 rounded-xl border transition-colors overflow-hidden
                    ${snapshot.isDraggingOver ? 'border-primary/50 bg-white/10' : 'border-white/5'}
                  `}
                >
                  <div className={`p-4 border-b border-white/5 font-medium uppercase text-xs tracking-wider flex justify-between items-center
                    ${status === 'pending' ? 'text-orange-400 bg-orange-500/5' : ''}
                    ${status === 'approved' ? 'text-emerald-400 bg-emerald-500/5' : ''}
                    ${status === 'rejected' ? 'text-red-400 bg-red-500/5' : ''}
                  `}>
                    {status}
                    <Badge variant="outline" className="bg-transparent border-white/10 text-inherit">
                      {events.filter(e => e.status === status).length}
                    </Badge>
                  </div>
                  
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[100px]">
                    {events.filter(e => e.status === status).map((event, index) => (
                      <Draggable key={event.id} draggableId={event.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...provided.draggableProps.style }}
                            data-testid={`event-card-${event.id}`}
                          >
                            <Card className={cn(
                              "bg-card hover:bg-card/80 transition-colors border-border/50 cursor-grab active:cursor-grabbing group",
                              snapshot.isDragging && "shadow-2xl scale-105 border-primary ring-1 ring-primary"
                            )}>
                              <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{event.title}</h4>
                                  <Badge variant="secondary" className="text-[10px] h-5">{event.dept}</Badge>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <CalendarIcon className="w-3 h-3 mr-2" />
                                    {format(event.date, "MMM dd, yyyy")}
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3 mr-2" />
                                    10:00 AM - 4:00 PM
                                  </div>
                                   <div className="flex items-center text-xs text-muted-foreground">
                                    <MapPin className="w-3 h-3 mr-2" />
                                    Main Auditorium
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}

        </div>
      </DragDropContext>
    </div>
  );
}

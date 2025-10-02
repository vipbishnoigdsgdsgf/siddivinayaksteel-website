
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MeetingForm } from "../forms/MeetingForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "../../../lib/supabase";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  spots: number;
  description?: string;
}

// MeetingFormData has a Date object for the date field
interface MeetingFormData {
  title: string;
  date: Date;
  time: string;
  location: string;
  address?: string;
  spots: number;
  description?: string;
}

export function MeetingsTab({ meetings }: { meetings: Meeting[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateMeeting = async (data: MeetingFormData) => {
    try {
      setIsSubmitting(true);
      // Convert Date to string format for database storage
      const formattedData = {
        ...data,
        date: data.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      };
      
      const { error } = await supabase.from("meetings").insert([formattedData]);
      
      if (error) throw error;
      
      // Refresh the meetings list by reloading the page
      window.location.reload();
      
      toast.success("Meeting created successfully!");
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create meeting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMeeting = async (data: MeetingFormData) => {
    if (!selectedMeeting) return;
    
    try {
      setIsSubmitting(true);
      // Convert Date to string format for database storage
      const formattedData = {
        ...data,
        date: data.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      };
      
      const { error } = await supabase
        .from("meetings")
        .update(formattedData)
        .eq("id", selectedMeeting.id);
      
      if (error) throw error;
      
      // Refresh the meetings list
      window.location.reload();
      
      toast.success("Meeting updated successfully!");
    } catch (error) {
      console.error("Error updating meeting:", error);
      toast.error("Failed to update meeting");
    } finally {
      setIsSubmitting(false);
      setSelectedMeeting(null);
    }
  };

  const handleDeleteMeeting = async () => {
    if (!selectedMeeting) return;
    
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", selectedMeeting.id);
      
      if (error) throw error;
      
      // Refresh the meetings list
      window.location.reload();
      
      toast.success("Meeting deleted successfully!");
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast.error("Failed to delete meeting");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setSelectedMeeting(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Manage Meetings</h2>
        <Button 
          className="flex items-center bg-steel hover:bg-steel-dark"
          onClick={() => {
            setSelectedMeeting(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="h-5 w-5 mr-1" /> Add Meeting
        </Button>
      </div>

      <div className="bg-dark-200 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Spots</th>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-dark-200 divide-y divide-gray-800">
              {meetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{meeting.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{meeting.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{meeting.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{meeting.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{meeting.spots}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-700 text-gray-300"
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setIsFormOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              {meetings.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-sm text-center text-gray-400">
                    No meetings available. Click "Add Meeting" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MeetingForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedMeeting(null);
        }}
        onSubmit={selectedMeeting ? handleEditMeeting : handleCreateMeeting}
        initialData={selectedMeeting || undefined}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-dark-200 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the meeting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedMeeting(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMeeting}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

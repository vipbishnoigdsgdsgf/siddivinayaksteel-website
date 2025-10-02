
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock, X, Send } from "lucide-react";
import { toast } from "sonner";
import { safeSelect, safeUpdate } from "@/utils/supabaseUtils";
import { supabase } from "../../../lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface MeetingRegistration {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  message: string | null;
  status: string;
  created_at: string;
  meeting_id: string | null;
  project_id: string | null;
  meetings?: {
    title: string;
    date: string;
    time: string;
  } | null;
  projects?: {
    title: string;
  } | null;
}

export function MeetingRegistrationsTab() {
  const [registrations, setRegistrations] = useState<MeetingRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<MeetingRegistration | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const query = safeSelect("meeting_registrations") as any;
      const { data, error } = await query
        .select(`
          *,
          meetings (title, date, time),
          projects (title)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setRegistrations(data || []);
    } catch (error: any) {
      console.error("Error fetching meeting registrations:", error.message);
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const updateQuery = safeUpdate("meeting_registrations", { status }) as any;
      const { error } = await updateQuery.eq("id", id);
      
      if (error) throw error;
      
      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((reg) =>
          reg.id === id ? { ...reg, status } : reg
        )
      );
      
      toast.success("Registration status updated");
      
      // Send notification to the user
      if (status === "approved" || status === "rejected") {
        const registration = registrations.find((reg) => reg.id === id);
        if (registration) {
          try {
            await safeSelect("admin_notifications") as any;
            // In a real app, you would send an email or notification to the user here
          } catch (notifyError) {
            console.error("Error sending notification:", notifyError);
          }
        }
      }
    } catch (error: any) {
      console.error("Error updating registration status:", error.message);
      toast.error("Failed to update status");
    }
  };

  const handleSendMessage = async () => {
    if (!selectedRegistration || !message.trim()) return;
    
    setIsSending(true);
    try {
      // In a real app, you would send an email to the user here
      // For now, we'll just create a notification in the database
      await supabase.from("admin_notifications").insert({
        type: 'meeting_message',
        message: `Message from admin regarding meeting: ${selectedRegistration.meetings?.title || 'Consultation'}`,
        details: JSON.stringify({
          registration_id: selectedRegistration.id,
          name: selectedRegistration.name,
          email: selectedRegistration.email,
          message: message
        }),
        recipient_emails: [selectedRegistration.email],
        read: false
      });
      
      toast.success("Message sent successfully");
      setIsMessageDialogOpen(false);
      setMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error.message);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">Approved</span>;
      case "rejected":
        return <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-full text-xs">Rejected</span>;
      case "pending":
      default:
        return <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Clock className="h-8 w-8 animate-spin text-steel mr-2" />
        <span className="text-gray-400">Loading registrations...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Meeting Registrations</h2>
        <Button
          variant="outline"
          className="border-gray-700 text-gray-300"
          onClick={() => fetchRegistrations()}
        >
          Refresh
        </Button>
      </div>

      <div className="bg-dark-200 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Meeting/Project</th>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-dark-300 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-dark-200 divide-y divide-gray-800">
              {registrations.length > 0 ? (
                registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {registration.name}
                      {registration.company && <div className="text-xs text-gray-400">{registration.company}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div>{registration.email}</div>
                      <div>{registration.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {registration.meetings ? (
                        <div className="font-medium text-steel">{registration.meetings.title}</div>
                      ) : registration.projects ? (
                        <div>
                          <span className="text-gray-400">Project: </span>
                          <span className="font-medium text-steel">{registration.projects.title}</span>
                        </div>
                      ) : (
                        "General Consultation"
                      )}
                      {registration.message && (
                        <div className="mt-1 text-xs text-gray-500 max-w-xs truncate">
                          {registration.message}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(registration.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {getStatusBadge(registration.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 space-x-2">
                      {registration.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-700 hover:bg-green-800 text-white"
                            onClick={() => handleStatusChange(registration.id, "approved")}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(registration.id, "rejected")}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-700 text-gray-300"
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setIsMessageDialogOpen(true);
                        }}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-sm text-center text-gray-400">
                    No meeting registrations available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="bg-dark-200 border-gray-800">
          <DialogHeader>
            <DialogTitle>Send Message to {selectedRegistration?.name}</DialogTitle>
            <DialogDescription>
              This message will be sent to {selectedRegistration?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-dark-300 border-gray-700 text-white resize-none min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMessageDialogOpen(false)}
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage}
              className="bg-steel hover:bg-steel-dark"
              disabled={isSending || !message.trim()}
            >
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

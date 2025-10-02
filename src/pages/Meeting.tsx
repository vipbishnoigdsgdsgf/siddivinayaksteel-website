import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Loader } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "../lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface MeetingAttendee {
  id: string;
  name: string;
  image: string;
  registered: string;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  image?: string;
  spots: number;
}

export default function MeetingPage() {
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [attendees, setAttendees] = useState<MeetingAttendee[]>([]);
  const [remainingSpots, setRemainingSpots] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error("Meeting ID is required");
        }
        
        // Fetch meeting data from Supabase
        const { data: meetingData, error: meetingError } = await supabase
          .from("meetings")
          .select("*")
          .eq("id", id)
          .single();
        
        if (meetingError) throw meetingError;
        if (!meetingData) throw new Error("Meeting not found");
        
        setMeeting(meetingData);
        
        // Fetch attendees for this meeting
        const { data: registrationsData, error: registrationsError } = await supabase
          .from("meeting_registrations")
          .select("id, name, created_at")
          .eq("meeting_id", id)
          .eq("status", "approved");
        
        if (registrationsError) throw registrationsError;
        
        // Calculate remaining spots
        setRemainingSpots(meetingData.spots - (registrationsData?.length || 0));
        
        // Format attendees data
        const formattedAttendees = (registrationsData || []).map(reg => {
          return {
            id: reg.id,
            name: reg.name,
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${reg.name}`,
            registered: new Date(reg.created_at).toLocaleDateString()
          };
        });
        
        setAttendees(formattedAttendees);
      } catch (error: any) {
        console.error("Error fetching meeting:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load meeting details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeetingData();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100">
        <Navbar />
        <main className="pt-20">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader className="h-8 w-8 animate-spin text-steel mr-2" />
            <span className="text-gray-400">Loading meeting details...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-dark-100">
        <Navbar />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Meeting Not Found</h1>
            <p className="text-gray-400 mb-8">The meeting you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button className="bg-steel hover:bg-steel-dark text-white">
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Default image if not provided
  const meetingImage = meeting.image || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000";

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <div className="relative h-80 overflow-hidden">
          <img
            src={meetingImage}
            alt={meeting.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-100 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-8">
            <div className="max-w-7xl mx-auto">
              <div className="inline-block px-3 py-1 bg-steel text-white text-sm font-semibold rounded-md mb-4">
                Workshop
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{meeting.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-steel" />
                  <span>{meeting.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-steel" />
                  <span>{meeting.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-steel" />
                  <span>{meeting.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="bg-dark-200 rounded-lg p-6 border border-gray-800 mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">About This Event</h2>
                  <p className="text-gray-300 mb-6">
                    {meeting.description}
                  </p>
                  
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0">
                      <Avatar className="h-12 w-12 border-2 border-steel">
                        <img src="https://api.dicebear.com/7.x/initials/svg?seed=Organizer&backgroundColor=0eb7ea" alt="Organizer" />
                      </Avatar>
                    </div>
                    <div className="ml-4">
                      <p className="text-white font-medium">Organized by Sri Ganesh Steel</p>
                      <p className="text-gray-400 text-sm">Steel Fitting Experts</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-300">
                      <Users className="inline h-5 w-5 mr-2 text-steel" />
                      <span>{remainingSpots} spots remaining out of {meeting.spots}</span>
                    </div>
                    <Link to={`/register-meeting/${meeting.id}`}>
                      <Button className="bg-steel hover:bg-steel-dark text-white">
                        Register Now
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-dark-200 rounded-lg p-6 border border-gray-800">
                  <h2 className="text-2xl font-semibold text-white mb-4">Event Details</h2>
                  <div className="space-y-6">
                    <div className="border-l-2 border-steel pl-4 pb-8 last:pb-0 relative">
                      <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-steel" />
                      <h3 className="text-lg font-medium text-white mt-1">Event Information</h3>
                      <p className="text-gray-400 mt-1">
                        Join us for this special event where we'll showcase our steel and glass fitting solutions. 
                        Whether you're planning a new project or looking to renovate, this is the perfect opportunity 
                        to learn more about our services and meet our team.
                      </p>
                    </div>
                    
                    <div className="border-l-2 border-steel pl-4 pb-8 last:pb-0 relative">
                      <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-steel" />
                      <h3 className="text-lg font-medium text-white mt-1">What to Expect</h3>
                      <p className="text-gray-400 mt-1">
                        • Demonstrations of our latest products<br />
                        • One-on-one consultations with our experts<br />
                        • Special discounts for attendees<br />
                        • Refreshments will be provided
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <div className="bg-dark-200 rounded-lg p-6 border border-gray-800 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Event Location</h3>
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <iframe 
                      title="Event Location"
                      className="w-full h-48 rounded-md"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30431.66911855167!2d78.75736112473224!3d17.49114352412338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9c7ec139a61d%3A0x2f0a31d59ec92aba!2sMedipally%2C%20Hyderabad%2C%20Telangana%20500098!5e0!3m2!1sen!2sin!4v1719036632754!5m2!1sen!2sin" 
                      allowFullScreen={true} 
                      loading="lazy"
                    ></iframe>
                  </div>
                  <p className="text-white font-medium">{meeting.location}</p>
                  <p className="text-gray-400">{meeting.address}</p>
                  <Button variant="outline" className="w-full mt-4 border-steel text-steel hover:bg-steel hover:text-white">
                    Get Directions
                  </Button>
                </div>
                
                <div className="bg-dark-200 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Attendees ({attendees.length})
                  </h3>
                  {attendees.length > 0 ? (
                    <div className="space-y-4">
                      {attendees.map((attendee) => (
                        <div key={attendee.id} className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <img src={attendee.image} alt={attendee.name} />
                          </Avatar>
                          <div className="ml-3">
                            <p className="text-white text-sm font-medium">{attendee.name}</p>
                            <p className="text-gray-400 text-xs">Registered: {attendee.registered}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Be the first to register for this event!</p>
                  )}
                  {attendees.length > 5 && (
                    <Button variant="link" className="text-steel p-0 h-auto mt-2">
                      View all attendees
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

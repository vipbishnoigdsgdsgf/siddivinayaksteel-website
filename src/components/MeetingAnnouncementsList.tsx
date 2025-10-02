import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { safeSelect } from "@/utils/supabaseUtils";
interface Meeting {
  id: number | string;
  title: string;
  date: string;
  time: string;
  location: string;
  spots: number;
  image?: string;
  address?: string;
  description?: string;
}
export default function MeetingAnnouncementsList() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        // Fetch real meetings from the database, ordered by date
        const {
          data,
          error
        } = await safeSelect("meetings").select("*").order('meeting_date', {
          ascending: true
        }).limit(3); // Show only upcoming 3 meetings

        if (error) {
          console.error("Error fetching meetings:", error);
          setMeetings([]);
        } else if (data && data.length) {
          // Use real meeting data from the database
          setMeetings(data as Meeting[]);
        } else {
          // If no meetings in database, create a default consultation meeting
          setMeetings([{
            id: "default",
            title: "Steel & Glass Consultation",
            date: "Available on request",
            time: "Flexible timing",
            location: "Gajanan Steel Reling Glass Office",
            address: "Medipally Hyderabad, Subhash nagar Karimnagar",
            spots: 10,
            image: "/assets/steel-railing-1.jpg",
            description: "Schedule a consultation with our experts to discuss your steel and glass fitting requirements."
          }]);
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);
  if (loading) {
    return <div className="neumorphic-card flex justify-center items-center py-20">
        <Loader className="h-8 w-8 animate-spin text-steel mr-2" />
        <span className="text-steel">Loading meetings...</span>
      </div>;
  }
  return <div className="neumorphic-card">
      <h3 className="text-xl font-bold text-white mb-6">Upcoming Meetings & Events</h3>
      
      {meetings.length === 0 ? <div className="text-center py-8 bg-dark-300 rounded-xl">
          <h4 className="text-lg font-semibold text-steel mb-2">Schedule a Consultation</h4>
          <p className="text-gray-400 mb-4 px-4">Contact us to schedule a personalized consultation for your steel and glass fitting needs.</p>
          <Link to="/contact">
            <Button variant="steel" className="shadow-neumorphic hover:shadow-neumorphic-inset">
              Request Consultation
            </Button>
          </Link>
        </div> : <div className="space-y-6">
          {meetings.map(meeting => <div key={meeting.id} className="bg-dark-300 rounded-xl overflow-hidden shadow-neumorphic transition-all hover:shadow-neumorphic-inset">
              <div className="md:flex py-0 px-0 mx-0 my-0">
                
                <div className="p-6 md:w-2/3">
                  <h4 className="text-lg font-semibold text-steel mb-2">{meeting.title}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 text-steel" />
                      <span>{meeting.date}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Clock className="h-4 w-4 mr-2 text-steel" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MapPin className="h-4 w-4 mr-2 text-steel" />
                      <span>{meeting.location}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Users className="h-4 w-4 mr-2 text-steel" />
                      <span>{meeting.spots} spots available</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Link to={`/register-meeting/${meeting.id}`}>
                      <Button variant="steel" className="shadow-neumorphic hover:shadow-neumorphic-inset">
                        Register
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>)}
        </div>}
      
      <div className="mt-6 text-center">
        <Link to="/contact">
          <Button variant="link" className="text-steel hover:text-steel-light">
            Request Custom Consultation
          </Button>
        </Link>
      </div>
    </div>;
}
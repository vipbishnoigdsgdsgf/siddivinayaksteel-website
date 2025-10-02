
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, MapPin, Users, Loader } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { safeInsert } from "@/utils/supabaseUtils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  company: z.string().optional(),
  message: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

export default function RegisterMeetingPage() {
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [meeting, setMeeting] = useState<any>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setLoading(true);
        
        // Fetch the real meeting from the database
        const { data, error } = await supabase
          .from('meetings')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setMeeting(data);
        } else {
          // If no meeting found with that ID, check if it's a project ID and handle accordingly
          const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
            
          if (projectError) throw projectError;
          
          if (projectData) {
            // Create a temporary meeting object based on project
            setMeeting({
              id: "new",
              title: `Consultation for ${projectData.title}`,
              date: "To be scheduled",
              time: "To be scheduled",
              location: "Gajanan Steel Reling Glass Office",
              address: "Medipally Hyderabad, Subhash nagar Karimnagar",
              spots: 1,
              project_id: projectData.id,
              image: projectData.images?.[0] || "/assets/steel-railing-1.jpg"
            });
          } else {
            throw new Error("Meeting or project not found");
          }
        }
      } catch (error) {
        console.error('Error fetching meeting:', error);
        toast({
          title: "Error",
          description: "Failed to load meeting details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeeting();
  }, [id, toast]);
  
  // Pre-fill form with user data if available
  useEffect(() => {
    if (user && form) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            form.setValue('name', data.full_name || '');
            form.setValue('email', user.email || '');
            form.setValue('phone', data.phone || '');
          }
        });
    }
  }, [user]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      agreeTerms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Create a meeting registration entry in the database
      const registrationData = {
        meeting_id: meeting.id === "new" ? null : meeting.id,
        project_id: meeting.project_id || id,
        user_id: user?.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company || null,
        message: values.message || null,
        status: 'pending'
      };
      
      const { error: registrationError } = await safeInsert("meeting_registrations", registrationData);
      
      if (registrationError) throw registrationError;
      
      // Send notification email to admins
      try {
        const notificationData = {
          type: 'meeting_request',
          message: `New meeting request from ${values.name} (${values.email}) for ${meeting.title}`,
          details: JSON.stringify({
            name: values.name,
            email: values.email,
            phone: values.phone,
            meeting: meeting.title,
            message: values.message
          }),
          recipient_emails: ['omprkashbishnoi2000@gmail.com', 'vipbishnoi47@gmail.com', 'ramubishnoi47@gmail.com'],
          read: false
        };
        
        const { error: notificationError } = await safeInsert("admin_notifications", notificationData);
        
        if (notificationError) {
          console.error('Failed to create notification:', notificationError);
        }
      } catch (notifyError) {
        console.error('Error creating notification:', notifyError);
        // Continue with success flow even if notification fails
      }
      
      toast({
        title: "Registration successful!",
        description: `You have successfully registered for a consultation. We'll contact you soon.`,
      });
      
      // Navigate to home page
      navigate(`/`);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "There was a problem with your registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100">
        <Navbar />
        <main className="pt-20">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader className="h-8 w-8 animate-spin text-steel mr-2" />
            <span className="text-gray-400">Loading registration form...</span>
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
            <p className="text-gray-400 mb-8">The meeting you're trying to register for doesn't exist or has been canceled.</p>
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

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-white mb-4">
                    Register for <span className="text-steel">{meeting.title}</span>
                  </h1>
                  <p className="text-gray-400">
                    Fill out the form below to schedule a consultation. 
                    Our team will contact you to confirm the details.
                  </p>
                </div>
                
                <div className="bg-dark-200 rounded-lg p-8 border border-gray-800">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                {...field} 
                                className="bg-dark-300 border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Enter your email" 
                                  {...field} 
                                  className="bg-dark-300 border-gray-700 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Phone Number</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel" 
                                  placeholder="Enter your phone number" 
                                  {...field} 
                                  className="bg-dark-300 border-gray-700 text-white"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Company/Organization (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your company or organization name" 
                                {...field} 
                                className="bg-dark-300 border-gray-700 text-white"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Your Requirements</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about your project requirements or any specific questions you have" 
                                {...field} 
                                className="bg-dark-300 border-gray-700 text-white resize-none min-h-[100px]"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="agreeTerms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-dark-300">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm text-white">
                                I agree to the terms and conditions and privacy policy
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-steel hover:bg-steel-dark" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting Request..." : "Request Consultation"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <div className="bg-dark-200 rounded-lg overflow-hidden border border-gray-800 sticky top-24">
                  <img 
                    src={meeting.image || "/assets/steel-railing-1.jpg"} 
                    alt={meeting.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">{meeting.title}</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="h-4 w-4 mr-2 text-steel" />
                        <span>{meeting.date}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-steel" />
                        <span>{meeting.time}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-steel" />
                        <span>{meeting.location || "Gajanan Steel Reling Glass Office"}</span>
                      </div>
                      {meeting.address && (
                        <div className="flex items-start text-gray-300 ml-6">
                          <span className="text-sm">{meeting.address}</span>
                        </div>
                      )}
                      {meeting.spots && (
                        <div className="flex items-center text-gray-300">
                          <Users className="h-4 w-4 mr-2 text-steel" />
                          <span>{meeting.spots} spot{meeting.spots > 1 ? 's' : ''} available</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 bg-dark-300 rounded-md text-center">
                      <p className="text-sm text-gray-300">
                        After submitting your request, we will contact you to confirm the details of your consultation.
                      </p>
                    </div>
                  </div>
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

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import Map from "@/components/Map";
import { trackPageVisit } from "@/utils/analyticsUtils";
export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  // Track page visit on component mount
  useEffect(() => {
    trackPageVisit('/contact');
  }, []);
  
  // Error recovery
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Contact page error:', event.error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  // If there's a critical error, show a fallback UI
  if (hasError) {
    return (
      <div className="min-h-screen bg-dark-100">
        <Navbar />
        <main className="pt-20">
          <section className="py-16 bg-dark-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Contact Us</h1>
              <p className="text-gray-400 mb-8">
                We're experiencing technical difficulties with our contact form. Please reach out to us directly:
              </p>
              
              <div className="space-y-6 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-4 p-4 bg-dark-300 rounded-lg">
                  <Phone className="h-6 w-6 text-steel" />
                  <div>
                    <p className="text-white font-semibold">+91 8080482079</p>
                    <p className="text-white font-semibold">+91 9326698359</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-4 p-4 bg-dark-300 rounded-lg">
                  <Mail className="h-6 w-6 text-steel" />
                  <p className="text-white font-semibold">info@siddivinayakasteel.shop</p>
                </div>
                
                <div className="flex items-start justify-center space-x-4 p-4 bg-dark-300 rounded-lg">
                  <MapPin className="h-6 w-6 text-steel mt-1" />
                  <p className="text-white text-sm">
                    Chengicherla X Road, Peerzadiguda<br />
                    Hyderabad, Telangana 500098, India
                  </p>
                </div>
                
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-steel hover:bg-steel-dark text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      id,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill out all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      // First try to store the contact message in the database
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
            created_at: new Date().toISOString(),
            status: 'new'
          }
        ])
        .select();
      
      if (error) {
        console.error('Database error:', error);
        // If database insert fails, show a user-friendly message with alternative contact info
        throw new Error('Database connection failed');
      }
      
      // Try to send email notification (optional)
      try {
        await supabase.functions.invoke('resend-email', {
          body: JSON.stringify(formData)
        });
        console.log('Email notification sent successfully');
      } catch (emailError) {
        console.warn('Email notification failed, but message was saved:', emailError);
        // Don't fail the whole operation if email fails
      }
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        <div className="space-y-2">
          <p>Unable to send message through the website.</p>
          <p className="text-sm">Please contact us directly:</p>
          <p className="text-sm font-semibold">📞 +91 8080482079</p>
          <p className="text-sm font-semibold">📧 info@siddivinayakasteel.shop</p>
        </div>
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-dark-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-6">
                Contact <span className="text-steel">Us</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Get in touch with us for your steel fitting needs. We're here to help bring your vision to life.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-steel mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Visit Us</h3>
                    <p className="text-gray-400">Chengicherla X Road, Peerzadiguda, Hyderabad, Telangana 500098, India</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-steel mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Call Us</h3>
                    <p className="text-gray-400">+91 8080482079</p>
                    <p className="text-gray-400">+91 9326698359</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-steel mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email Us</h3>
                    <p className="text-gray-400">info@siddivinayakasteel.shop</p>
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden h-64 mt-8">
                  <Map />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 bg-dark-300 p-6 rounded-lg border border-gray-800">
                <div>
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input id="name" type="text" required className="bg-dark-200 border-gray-700 mt-1" placeholder="Your name" value={formData.name} onChange={handleChange} />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input id="email" type="email" required className="bg-dark-200 border-gray-700 mt-1" placeholder="Your email" value={formData.email} onChange={handleChange} />
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-white">Message</Label>
                  <Textarea id="message" required className="bg-dark-200 border-gray-700 mt-1 h-32" placeholder="Your message" value={formData.message} onChange={handleChange} />
                </div>

                <Button type="submit" className="w-full bg-steel hover:bg-steel-dark text-white" disabled={isSubmitting}>
                  {isSubmitting ? <span className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending...
                    </span> : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
}
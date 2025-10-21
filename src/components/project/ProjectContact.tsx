import { User, Phone, Mail, MessageCircle, Calendar, Star, MapPin, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export function ProjectContact() {
  // YEH HOOK URL SE ID NIKALEGA.
  // AGAR URL mein '/gallery/ss-067' hai, to id = 'ss-067'
  // AGAR URL mein '/gallery/2167f07e-...' hai, to id = '2167f07e-...'
  const { id } = useParams();

  const handleWhatsAppContact = () => {
    // YEH AUTOMATICALLY SAHI URL BANA DEGA.
    // 'id' mein jo bhi value hogi (short_id ya uuid), wahi yahan use hogi.
    const projectUrl = `https://siddivinayakasteel.shop/gallery/${id}`;
    const projectUrl = `https://siddivinayakasteel.shop/gallery/${short_id}`;
    
    const message = `🏗️ *Project Inquiry*\n\nI'm interested in this project: ${projectUrl}\n\nCan you please provide me with:\n✨ Similar design quote\n⏱️ Timeline estimation\n📋 Required materials\n🔧 Installation process\n\nLooking forward to your response!`;
    
    const phoneNumber = "919326698359";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCallNow = () => {
    window.open("tel:+919326698359", "_self");
  };

  const handleEmailContact = () => {
    window.open("mailto:info@siddivinayakasteel.shop?subject=Project Inquiry&body=I'm interested in your steel and glass fitting services.", "_self");
  };

  return (
    <div className="space-y-6">
      {/* Main Contact Card */}
      <Card className="bg-gradient-to-br from-dark-200 to-dark-300 border-gray-800 overflow-hidden sticky top-24">
        <div className="bg-steel/10 p-4 border-b border-steel/20">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-steel rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Get Your Quote</h3>
              <p className="text-steel text-sm font-medium">Professional Steel & Glass Fitting</p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <p className="text-gray-300 mb-6 text-sm leading-relaxed">
            🎯 Interested in similar design? Contact our expert team for personalized quote and consultation.
          </p>
          
          {/* Contact Info */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start space-x-3 group">
              <div className="h-10 w-10 rounded-xl bg-steel/20 flex items-center justify-center group-hover:bg-steel/30 transition-colors">
                <User className="h-5 w-5 text-steel" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Project Manager</p>
                <p className="text-white font-medium">Siddhi Vinayak Steel Team</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 group cursor-pointer" onClick={handleCallNow}>
              <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <Phone className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Call Now</p>
                <p className="text-white font-medium hover:text-green-400 transition-colors">+91 9326698359</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 group cursor-pointer" onClick={handleEmailContact}>
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email Us</p>
                <p className="text-white font-medium hover:text-blue-400 transition-colors break-all text-sm">info@siddivinayakasteel.shop</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 group">
              <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                <MapPin className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                <p className="text-white font-medium text-sm">Hyderabad, Telangana</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleWhatsAppContact}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg hover:shadow-green-500/25"
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp Quote</span>
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleCallNow}
                variant="outline" 
                className="border-steel/50 text-steel hover:bg-steel/10 font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span className="text-sm">Call</span>
              </Button>
              <Button 
                onClick={handleEmailContact}
                variant="outline" 
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span className="text-sm">Email</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Info Card */}
      <Card className="bg-dark-200 border-gray-800">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-steel mr-1" />
              </div>
              <p className="text-xs text-gray-400">Response Time</p>
              <p className="text-white font-medium text-sm">Within 2 Hours</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
              </div>
              <p className="text-xs text-gray-400">Rating</p>
              <p className="text-white font-medium text-sm">4.9/5 ⭐</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

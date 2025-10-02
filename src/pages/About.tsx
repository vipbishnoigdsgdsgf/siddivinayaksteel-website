import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, Users, Award, Clock, Phone, Mail, MapPin, Wrench } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trackPageVisit } from "@/utils/analyticsUtils";
export default function About() {
  // Track page visit on component mount
  useEffect(() => {
    trackPageVisit('/about');
  }, []);

  return <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-dark-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-6">
                About <span className="text-steel">Siddhi Vinayaka Steel</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">With over 5 years of experience, Siddhi Vinayaka Steel has been a trusted name in premium steel fitting solutions for homes, hotels, and commercial spaces across India.</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-dark-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                <p className="text-gray-400 mb-4">
                  Founded in Hyderabad, Siddhi Vinayaka Steel began as a small workshop and has grown into a leading steel fitting service provider, serving clients across multiple cities.
                </p>
                <p className="text-gray-400">
                  Our commitment to quality, innovative designs, and customer satisfaction has made us the preferred choice for both residential and commercial projects.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-dark-200 p-6 rounded-lg border border-gray-800">
                  <Users className="h-8 w-8 text-steel mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Expert Team</h3>
                  <p className="text-gray-400">Skilled craftsmen with years of experience</p>
                </div>
                <div className="bg-dark-200 p-6 rounded-lg border border-gray-800">
                  <Building2 className="h-8 w-8 text-steel mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Projects</h3>
                  <p className="text-gray-400">750+ successful installations</p>
                </div>
                <div className="bg-dark-200 p-6 rounded-lg border border-gray-800">
                  <Award className="h-8 w-8 text-steel mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Quality</h3>
                  <p className="text-gray-400">Premium materials and finishes</p>
                </div>
                <div className="bg-dark-200 p-6 rounded-lg border border-gray-800">
                  <Clock className="h-8 w-8 text-steel mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Experience</h3>
                  <p className="text-gray-400">5+ years in the industry</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-dark-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Meet Our <span className="text-steel">Owners</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                The vision and expertise behind Siddhi Vinayaka Steel
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              {/* First Owner - Omprakash Bishnoi */}
              <div className="flex flex-col items-center text-center bg-dark-100 p-8 rounded-lg border border-gray-800">
                <div className="flex-shrink-0 mb-6">
                  <div className="relative">
                    <Avatar className="h-48 w-48 border-4 border-steel shadow-[0_0_25px_rgba(14,183,234,0.3)]">
                      <AvatarImage alt="Omprakash Bishnoi" className="object-cover" src="https://siddivinayakasteel.shop/assets/op bhai.jpg" />
                      <AvatarFallback className="bg-steel text-white text-3xl">OP</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-steel text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg">
                      Co-Founder
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Omprakash Bishnoi</h3>
                  <p className="text-steel font-medium mb-4">Master Steel Craftsman with 5+ Years Experience</p>
                  
                  <p className="text-gray-300 mb-6">With extensive expertise in steel craftsmanship and design, Omprakash Bishnoi brings innovative solutions and precision to every project. His dedication to quality and customer satisfaction has been instrumental in establishing our reputation.</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="bg-dark-200 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-steel" />
                      </div>
                      <span className="text-gray-300">+91 9326698359</span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2">
                      <div className="bg-dark-200 p-2 rounded-full">
                        <svg className="h-5 w-5 text-steel" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <a href="https://www.instagram.com/seteybishnoi/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-steel transition-colors">@seteybishnoi</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Owner - Mangilal Bishnoi */}
              <div className="flex flex-col items-center text-center bg-dark-100 p-8 rounded-lg border border-gray-800">
                <div className="flex-shrink-0 mb-6">
                  <div className="relative">
                    <Avatar className="h-48 w-48 border-4 border-steel shadow-[0_0_25px_rgba(14,183,234,0.3)]">
                      <AvatarImage alt="Mangilal Bishnoi" className="object-cover" src="https://siddivinayakasteel.shop/assets/mangilaal.jpg" />
                      <AvatarFallback className="bg-steel text-white text-3xl">MB</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-steel text-white text-sm font-medium px-3 py-1 rounded-full shadow-lg">
                      Co-Founder
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Mangilal Bishnoi</h3>
                  <p className="text-steel font-medium mb-4">Master Steel Craftsman with 5+ Years Experience</p>
                  
                  <p className="text-gray-300 mb-6">A skilled craftsman with a keen eye for detail and innovation, Mangilal Bishnoi co-founded Siddhi Vinayaka Steel with a vision to deliver exceptional steel fitting solutions. His technical expertise and commitment to excellence drive our success.</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="bg-dark-200 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-steel" />
                      </div>
                      <span className="text-gray-300">+91 8080482079</span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2">
                      <div className="bg-dark-200 p-2 rounded-full">
                        <svg className="h-5 w-5 text-steel" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                        </svg>
                      </div>
                      <a href="https://www.instagram.com/mangilal___29" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-steel transition-colors">@mangilal___29</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
}

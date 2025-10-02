import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
export default function Footer() {
  return <>
    <WhatsAppButton phoneNumber="+919326698359" />
    <footer className="bg-dark-200 text-gray-400">
      <div className="max-w-7xl mx-auto pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-5">
              <span className="text-2xl font-bold text-steel">Siddhi Vinayaka</span>
              <span className="ml-1 text-2xl font-bold text-white">Steel</span>
            </div>
            <p className="mb-4">
              Premium steel and glass fitting solutions with innovative designs and exceptional craftsmanship. Serving residential, commercial, and industrial projects across India.
            </p>
            <div className="flex space-x-4 mx-0 my-0 px-0 py-[9px]">
              <a href="https://www.instagram.com/seteybishnoi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-steel transition-colors">
                  <Instagram size={20} />
                </a>
            </div>
            <div className="flex space-x-4 mx-0 my-0 px-0 py-[9px]">
              <a href="https://www.instagram.com/mangilal___29" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-steel transition-colors">
                  <Instagram size={20} />
                </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-steel transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-steel transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-steel transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-steel transition-colors">gallery</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-steel transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-steel transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-steel transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services#residential" className="hover:text-steel transition-colors">Residential Steel Works</Link>
              </li>
              <li>
                <Link to="/services#commercial" className="hover:text-steel transition-colors">Commercial Projects</Link>
              </li>
              <li>
                <Link to="/services#custom" className="hover:text-steel transition-colors">Custom Designs</Link>
              </li>
              <li>
                <Link to="/services#maintenance" className="hover:text-steel transition-colors">Maintenance & Repairs</Link>
              </li>
              <li>
                <Link to="/services#glass" className="hover:text-steel transition-colors">Glass Fitting Solutions</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Contact Info</h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-steel flex-shrink-0 mt-1" />
                  <span>Chengicherla X Road, Peerzadiguda, Hyderabad, Telangana 500098, India</span>
                </li>
                <li className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-steel flex-shrink-0" />
                  <a href="tel:+918080482079" className="hover:text-white transition-colors">
                    +91 8080482079
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-steel flex-shrink-0" />
                  <a href="tel:+919326698359" className="hover:text-white transition-colors">
                    +91 9326698359
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-steel flex-shrink-0" />
                  <a href="mailto:info@siddivinayakasteel.shop" className="hover:text-white transition-colors">
                    info@siddivinayakasteel.shop
                  </a>
                </li>
              </ul>
          </div>
        </div>

        {/* Footer bottom section with designer credit */}
        <div className="mt-12 pt-6 border-t border-dark-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Siddhi Vinayaka Steel. All rights reserved.
            </p>
            
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-sm mr-2">Made with ❤️ by</span>
              <Link to="/about-developer" className="text-steel hover:text-steel-light transition-all relative group">
                <span className="font-medium relative">
                  <span className="relative z-10 px-1">VIP Bishnoi</span>
                  <span className="absolute inset-0 bg-steel/10 rounded transform scale-110 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-steel/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  <span className="absolute -inset-0.5 rounded-md blur opacity-0 group-hover:opacity-30 bg-steel transition-opacity duration-300"></span>
                </span>
              </Link>
            </div>
            
            <div className="mt-4 md:mt-0 text-xs flex justify-center space-x-4">
              <Link to="/cookie-policy" className="hover:text-steel transition-colors">Cookie Policy</Link>
              <Link to="/privacy-policy" className="hover:text-steel transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-steel transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </>;
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative bg-dark-100 overflow-hidden pt-24">
      {/* Steel pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-steel/10 via-transparent to-steel/5"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="steel-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FF6B35" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#steel-grid)"/>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-dark-100 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="sm:text-center lg:text-left pt-16">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block glow-text">Excellence in Steel</span>{" "}
                <span className="block text-steel glow-text">Craftsmanship</span>
                <span className="block text-steel glow-text">for Modern Spaces</span>
              </h1>
              <p className="mt-3 text-base text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Siddhi Vinayaka Steel delivers premium steel fitting solutions with cutting-edge designs and superior craftsmanship for residential, commercial, and industrial projects.
              </p>
              <div className="mt-8 sm:mt-12 sm:flex sm:justify-center lg:justify-start gap-4">
                <Link to="/gallery">
                  <Button variant="steel" size="lg" className="w-full h-12 sm:w-auto flex items-center rounded-xl bg-gradient-to-r from-steel to-steel-light hover:from-steel-dark hover:to-steel transform hover:scale-105 transition-all duration-300">
                    Explore Our Portfolio
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="mt-3 sm:mt-0 w-full h-12 sm:w-auto flex items-center rounded-xl">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-full w-full bg-cover bg-center relative" style={{ 
          backgroundImage: "url('/assets/IMG-20250511-WA0026.jpg')",
        }}>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-dark-100/20 to-dark-100/80"></div>
          <div className="absolute bottom-6 right-6 bg-dark-100/80 backdrop-blur-sm px-4 py-2 rounded-lg">
            <p className="text-steel font-semibold text-sm">Premium Glass & Steel Solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

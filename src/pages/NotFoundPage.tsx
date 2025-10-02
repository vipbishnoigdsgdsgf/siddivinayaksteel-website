

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-100 relative overflow-hidden">
      {/* Steel design background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[600px] h-[600px] -top-40 -left-40 bg-steel/5 rounded-full blur-3xl"></div>
        <div className="absolute w-[600px] h-[600px] -bottom-40 -right-40 bg-steel/5 rounded-full blur-3xl"></div>
        
        {/* Steel bars - diagonal */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-0 w-1 h-[200%] bg-gradient-to-b from-transparent via-steel/20 to-transparent rotate-45 transform origin-top-left"></div>
          <div className="absolute top-0 right-0 w-1 h-[200%] bg-gradient-to-b from-transparent via-steel/20 to-transparent -rotate-45 transform origin-top-right"></div>
          <div className="absolute bottom-0 left-0 w-1 h-[200%] bg-gradient-to-t from-transparent via-steel/20 to-transparent -rotate-45 transform origin-bottom-left"></div>
          <div className="absolute bottom-0 right-0 w-1 h-[200%] bg-gradient-to-t from-transparent via-steel/20 to-transparent rotate-45 transform origin-bottom-right"></div>
        </div>
        
        {/* Glass effect borders */}
        <div className="absolute inset-x-12 top-10 h-1 bg-gradient-to-r from-transparent via-steel/40 to-transparent"></div>
        <div className="absolute inset-x-12 bottom-10 h-1 bg-gradient-to-r from-transparent via-steel/40 to-transparent"></div>
        <div className="absolute inset-y-12 left-10 w-1 bg-gradient-to-b from-transparent via-steel/40 to-transparent"></div>
        <div className="absolute inset-y-12 right-10 w-1 bg-gradient-to-b from-transparent via-steel/40 to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-center p-8 backdrop-blur-sm bg-dark-200/50 border border-gray-700 rounded-xl shadow-2xl max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-steel/20 animate-ping rounded-full"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-dark-300 rounded-full border border-steel">
              <span className="text-4xl font-bold text-steel">404</span>
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        
        <div className="h-1 w-20 bg-steel mx-auto my-6"></div>
        
        <p className="text-xl text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="mb-8">
          <p className="text-gray-500">
            Siddi Vinayaka Steel specializes in premium steel and glass fitting solutions for both residential and commercial spaces. 
            Our expert craftsmen can help with your custom steel design needs.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            className="bg-steel hover:bg-steel-dark text-white"
          >
            <Link to="/">Return to Home</Link>
          </Button>
          
          <Button 
            asChild
            variant="outline" 
            className="border-steel text-steel hover:bg-steel/10"
          >
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

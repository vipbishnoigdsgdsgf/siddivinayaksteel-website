
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import SpecificFeaturedProjects from "@/components/SpecificFeaturedProjects";
import StatsCounter from "@/components/StatsCounter";
import Testimonials from "@/components/Testimonials";
import SubmitContentForm from "@/components/SubmitContentForm";
import MeetingAnnouncementsList from "@/components/MeetingAnnouncementsList";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import { useWebsiteReviews } from "@/hooks/useWebsiteReviews";
import { trackPageVisit } from "@/utils/analyticsUtils";

const Index = () => {
  const { reviews: websiteReviews, isLoading } = useWebsiteReviews();

  // Track page visit on component mount
  useEffect(() => {
    trackPageVisit('/');
  }, []);

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main>
        <Hero />
        <Services />
        
        {/* Featured Portfolio Section */}
        <section className="py-16 bg-dark-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Featured <span className="text-steel">Projects</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                Explore our latest steel and glass installations showcasing modern design and superior craftsmanship.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group relative overflow-hidden rounded-xl bg-dark-300 shadow-neumorphic hover:shadow-neumorphic-inset transition-all duration-300">
                <div className="aspect-w-16 aspect-h-9 bg-cover bg-center" style={{backgroundImage: "url('/assets/Glass Office Partition System.jpeg')", aspectRatio: '16/9'}}>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-100/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Glass Office Partitions</h3>
                  <p className="text-gray-400 text-sm mb-3">Modern glass partition systems for commercial spaces</p>
                  <div className="flex justify-between items-center">
                    <span className="text-steel font-semibold text-sm">Commercial</span>
                  </div>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-xl bg-dark-300 shadow-neumorphic hover:shadow-neumorphic-inset transition-all duration-300">
                <div className="aspect-w-16 aspect-h-9 bg-cover bg-center" style={{backgroundImage: "url('/assets/Custom Steel Gate Design.jpeg')", aspectRatio: '16/9'}}>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-100/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Custom Steel Gates</h3>
                  <p className="text-gray-400 text-sm mb-3">Artistic steel gate designs for residential properties</p>
                  <div className="flex justify-between items-center">
                    <span className="text-steel font-semibold text-sm">Residential</span>
                  </div>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-xl bg-dark-300 shadow-neumorphic hover:shadow-neumorphic-inset transition-all duration-300">
                <div className="aspect-w-16 aspect-h-9 bg-cover bg-center" style={{backgroundImage: "url('/assets/Glass Roof Skylight Project.jpeg')", aspectRatio: '16/9'}}>
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-100/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Glass Roof Systems</h3>
                  <p className="text-gray-400 text-sm mb-3">Premium skylight and glass roofing solutions</p>
                  <div className="flex justify-between items-center">
                    <span className="text-steel font-semibold text-sm">Architectural</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/gallery" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-steel hover:bg-steel-dark transition-all duration-300 transform hover:scale-105">
                View All Projects
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        
        <SpecificFeaturedProjects />
        <StatsCounter />
        <Testimonials websiteReviews={websiteReviews} isLoading={isLoading} />
        
        <section className="py-16 bg-dark-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Connect <span className="text-steel">With Us</span>
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-gray-400">
                Share your experience, join our events, and become part of our community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SubmitContentForm />
              <MeetingAnnouncementsList />
            </div>
          </div>
        </section>
        
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

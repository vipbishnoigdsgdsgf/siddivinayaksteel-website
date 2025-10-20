
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ProjectErrorProps {
  errorMessage?: string;
}

export function ProjectError({ errorMessage }: ProjectErrorProps) {
  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-8">
            {errorMessage || "The project you're looking for doesn't exist or has been removed."}
          </p>
          <Link to="/gallery">
            <Button className="bg-steel hover:bg-steel-dark text-white">
              Browse Other Projects
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

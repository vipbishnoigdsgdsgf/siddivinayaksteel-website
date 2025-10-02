
import { Loader } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function ProjectLoading() {
  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader className="h-8 w-8 animate-spin text-steel mr-2" />
          <span className="text-gray-400">Loading project details...</span>
        </div>
      </main>
      <Footer />
    </div>
  );
}

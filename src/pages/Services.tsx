
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import CallToAction from "@/components/CallToAction";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-dark-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-6">
                Our <span className="text-steel">Services</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Discover our comprehensive range of steel fitting solutions for your space.
              </p>
            </div>
          </div>
        </section>
        <Services />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

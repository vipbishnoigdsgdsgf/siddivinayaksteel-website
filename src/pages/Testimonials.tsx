
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Testimonial {
  id: number;
  name: string;
  image: string;
  role: string;
  company: string;
  rating: number;
  comment: string;
  date: string;
}

export default function TestimonialsPage() {
  const [filter, setFilter] = useState<string>("all");
  
  const testimonialsList: Testimonial[] = Array(80).fill(null).map((_, index) => ({
    id: index + 1,
    name: `Client ${index + 1}`,
    image: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${(index % 70) + 1}.jpg`,
    role: index % 3 === 0 ? "Homeowner" : index % 3 === 1 ? "Business Owner" : "Architect",
    company: `${["Elegant", "Modern", "Premium", "Luxury", "Urban"][index % 5]} ${["Homes", "Spaces", "Designs", "Interiors", "Properties"][index % 5]}`,
    rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
    comment: [
      "Sri Ganesh Steel delivered exceptional quality for our project. The craftsmanship was impeccable!",
      "We couldn't be happier with our custom steel railings. They transformed our space completely.",
      "The team was professional and completed the installation ahead of schedule. Fantastic service!",
      "The attention to detail in our steel fittings is remarkable. Highly recommend their services.",
      "From design to installation, the entire process was smooth and the results exceeded our expectations.",
      "The custom designs they created for our hotel lobby are stunning and frequently complimented by guests.",
      "Our office steel installations are both functional and aesthetically pleasing. Great balance!",
      "The quality of materials used is top-notch. These installations will last for decades.",
      "Very impressed with the innovative solutions they provided for our complex architectural requirements."
    ][index % 9],
    date: new Date(Date.now() - (Math.random() * 10000000000)).toLocaleDateString()
  }));
  
  const filteredTestimonials = filter === "all" 
    ? testimonialsList 
    : testimonialsList.filter(t => t.role.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-dark-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-6">
                Client <span className="text-steel">Testimonials</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Discover what our clients have to say about our steel fitting services and craftsmanship.
              </p>
            </div>
            
            <div className="flex justify-center mb-8 flex-wrap gap-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-steel hover:bg-steel-dark" : "border-gray-700"}
              >
                All Testimonials
              </Button>
              <Button 
                variant={filter === "homeowner" ? "default" : "outline"} 
                onClick={() => setFilter("homeowner")}
                className={filter === "homeowner" ? "bg-steel hover:bg-steel-dark" : "border-gray-700"}
              >
                Homeowners
              </Button>
              <Button 
                variant={filter === "business owner" ? "default" : "outline"} 
                onClick={() => setFilter("business owner")}
                className={filter === "business owner" ? "bg-steel hover:bg-steel-dark" : "border-gray-700"}
              >
                Business Owners
              </Button>
              <Button 
                variant={filter === "architect" ? "default" : "outline"} 
                onClick={() => setFilter("architect")}
                className={filter === "architect" ? "bg-steel hover:bg-steel-dark" : "border-gray-700"}
              >
                Architects
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-dark-300 border-gray-800 hover:border-steel transition duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 border-2 border-steel">
                        <img src={testimonial.image} alt={testimonial.name} />
                      </Avatar>
                      <div className="ml-4">
                        <h3 className="text-white font-medium">{testimonial.name}</h3>
                        <p className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} 
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-300 mb-4">"{testimonial.comment}"</p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{testimonial.date}</span>
                      <Link to={`/testimonial/${testimonial.id}`} className="text-steel hover:underline">
                        Read full review
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="sm"
                    className={page === 1 ? "bg-steel hover:bg-steel-dark" : "border-gray-700"}
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="border-gray-700">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

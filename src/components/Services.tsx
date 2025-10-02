
import { 
  Home, 
  Building2, 
  Ruler, 
  PenTool, 
  Wrench, 
  RefreshCcw,
  Layers 
} from "lucide-react";

interface ServiceProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ServiceCard({ icon, title, description }: ServiceProps) {
  return (
    <div className="neumorphic-card hover:transform hover:scale-[1.02] cursor-pointer">
      <div className="h-12 w-12 bg-dark-300 shadow-neumorphic-inset rounded-xl flex items-center justify-center text-steel mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

export default function Services() {
  const services = [
    {
      icon: <Home size={24} />,
      title: "Residential Steel Works",
      description: "Custom steel fittings for homes including railings, staircases, gates, and structural elements with elegant designs."
    },
    {
      icon: <Building2 size={24} />,
      title: "Commercial Projects",
      description: "Premium steel solutions for hotels, offices, and retail spaces focusing on durability and aesthetic appeal."
    },
    {
      icon: <Ruler size={24} />,
      title: "Custom Designs",
      description: "Bespoke steel design services tailored to your specific requirements and architectural vision."
    },
    {
      icon: <PenTool size={24} />,
      title: "Artistic Fabrications",
      description: "Decorative steel elements that combine functionality with artistic expression for unique spaces."
    },
    {
      icon: <Wrench size={24} />,
      title: "Installation Services",
      description: "Expert installation by skilled professionals ensuring perfect fitting and finishing of all steel works."
    },
    {
      icon: <Layers size={24} />,
      title: "Glass Fitting Solutions",
      description: "Premium glass and glazing solutions combined with steel frameworks for modern architectural designs."
    },
    {
      icon: <RefreshCcw size={24} />,
      title: "Maintenance & Repairs",
      description: "Ongoing maintenance and repair services to ensure the longevity of your steel installations."
    }
  ];

  return (
    <section className="py-16 bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Our <span className="text-steel">Services</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            We provide comprehensive steel fitting solutions for various spaces with a focus on quality, durability, and design.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


import { UserCheck, Building, Award, Wrench } from "lucide-react";
import { useEffect, useState } from "react";

interface StatProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
}

const StatCounter = ({ icon, value, label, suffix = "", duration = 2000 }: StatProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = Math.floor(value);
    const incrementTime = duration / end;
    let timer: number;
    
    // Animate count up
    const run = () => {
      timer = window.setTimeout(() => {
        start += 1;
        setCount(start);
        if (start < end) run();
      }, incrementTime);
    };
    
    run();
    
    return () => clearTimeout(timer);
  }, [value, duration]);

  return (
    <div className="neumorphic-card h-full flex flex-col items-center justify-center py-8">
      <div className="h-16 w-16 rounded-full bg-dark-300 shadow-neumorphic-inset flex items-center justify-center text-steel mb-6">
        {icon}
      </div>
      <div className="text-4xl font-bold text-steel">
        {count}{suffix}
      </div>
      <p className="mt-3 text-gray-400">{label}</p>
    </div>
  );
};

export default function StatsCounter() {
  return (
    <section className="py-16 bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCounter 
            icon={<UserCheck size={32} />} 
            value={500} 
            label="Happy Clients" 
            suffix="+" 
          />
          <StatCounter 
            icon={<Building size={32} />} 
            value={750} 
            label="Projects Completed" 
            suffix="+" 
          />
          <StatCounter 
            icon={<Award size={32} />} 
            value={5} 
            label="Years Experience" 
            suffix="+" 
          />
          <StatCounter 
            icon={<Wrench size={32} />} 
            value={50} 
            label="Expert Technicians" 
            suffix="+" 
          />
        </div>
      </div>
    </section>
  );
}

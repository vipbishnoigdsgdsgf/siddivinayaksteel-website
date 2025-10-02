
import { Share, Bookmark, Heart, Calendar, Clock, Building, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

interface ProjectOverviewProps {
  description: string;
  longDescription: string;
  completedDate: string;
  duration: string;
  client: string;
  location: string;
  features: string[];
  team: Array<{
    name: string;
    role: string;
    image: string;
  }>;
}

export function ProjectOverview({
  description,
  longDescription,
  completedDate,
  duration,
  client,
  location,
  features,
  team,
}: ProjectOverviewProps) {
  return (
    <div className="bg-dark-200 rounded-lg p-6 border border-gray-800 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Project Overview</h2>
        <div className="flex space-x-2">
          <Button size="icon" variant="ghost" className="rounded-full">
            <Share className="h-5 w-5 text-gray-400" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Bookmark className="h-5 w-5 text-gray-400" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Heart className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </div>
      
      <p className="text-gray-300 mb-6">{description}</p>
      <p className="text-gray-300 mb-8">{longDescription}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-300 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-steel mr-2" />
            <h3 className="text-white font-medium">Completion Date</h3>
          </div>
          <p className="text-gray-400">{completedDate}</p>
        </div>
        
        <div className="bg-dark-300 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-steel mr-2" />
            <h3 className="text-white font-medium">Project Duration</h3>
          </div>
          <p className="text-gray-400">{duration}</p>
        </div>
        
        <div className="bg-dark-300 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center mb-2">
            <Building className="h-5 w-5 text-steel mr-2" />
            <h3 className="text-white font-medium">Client</h3>
          </div>
          <p className="text-gray-400">{client}</p>
        </div>
        
        <div className="bg-dark-300 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center mb-2">
            <MapPin className="h-5 w-5 text-steel mr-2" />
            <h3 className="text-white font-medium">Location</h3>
          </div>
          <p className="text-gray-400">{location}</p>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-4">Key Features</h3>
      <ul className="list-disc pl-6 mb-8 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-300">{feature}</li>
        ))}
      </ul>
      
      <h3 className="text-xl font-semibold text-white mb-4">Project Team</h3>
      <div className="flex flex-wrap gap-4">
        {team.map((member, index) => (
          <div key={index} className="flex items-center bg-dark-300 rounded-full pl-1 pr-4 py-1">
            <Avatar className="h-8 w-8">
              <img src={member.image} alt={member.name} onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/assets/Steel and Glass Staircase.jpeg";
              }} />
            </Avatar>
            <div className="ml-2">
              <p className="text-white text-sm">{member.name}</p>
              <p className="text-gray-500 text-xs">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

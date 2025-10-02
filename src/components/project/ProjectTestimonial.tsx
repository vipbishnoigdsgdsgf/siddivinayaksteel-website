
import { Avatar } from "@/components/ui/avatar";

interface TestimonialProps {
  text: string;
  author: string;
  position: string;
  image: string;
}

export function ProjectTestimonial({
  text,
  author,
  position,
  image,
}: TestimonialProps) {
  return (
    <div className="bg-dark-200 rounded-lg p-6 border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6">Client Testimonial</h2>
      <div className="bg-dark-300 p-6 rounded-lg border border-gray-700">
        <p className="text-gray-300 italic mb-6">"{text}"</p>
        <div className="flex items-center">
          <Avatar className="h-12 w-12">
            <img src={image} alt={author} />
          </Avatar>
          <div className="ml-4">
            <p className="text-white font-medium">{author}</p>
            <p className="text-gray-400">{position}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

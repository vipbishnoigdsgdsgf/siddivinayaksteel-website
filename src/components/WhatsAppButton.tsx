import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Phone } from "lucide-react"; // MessageCircle HATA diya
import { useIsMobile } from "@/hooks/use-mobile";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber,
  message = "Hello! I'm interested in your steel fitting services. Can you help me?"
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    const formattedPhone = phoneNumber.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-28 right-4 z-50 md:bottom-24 md:right-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClick}
              aria-label="Chat on WhatsApp"
              className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-xl transition-all duration-300 hover:bg-green-600 hover:scale-110 animate-bounce"
              style={{
                animation: 'pulse-whatsapp 2s infinite, float 3s ease-in-out infinite'
              }}
            >
              {/* Notification Badge */}
              <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg animate-pulse">
                1
              </div>

              {/* WhatsApp Icon */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="white" 
                viewBox="0 0 24 24" 
                className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15s-.767.967-.94 1.165c-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.148-.67-1.612-.916-2.215-.242-.579-.487-.5-.67-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.064 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.718 2.006-1.41.248-.692.248-1.285.173-1.41-.074-.124-.272-.198-.57-.347m-5.421 6.167h-.001a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982 1-3.65-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.899a9.825 9.825 0 0 1 2.893 6.991c-.003 5.45-4.437 9.884-9.891 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .162 5.333.16 11.888a11.82 11.82 0 0 0 1.617 6.003L0 24l6.22-1.634a11.832 11.832 0 0 0 5.798 1.471h.005c6.554 0 11.887-5.333 11.89-11.888a11.823 11.823 0 0 0-3.493-8.465" />
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side={isMobile ? "left" : "top"} className="max-w-xs">
            <div className="flex flex-col space-y-2 p-2">
              <div className="flex items-center space-x-2">
                <div className="flex h-3 w-3 rounded-full bg-green-500">
                  <div className="h-full w-full animate-ping rounded-full bg-green-400"></div>
                </div>
                <span className="text-sm font-medium">We're Online!</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-500" />
                <span className="text-sm">{phoneNumber}</span>
              </div>
              <p className="text-xs text-muted-foreground">Click to chat with us on WhatsApp</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

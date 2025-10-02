
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      console.error("Error sending reset password email:", error);
      toast.error(error.message || "Failed to send reset password email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-100">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-dark-200 p-8 rounded-lg border border-steel/30 shadow-neumorphic">
          <div>
            <Link to="/login" className="flex items-center text-steel mb-6 hover:text-steel-light transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              {isSubmitted ? "Check your email" : "Reset your password"}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {isSubmitted 
                ? "We've sent you a password reset link. Please check your inbox." 
                : "Enter your email and we'll send you a password reset link."}
            </p>
          </div>
          
          {isSubmitted ? (
            <div className="space-y-6">
              <div className="py-4 px-5 bg-dark-300/50 border border-gray-700 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-steel h-6 w-6" />
                <p className="text-gray-300">
                  If you don't see the email, please check your spam folder.
                </p>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button
                  type="button"
                  className="bg-dark-300 hover:bg-dark-400 text-white"
                  onClick={() => setIsSubmitted(false)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try a different email
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="border-gray-700"
                >
                  <Link to="/login">Return to login</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email-address" className="block text-sm font-medium text-gray-300">
                  Email address
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="bg-dark-300 border-gray-700 pl-10 focus:ring-steel focus:border-steel"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-steel hover:bg-steel-light text-white"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

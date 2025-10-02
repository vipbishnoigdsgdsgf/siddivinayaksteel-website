
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { updateUserPassword } = useAuth();
  const navigate = useNavigate();

  // Check if we have a hash fragment in the URL (from the reset password email)
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes("type=recovery")) {
      toast.error("Invalid or expired password reset link");
      navigate("/forgot-password");
    }
  }, [navigate]);

  const validatePasswords = () => {
    const match = password === confirmPassword;
    setPasswordsMatch(match);
    return match;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await updateUserPassword(password);
      
      if (error) throw error;
      
      toast.success("Password has been reset successfully");
      navigate("/login");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to reset password");
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
          <Link to="/login" className="flex items-center text-steel mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-white glow-text">
            Create new password
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Please enter a new password for your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                New password
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="bg-dark-300 border-gray-700 pl-10 pr-10 focus:ring-steel focus:border-steel"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                Confirm new password
              </Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-500" />
                </div>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className={`bg-dark-300 border-gray-700 pl-10 pr-10 focus:ring-steel focus:border-steel ${!passwordsMatch ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (password && e.target.value) {
                      setPasswordsMatch(password === e.target.value);
                    }
                  }}
                  onBlur={validatePasswords}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {!passwordsMatch && (
                <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-steel hover:bg-steel-light text-white"
            disabled={isLoading || !passwordsMatch}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

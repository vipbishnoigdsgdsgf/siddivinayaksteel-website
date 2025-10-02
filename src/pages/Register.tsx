
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

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
    
    const fullName = `${firstName} ${lastName}`.trim();
    const userData = {
      full_name: fullName,
      phone: phone,
    };
    
    const { error } = await signUp(email, password, userData);
    
    setIsLoading(false);
    
    if (!error) {
      // Redirect to email confirmation page after successful signup
      navigate("/email-confirmation");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-100">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-dark-200 p-8 rounded-lg border border-gray-800 shadow-lg">
          <div>
            <Link to="/" className="flex items-center text-steel mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-steel hover:text-steel-light">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 border-gray-700 hover:bg-dark-300"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
              </svg>
              <span>{googleLoading ? "Connecting..." : "Continue with Google"}</span>
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-gray-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-dark-200 text-gray-400 text-sm">Or register with email</span>
            </div>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="first-name" className="block text-sm font-medium text-gray-300">
                    First name
                  </Label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <Input
                      id="first-name"
                      name="first-name"
                      type="text"
                      required
                      className="bg-dark-300 border-gray-700 pl-10 focus:border-steel"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="last-name" className="block text-sm font-medium text-gray-300">
                    Last name
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="last-name"
                      name="last-name"
                      type="text"
                      required
                      className="bg-dark-300 border-gray-700 focus:border-steel"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="bg-dark-300 border-gray-700 pl-10 focus:border-steel"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                  Phone number
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="bg-dark-300 border-gray-700 pl-10 focus:border-steel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="bg-dark-300 border-gray-700 pl-10 focus:border-steel"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
                  Confirm password
                </Label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`bg-dark-300 border-gray-700 pl-10 focus:border-steel ${!passwordsMatch ? 'border-red-500' : ''}`}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (password && e.target.value) {
                        setPasswordsMatch(password === e.target.value);
                      }
                    }}
                    onBlur={validatePasswords}
                  />
                </div>
                {!passwordsMatch && (
                  <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <Input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-steel border-gray-700 rounded bg-dark-300"
              />
              <Label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                I agree to the{" "}
                <Link to="/terms-of-service" className="font-medium text-steel hover:text-steel-light">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="font-medium text-steel hover:text-steel-light">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-steel hover:bg-steel-dark text-white"
                disabled={isLoading || !passwordsMatch}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

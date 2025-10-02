import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Phone, ArrowLeft, LogIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [showEmailOtpOption, setShowEmailOtpOption] = useState(false);
  const { signIn, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (user) return <Navigate to="/" replace />;

  const handleEmailOtp = async () => {
    if (!email) {
      toast.error('Please enter your email address first');
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });
      
      if (error) {
        throw error;
      }
      
      setShowOtpField(true);
      toast.success("Email OTP Sent", {
        description: `Check your email (${email}) for the verification code`,
      });
    } catch (error: any) {
      toast.error("Email OTP Error", {
        description: error.message || "Failed to send email OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isPhoneLogin) {
        const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
        const fullPhoneNumber = `${countryCode}${cleanedPhoneNumber}`;
        
        // Enhanced phone number validation
        let isValidPhone = false;
        let phoneValidationMessage = "";
        
        if (countryCode === "+91" && cleanedPhoneNumber.length === 10) {
          isValidPhone = true;
        } else if (countryCode === "+1" && cleanedPhoneNumber.length === 10) {
          isValidPhone = true;
        } else if (countryCode === "+44" && cleanedPhoneNumber.length >= 10 && cleanedPhoneNumber.length <= 11) {
          isValidPhone = true;
        } else {
          phoneValidationMessage = countryCode === "+91" 
            ? "Please enter a valid 10-digit Indian phone number"
            : `Please enter a valid phone number for ${countryCode}`;
        }
        
        if (!isValidPhone) {
          throw new Error(phoneValidationMessage);
        }

        if (!showOtpField) {
          // Phase 1: Send OTP
          const { error } = await supabase.auth.signInWithOtp({
            phone: fullPhoneNumber,
          });
          
          if (error) {
            // Enhanced error messages for SMS provider issues
            if (error.message.includes('sms_send_failed') || 
                error.message.includes('SMS provider') ||
                error.message.includes('Twilio') ||
                error.message.includes('20404') ||
                error.message.includes('requested resource') ||
                error.message.includes('not found')) {
              // Show email OTP option when SMS fails
              setShowEmailOtpOption(true);
              throw new Error("⚠️ SMS service is temporarily unavailable due to configuration issues. You can try email OTP below or use regular email login instead.");
            } else if (error.message.includes('Phone number')) {
              throw new Error("Invalid phone number format. Please check your number and try again.");
            } else if (error.message.includes('rate limit')) {
              throw new Error("Too many SMS requests. Please wait a few minutes before trying again.");
            } else {
              throw new Error(`SMS Error: ${error.message}`);
            }
          }
          
          setShowOtpField(true);
          toast.success("OTP Sent", {
            description: `Enter the 6-digit code sent to ${fullPhoneNumber}`,
          });
        } else {
          // Phase 2: Verify OTP
          if (!otp || otp.length !== 6) {
            throw new Error("Please enter a valid 6-digit OTP code");
          }
          
          const { data, error } = await supabase.auth.verifyOtp({
            phone: fullPhoneNumber,
            token: otp,
            type: "sms",
          });
          
          if (error) {
            if (error.message.includes('invalid') || error.message.includes('expired')) {
              throw new Error("Invalid or expired OTP. Please request a new code.");
            } else {
              throw new Error(`OTP Verification Error: ${error.message}`);
            }
          }

          // Fetch user profile after successful OTP verification
          if (data.user) {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();
            
            // Profile might not exist for new users, that's okay
            if (profileError && profileError.code !== 'PGRST116') {
              console.warn('Profile fetch error:', profileError);
            }
            
            toast.success("Login successful", {
              description: `Welcome, ${profile?.name || "User"}!`,
            });
            navigate("/");
          }
        }
      } else {
        // Handle email OTP verification or regular email login
        if (showOtpField && otp) {
          // Email OTP verification
          if (!otp || otp.length !== 6) {
            throw new Error("Please enter a valid 6-digit OTP code");
          }
          
          const { data, error } = await supabase.auth.verifyOtp({
            email: email,
            token: otp,
            type: "email",
          });
          
          if (error) {
            if (error.message.includes('invalid') || error.message.includes('expired')) {
              throw new Error("Invalid or expired OTP. Please request a new code.");
            } else {
              throw new Error(`Email OTP Verification Error: ${error.message}`);
            }
          }
          
          // Handle successful email OTP verification
          if (data.user) {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
              console.warn('Profile fetch error:', profileError);
            }
            
            toast.success("Login successful", {
              description: `Welcome, ${profile?.name || "User"}!`,
            });
            navigate("/");
          }
        } else {
          // Regular email login
          const { error } = await signIn(email, password);
          if (error) throw error;
          // Fetch profile for email login
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user?.id)
            .single();
          if (profileError) throw profileError;
          toast.success("Login successful", {
            description: `Welcome, ${profile?.name || "User"}!`,
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorTitle = "Login Error";
      if (isPhoneLogin) {
        errorTitle = showOtpField ? "OTP Verification Failed" : "SMS Error";
      }
      
      toast.error(errorTitle, {
        description: error.message || "Something went wrong. Please try again.",
        duration: 5000, // Show longer for error messages
      });
      
      // Reset OTP field if verification failed
      if (showOtpField && error.message.includes('invalid')) {
        setOtp("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // Fetch profile for Google login
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      if (profileError) throw profileError;
      toast.success("Login successful", {
        description: `Welcome, ${profile?.name || "User"}!`,
      });
    } catch (error: any) {
      toast.error("Google login failed", {
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-100">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-dark-200 p-6 sm:p-8 rounded-lg border border-steel/30 shadow-neumorphic">
          <div>
            <Link to="/" className="flex items-center text-steel mb-6 hover:text-steel-light transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-steel hover:text-steel-light transition-colors">
                Create account
              </Link>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-700 hover:bg-dark-300 flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg viewBox="0 0 48 48" className="w-5 h-5 mr-2">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Continue with Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-200 text-gray-400">Or continue with</span>
              </div>
            </div>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
                  <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-sm text-steel"
                  onClick={() => {
                    setIsPhoneLogin(!isPhoneLogin);
                    setShowOtpField(false);
                    setShowEmailOtpOption(false);
                    setPhoneNumber("");
                    setCountryCode("+91");
                    setOtp("");
                    setEmail("");
                    setPassword("");
                  }}
                >
                  {isPhoneLogin ? "Use email instead" : "Use phone number"}
                </Button>
              </div>

              {isPhoneLogin ? (
                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    Phone Number
                  </Label>
                  <div className="mt-1 flex gap-2">
                    <div className="relative w-1/4">
                      <select
                        id="country-code"
                        name="country-code"
                        className="bg-dark-300 text-sm border-gray-700 h-full focus:ring-steel focus:border-steel rounded-md"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        disabled={showOtpField}
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                      </select>
                    </div>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        required
                        className="bg-dark-300 border-gray-700 pl-10 focus:ring-steel focus:border-steel"
                        placeholder="6378941259"
                        value={phoneNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setPhoneNumber(val);
                        }}
                        disabled={showOtpField}
                      />
                    </div>
                  </div>

                  {showOtpField && (
                    <div className="mt-4 animate-fade-in">
                      <Label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                        OTP Code
                      </Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        className="bg-dark-300 border-gray-700 mt-1 focus:ring-steel focus:border-steel"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
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
                    
                    {/* Email OTP Option - Show when SMS fails */}
                    {showEmailOtpOption && !showOtpField && (
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleEmailOtp}
                          disabled={isLoading || !email}
                          className="w-full text-xs border-steel/50 text-steel hover:bg-steel/10"
                        >
                          📧 Try Email OTP Instead
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Show OTP field for email OTP */}
                  {showOtpField && !isPhoneLogin ? (
                    <div className="animate-fade-in">
                      <Label htmlFor="email-otp" className="block text-sm font-medium text-gray-300">
                        Email OTP Code
                      </Label>
                      <Input
                        id="email-otp"
                        name="email-otp"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        className="bg-dark-300 border-gray-700 mt-1 focus:ring-steel focus:border-steel"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                          Password
                        </Label>
                        <Link to="/forgot-password" className="text-xs font-medium text-steel hover:text-steel-light">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-500" />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          className="bg-dark-300 border-gray-700 pl-10 focus:ring-steel focus:border-steel"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-steel border-gray-700 rounded bg-dark-300"
              />
              <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </Label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-steel hover:bg-steel-light text-white flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <LogIn className="h-4 w-4" />
                {isLoading ? "Processing..." : showOtpField ? "Verify OTP" : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

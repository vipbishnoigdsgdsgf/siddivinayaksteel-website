
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const EmailConfirmation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [verificationState, setVerificationState] = useState<'pending' | 'success' | 'error' | 'processing'>('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  // Handle email verification from URL hash
  useEffect(() => {
    const handleEmailVerification = async () => {
      const hash = window.location.hash;
      
      // Check if this is a confirmation link (has access_token and type=signup)
      if (hash && (hash.includes('access_token') || hash.includes('type=signup') || hash.includes('type=recovery'))) {
        setVerificationState('processing');
        
        try {
          // Let Supabase handle the session from the URL
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (data.session && data.session.user) {
            setVerificationState('success');
            toast.success('Email verified successfully! Welcome aboard!');
            
            // Start countdown from 4 seconds
            setCountdown(4);
            const countdownInterval = setInterval(() => {
              setCountdown(prev => {
                if (prev <= 1) {
                  clearInterval(countdownInterval);
                  navigate('/');
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
            
            // Cleanup function in case component unmounts
            return () => clearInterval(countdownInterval);
          } else {
            // Still processing, show pending state
            setVerificationState('pending');
          }
        } catch (error: any) {
          console.error('Email verification error:', error);
          setVerificationState('error');
          setErrorMessage(error.message || 'Failed to verify email');
          toast.error('Email verification failed: ' + (error.message || 'Unknown error'));
        }
      }
    };
    
    handleEmailVerification();
  }, [navigate]);
  
  // Redirect authenticated users to home (but not during verification process)
  useEffect(() => {
    if (user && verificationState !== 'processing') {
      navigate("/");
    }
  }, [user, navigate, verificationState]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-100 relative overflow-hidden">
      {/* Steel design background elements - similar to NotFound page */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[600px] h-[600px] -top-40 -left-40 bg-steel/5 rounded-full blur-3xl"></div>
        <div className="absolute w-[600px] h-[600px] -bottom-40 -right-40 bg-steel/5 rounded-full blur-3xl"></div>
        
        {/* Steel bars - diagonal */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-0 w-1 h-[200%] bg-gradient-to-b from-transparent via-steel/20 to-transparent rotate-45 transform origin-top-left"></div>
          <div className="absolute top-0 right-0 w-1 h-[200%] bg-gradient-to-b from-transparent via-steel/20 to-transparent -rotate-45 transform origin-top-right"></div>
          <div className="absolute bottom-0 left-0 w-1 h-[200%] bg-gradient-to-t from-transparent via-steel/20 to-transparent -rotate-45 transform origin-bottom-left"></div>
          <div className="absolute bottom-0 right-0 w-1 h-[200%] bg-gradient-to-t from-transparent via-steel/20 to-transparent rotate-45 transform origin-bottom-right"></div>
        </div>
        
        {/* Glass effect borders */}
        <div className="absolute inset-x-12 top-10 h-1 bg-gradient-to-r from-transparent via-steel/40 to-transparent"></div>
        <div className="absolute inset-x-12 bottom-10 h-1 bg-gradient-to-r from-transparent via-steel/40 to-transparent"></div>
        <div className="absolute inset-y-12 left-10 w-1 bg-gradient-to-b from-transparent via-steel/40 to-transparent"></div>
        <div className="absolute inset-y-12 right-10 w-1 bg-gradient-to-b from-transparent via-steel/40 to-transparent"></div>
      </div>
      
      <div className="relative z-10 p-8 backdrop-blur-sm bg-dark-200/50 border border-gray-700 rounded-xl shadow-2xl max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="relative w-24 h-24 mx-auto">
            {verificationState === 'processing' ? (
              <div className="relative flex items-center justify-center w-full h-full bg-dark-300 rounded-full border border-steel">
                <Loader2 className="h-10 w-10 text-steel animate-spin" />
              </div>
            ) : verificationState === 'success' ? (
              <div className="relative flex items-center justify-center w-full h-full bg-green-600 rounded-full border border-green-500">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            ) : verificationState === 'error' ? (
              <div className="relative flex items-center justify-center w-full h-full bg-red-600 rounded-full border border-red-500">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-steel/20 animate-ping rounded-full"></div>
                <div className="relative flex items-center justify-center w-full h-full bg-dark-300 rounded-full border border-steel">
                  <Mail className="h-10 w-10 text-steel" />
                </div>
              </>
            )}
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          {verificationState === 'processing' ? 'Verifying Email...' :
           verificationState === 'success' ? 'Email Verified!' :
           verificationState === 'error' ? 'Verification Failed' :
           'Check Your Email'}
        </h1>
        
        <div className="h-1 w-20 bg-steel my-6"></div>
        
        <div className="space-y-4 mb-8">
          {verificationState === 'processing' ? (
            <p className="text-xl text-gray-400">
              Please wait while we verify your email address...
            </p>
          ) : verificationState === 'success' ? (
            <>
              <p className="text-xl text-green-400">
                Your email has been successfully verified! {countdown > 0 ? `Redirecting to homepage in ${countdown} seconds...` : 'Redirecting now...'}
              </p>
              <div className="py-4 px-5 bg-green-600/20 border border-green-500/50 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-green-400 h-6 w-6" />
                <p className="text-green-300">
                  Welcome to Siddhi Vinayak Steel Works! Your account is now active.
                </p>
              </div>
            </>
          ) : verificationState === 'error' ? (
            <>
              <p className="text-xl text-red-400">
                Failed to verify your email address. {errorMessage}
              </p>
              <div className="py-4 px-5 bg-red-600/20 border border-red-500/50 rounded-lg flex items-center gap-3">
                <AlertTriangle className="text-red-400 h-6 w-6" />
                <p className="text-red-300">
                  The verification link may be expired or invalid. Please try registering again.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-xl text-gray-400">
                🎉 Account created successfully! We've sent you a verification email{user?.email ? ` to ${user.email}` : ''}. Please check your inbox and click the verification link to complete your registration.
              </p>
              
              <div className="py-4 px-5 bg-dark-300/50 border border-gray-700 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-steel h-6 w-6" />
                <p className="text-gray-300">
                  If you don't see the email, please check your spam folder. The email may take a few minutes to arrive.
                </p>
              </div>
              
              <div className="py-3 px-4 bg-steel/10 border border-steel/30 rounded-lg">
                <p className="text-steel text-sm">
                  💡 <strong>Next steps:</strong> Click the verification link in your email, and you'll be automatically redirected to the homepage!
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-start">
          {verificationState === 'processing' ? (
            <Button disabled className="bg-steel/50 text-white cursor-not-allowed">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </Button>
          ) : verificationState === 'success' ? (
            <>
              <Button 
                asChild
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Link to="/">Go to Homepage</Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                className="border-green-500 text-green-400 hover:bg-green-500/10"
              >
                <Link to="/profile">View Profile</Link>
              </Button>
            </>
          ) : verificationState === 'error' ? (
            <>
              <Button 
                asChild
                className="bg-steel hover:bg-steel-dark text-white"
              >
                <Link to="/register">Register Again</Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                className="border-steel text-steel hover:bg-steel/10"
              >
                <Link to="/login">Return to Login</Link>
              </Button>
            </>
          ) : (
            <>
              <Button 
                asChild
                className="bg-steel hover:bg-steel-dark text-white"
              >
                <Link to="/login">Return to Login</Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                className="border-steel text-steel hover:bg-steel/10"
              >
                <Link to="/">Go to Homepage</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;

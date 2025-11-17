import React, { useState, useEffect, useContext } from "react";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  Map,
  Loader2,
  AlertTriangle,
  Chrome,
  Facebook,
  Smartphone,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../../context/AuthenticationContext"; // Import context
import logo from "../../../assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Use the context instead of hook
  const { login, loading, error, clearError } = useContext(
    AuthenticationContext
  );
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateEmail = (text) => {
    setEmail(text);
    if (text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (text) => {
    setPassword(text);
    if (text && text.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation
    let valid = true;
    if (!email) {
      setEmailError("Email is required");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    }
    if (!valid) return;
    clearError();

    const result = await login({ email, password }, rememberMe);
  };

  const handleSocialLogin = (provider) => {
    alert(`🚀 ${provider} login will be available soon!`);
  };

  const handleForgotPassword = () => {
    if (
      window.confirm("We'll send reset instructions to your email. Continue?")
    ) {
      alert("📧 Password reset link sent! Check your email.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div
        className={`w-full max-w-6xl transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="md:bg-white rounded-3xl md:shadow-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left Side - Image Section */}
          <div className="lg:w-1/2 bg-gradient-to-br from-red-600 to-red-700 relative hidden lg:block">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative h-full p-12 flex flex-col justify-between text-white">
              <div className="relative z-10">
                <button
                  onClick={() => window.history.back()}
                  className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors mb-8"
                >
                  <ArrowLeft size={20} className="text-white" />
                </button>

                <div className="mb-8">
                  <div
                    className="w-20 h-20 bg-white/20 rounded-2xl bg-cover bg-center mb-2"
                    style={{ backgroundImage: `url(${logo})` }}
                  />
                  <h1 className="text-4xl font-black mb-4">
                    Discover Cebu's Hidden Gems
                  </h1>
                  <p className="text-red-100 text-lg opacity-90">
                    Join thousands of travelers exploring the heart of the
                    Philippines
                  </p>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Map size={16} className="text-white" />
                  </div>
                  <span className="text-red-100">
                    100+ Amazing Destinations
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Shield size={16} className="text-white" />
                  </div>
                  <span className="text-red-100">
                    Secure & Reliable Platform
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm">⭐</span>
                  </div>
                  <span className="text-red-100">4.9/5 Traveler Rating</span>
                </div>
              </div>

              <div className="relative z-10 pt-8 border-t border-white/20">
                <p className="text-red-100 text-sm opacity-80">
                  "Sugoyage made exploring Cebu an unforgettable experience!"
                  <br />
                  <span className="opacity-60">- Maria, Travel Enthusiast</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="lg:w-1/2 p-8">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-8">
              <button
                onClick={() => window.history.back()}
                className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div className="text-center flex-1">
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-500 text-base">
                  Continue your Cebu adventure
                </p>
              </div>
              <div className="w-10"></div>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div
                className="w-20 h-20 bg-red-500 rounded-2xl bg-cover bg-center mb-2"
                style={{ backgroundImage: `url(${logo})` }}
              />
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <div className="text-center">
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-500 text-base">
                  Sign in to continue your journey
                </p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center">
                    <AlertTriangle size={16} className="text-red-600" />
                    <span className="font-semibold text-sm ml-2 text-red-700">
                      {error}
                    </span>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="text-gray-700 font-semibold mb-2 text-sm block">
                  Email Address
                </label>
                <div
                  className={`relative flex items-center bg-white rounded-2xl px-4 py-3 border-2 transition-colors ${
                    emailError
                      ? "border-red-400"
                      : "border-gray-200 focus-within:border-red-500"
                  }`}
                >
                  <Mail
                    size={20}
                    className={emailError ? "text-red-500" : "text-gray-400"}
                  />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 ml-3 text-gray-900 text-base bg-transparent outline-none placeholder-gray-400"
                    value={email}
                    onChange={(e) => validateEmail(e.target.value)}
                    disabled={loading}
                  />
                  {email && (
                    <button
                      type="button"
                      onClick={() => setEmail("")}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                {emailError && (
                  <p className="text-red-500 text-xs mt-2 ml-1">{emailError}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="text-gray-700 font-semibold mb-2 text-sm block">
                  Password
                </label>
                <div
                  className={`relative flex items-center bg-white rounded-2xl px-4 py-3 border-2 transition-colors ${
                    passwordError
                      ? "border-red-400"
                      : "border-gray-200 focus-within:border-red-500"
                  }`}
                >
                  <Lock
                    size={20}
                    className={passwordError ? "text-red-500" : "text-gray-400"}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="flex-1 ml-3 text-gray-900 text-base bg-transparent outline-none placeholder-gray-400"
                    value={password}
                    onChange={(e) => validatePassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs mt-2 ml-1">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <span
                    className={`text-sm ${
                      loading ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className={`text-sm font-semibold transition-colors ${
                    loading
                      ? "text-gray-400"
                      : "text-red-600 hover:text-red-700"
                  }`}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-2xl py-4 shadow-lg transition-all ${
                  loading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 transform hover:scale-[1.02]"
                }`}
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader2 size={20} className="text-white animate-spin" />
                      <span className="text-white font-bold text-base ml-2">
                        Signing In...
                      </span>
                    </>
                  ) : (
                    <>
                      <Map size={20} className="text-white" />
                      <span className="text-white font-bold text-base ml-2">
                        Explore Cebu
                      </span>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm mx-4 font-medium">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <button
                onClick={() => handleSocialLogin("Google")}
                disabled={loading}
                className={`flex items-center justify-center border-2 rounded-xl py-3.5 transition-all ${
                  loading
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <Chrome
                  size={20}
                  className={loading ? "text-gray-400" : "text-gray-600"}
                />
              </button>

              <button
                onClick={() => handleSocialLogin("Facebook")}
                disabled={loading}
                className={`flex items-center justify-center rounded-xl py-3.5 transition-all ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <Facebook size={20} className="text-white" />
              </button>

              <button
                onClick={() => handleSocialLogin("Apple")}
                disabled={loading}
                className="flex items-center justify-center bg-black rounded-xl py-3.5 hover:bg-gray-900 transition-all"
              >
                <Smartphone size={20} className="text-white" />
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mb-8">
              <span className="text-gray-600 text-sm">New to Sugoyage? </span>
              <Link to="/auth/register">
                <button
                  disabled={loading}
                  className={`font-bold text-sm transition-colors ${
                    loading
                      ? "text-gray-400"
                      : "text-red-600 hover:text-red-700"
                  }`}
                >
                  Create Account
                </button>
              </Link>
            </div>

            {/* Footer - Mobile Only */}
            <div className="lg:hidden mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center">
                  <Shield size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs ml-2">
                    Secure & Encrypted
                  </span>
                </div>
                <p className="text-gray-400 text-xs text-center">
                  Your travel data is safe with us 🛡️
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

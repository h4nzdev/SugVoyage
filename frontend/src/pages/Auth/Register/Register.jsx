import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  UserCheck,
  CheckCircle,
  Shield,
  MapPin,
  UserPlus,
  Loader2,
  AlertTriangle,
  Check,
  Map,
  Star,
  Users,
  Info,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../../context/AuthenticationContext"; // Import context
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../hooks/useAuth";

// Memoized InputField component
const InputField = React.memo(
  ({
    label,
    name,
    placeholder,
    secureTextEntry,
    showPasswordToggle,
    autoCapitalize = "none",
    value,
    onChange,
    error,
    loading,
    onTogglePassword,
    keyboardType = "default",
  }) => {
    return (
      <div className="mb-5">
        <label className="text-gray-700 font-semibold mb-2 text-sm block">
          {label}
        </label>
        <div
          className={`relative flex items-center bg-white rounded-2xl px-4 py-3 border-2 transition-colors ${
            error
              ? "border-red-400"
              : "border-gray-200 focus-within:border-red-500"
          }`}
        >
          {name === "email" && (
            <Mail
              size={20}
              className={error ? "text-red-500" : "text-gray-400"}
            />
          )}
          {(name === "password" || name === "confirmPassword") && (
            <Lock
              size={20}
              className={error ? "text-red-500" : "text-gray-400"}
            />
          )}
          {name === "username" && (
            <User
              size={20}
              className={error ? "text-red-500" : "text-gray-400"}
            />
          )}
          {name === "displayName" && (
            <UserCheck
              size={20}
              className={error ? "text-red-500" : "text-gray-400"}
            />
          )}

          <input
            type={secureTextEntry ? "password" : "text"}
            placeholder={placeholder}
            className="flex-1 ml-3 text-gray-900 text-base bg-transparent outline-none placeholder-gray-400"
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            disabled={loading}
            autoCapitalize={autoCapitalize}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          {showPasswordToggle && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {secureTextEntry ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-2 ml-1">{error}</p>}
      </div>
    );
  }
);

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Added remember me state
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { sendVerificationCode } = useAuth();

  const { user } = useContext(AuthenticationContext);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setIsVisible(true);
    setProgress(((currentStep - 1) / 2) * 100);

    // Check if user is already logged in
    if (user) {
      navigate(-1);
    }
  }, [currentStep, navigate, user]);

  const validateField = useCallback(
    (name, value) => {
      const newErrors = { ...errors };

      switch (name) {
        case "username":
          if (!value) {
            newErrors.username = "Username is required";
          } else if (value.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
          } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            newErrors.username =
              "Username can only contain letters, numbers, and underscores";
          } else {
            delete newErrors.username;
          }
          break;

        case "email":
          if (!value) {
            newErrors.email = "Email is required";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors.email = "Please enter a valid email address";
          } else {
            delete newErrors.email;
          }
          break;

        case "password":
          if (!value) {
            newErrors.password = "Password is required";
          } else if (value.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
          } else {
            delete newErrors.password;
          }

          // Also validate confirm password if it exists
          if (formData.confirmPassword && value !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
          } else if (formData.confirmPassword) {
            delete newErrors.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (!value) {
            newErrors.confirmPassword = "Please confirm your password";
          } else if (value !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
          } else {
            delete newErrors.confirmPassword;
          }
          break;

        case "displayName":
          if (!value) {
            newErrors.displayName = "Display name is required";
          } else if (value.length < 2) {
            newErrors.displayName =
              "Display name must be at least 2 characters";
          } else {
            delete newErrors.displayName;
          }
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [errors, formData.confirmPassword, formData.password]
  );

  const handleInputChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
      setError("");
    },
    [validateField]
  );

  const validateStep = useCallback(
    (step) => {
      const newErrors = {};

      switch (step) {
        case 1:
          if (!formData.username) newErrors.username = "Username is required";
          if (!formData.email) newErrors.email = "Email is required";
          break;
        case 2:
          if (!formData.password) newErrors.password = "Password is required";
          if (!formData.confirmPassword)
            newErrors.confirmPassword = "Please confirm your password";
          if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";
          break;
        case 3:
          if (!formData.displayName)
            newErrors.displayName = "Display name is required";
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError("");
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Prepare user data for registration
      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        displayName: formData.displayName.trim(),
      };

      console.log("📧 Sending verification code...");

      // Use the sendVerificationCode from the hook
      const verificationResult = await sendVerificationCode(userData.email);

      if (verificationResult.success) {
        console.log("✅ Verification code sent!");
        navigate("/auth/verify-email", {
          state: {
            email: userData.email,
            userData: userData,
          },
        });
      } else {
        setError(
          verificationResult.message || "Failed to send verification code"
        );
      }
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
      console.error("❌ Verification code error:", err);
    } finally {
      setLoading(false);
    }
  };

  const ProgressBar = () => (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-red-600 font-bold text-sm">
          Step {currentStep} of 3
        </span>
        <span className="text-gray-500 text-sm">
          {currentStep === 1 && "Account Basics"}
          {currentStep === 2 && "Security"}
          {currentStep === 3 && "Profile"}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              step === currentStep
                ? "bg-red-600"
                : step < currentStep
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
          >
            {step < currentStep ? (
              <Check size={16} className="text-white" />
            ) : (
              <span
                className={`font-bold text-sm ${
                  step === currentStep ? "text-white" : "text-gray-600"
                }`}
              >
                {step}
              </span>
            )}
          </div>
          {step < 3 && (
            <div
              className={`w-8 h-1 mx-1 transition-colors ${
                step < currentStep ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
      <div
        className={`w-full max-w-6xl transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left Side - Image Section */}
          <div className="lg:w-1/2 bg-gradient-to-br from-red-600 to-red-700 relative hidden lg:block">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative h-full p-12 flex flex-col justify-between text-white">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
                <div className="absolute bottom-20 right-16 w-24 h-24 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
              </div>

              {/* Content */}
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
                    Start Your Cebu Journey
                  </h1>
                  <p className="text-red-100 text-lg opacity-90">
                    Join our community of adventurers and discover paradise
                    islands
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Users size={16} className="text-white" />
                  </div>
                  <span className="text-red-100">Join 50,000+ Travelers</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Map size={16} className="text-white" />
                  </div>
                  <span className="text-red-100">200+ Cebu Destinations</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Star size={16} className="text-white" />
                  </div>
                  <span className="text-red-100">Exclusive Travel Deals</span>
                </div>
              </div>

              {/* Step Benefits */}
              <div className="relative z-10 pt-8 border-t border-white/20">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        currentStep >= 1 ? "bg-green-500" : "bg-white/30"
                      }`}
                    >
                      {currentStep >= 1 && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span className="text-red-100 text-sm">
                      Create your travel profile
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        currentStep >= 2 ? "bg-green-500" : "bg-white/30"
                      }`}
                    >
                      {currentStep >= 2 && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span className="text-red-100 text-sm">
                      Secure your account
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        currentStep >= 3 ? "bg-green-500" : "bg-white/30"
                      }`}
                    >
                      {currentStep >= 3 && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <span className="text-red-100 text-sm">
                      Complete registration
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Text */}
              <div className="relative z-10 pt-8 border-t border-white/20">
                <p className="text-red-100 text-sm opacity-80">
                  "The best travel companion for exploring Cebu's hidden beaches
                  and waterfalls!"
                  <br />
                  <span className="opacity-60">- Carlos, Adventure Seeker</span>
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
                  Join SugVoyage
                </h1>
                <p className="text-gray-500 text-base">
                  Start your Cebu adventure today
                </p>
              </div>
              <div className="w-10"></div>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🌊</span>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <div className="text-center">
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                  Create Account
                </h1>
                <p className="text-gray-500 text-base">
                  Join our community in 3 simple steps
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <ProgressBar />

            {/* Step Indicator */}
            <StepIndicator />

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Success/Error Message */}
              {(error || success) && (
                <div
                  className={`rounded-2xl p-4 ${
                    success
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center">
                    {success ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <AlertTriangle size={16} className="text-red-600" />
                    )}
                    <span
                      className={`font-semibold text-sm ml-2 ${
                        success ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {error}
                    </span>
                  </div>
                </div>
              )}

              {/* Step 1: Account Basics */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    Create Your Account
                  </h2>

                  <InputField
                    label="Username"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    error={errors.username}
                    loading={loading}
                    showPasswordToggle={false}
                    secureTextEntry={false}
                    autoCapitalize="none"
                  />

                  <InputField
                    label="Email Address"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    loading={loading}
                    showPasswordToggle={false}
                    secureTextEntry={false}
                    autoCapitalize="none"
                    keyboardType="email"
                  />
                </div>
              )}

              {/* Step 2: Security */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    Secure Your Account
                  </h2>

                  <InputField
                    label="Password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    loading={loading}
                    showPasswordToggle={true}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />

                  <InputField
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    loading={loading}
                    showPasswordToggle={true}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    onTogglePassword={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />

                  <div className="bg-red-50 rounded-2xl p-4 border border-red-200 mt-2">
                    <h3 className="text-red-800 font-semibold text-sm mb-2">
                      Password Requirements:
                    </h3>
                    <p className="text-red-600 text-xs">
                      • At least 6 characters long
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Profile */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    Complete Your Profile
                  </h2>

                  <InputField
                    label="Display Name"
                    name="displayName"
                    placeholder="How should we call you?"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    error={errors.displayName}
                    loading={loading}
                    showPasswordToggle={false}
                    secureTextEntry={false}
                    autoCapitalize="words"
                  />

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center space-x-2 mb-6">
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
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4 border border-green-200 mt-2 mb-6">
                    <div className="flex items-center mb-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-green-800 font-semibold text-sm ml-2">
                        Almost there!
                      </span>
                    </div>
                    <p className="text-green-600 text-xs">
                      Complete registration to start exploring Cebu
                    </p>
                  </div>

                  {/* Review Summary */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                    <h3 className="text-gray-800 font-semibold mb-3">
                      Review Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Username:</span>
                        <span className="text-gray-900 text-sm font-medium">
                          {formData.username}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Email:</span>
                        <span className="text-gray-900 text-sm font-medium">
                          {formData.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">
                          Display Name:
                        </span>
                        <span className="text-gray-900 text-sm font-medium">
                          {formData.displayName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div
                className={`flex justify-between mt-8 mb-6 ${
                  currentStep === 1 ? "justify-end" : ""
                }`}
              >
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={loading}
                    className="flex-1 bg-gray-100 rounded-2xl py-4 mr-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <span className="text-gray-700 font-bold text-base">
                      Back
                    </span>
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={loading}
                    className="flex-1 bg-red-600 rounded-2xl py-4 ml-2 hover:bg-red-700 transform hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    <span className="text-white font-bold text-base">
                      Continue
                    </span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 rounded-2xl py-4 ml-2 shadow-lg transition-all ${
                      loading
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 transform hover:scale-[1.02]"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {loading ? (
                        <>
                          <Loader2
                            size={20}
                            className="text-white animate-spin"
                          />
                          <span className="text-white font-bold text-base ml-2">
                            Sending Code...
                          </span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={20} className="text-white" />
                          <span className="text-white font-bold text-base ml-2">
                            Verify Email
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                )}
              </div>

              {/* Login Link */}
              <div className="text-center mb-8">
                <span className="text-gray-600 text-sm">
                  Already have an account?{" "}
                </span>
                <Link to="/auth/login">
                  <button
                    type="button"
                    disabled={loading}
                    className={`font-bold text-sm transition-colors ${
                      loading
                        ? "text-gray-400"
                        : "text-red-600 hover:text-red-700"
                    }`}
                  >
                    Sign In
                  </button>
                </Link>
              </div>

              {/* Security Note */}
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                <div className="flex items-center mb-2">
                  <Shield size={16} className="text-purple-500" />
                  <span className="text-purple-800 font-semibold text-sm ml-2">
                    Your Privacy Matters
                  </span>
                </div>
                <p className="text-purple-600 text-xs">
                  We protect your personal information and never share it
                  without your consent
                </p>
              </div>
            </form>

            {/* Footer - Mobile Only */}
            <div className="lg:hidden mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="text-gray-400 text-xs ml-2">
                    Discover Amazing Places in Cebu
                  </span>
                </div>
                <p className="text-gray-400 text-xs text-center">
                  Join thousands of travelers exploring Cebu's hidden gems 🗺️
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthenticationContext } from "../../../context/AuthenticationContext";

const EmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Use the auth context
  const { register, sendVerificationCode, loading, error, clearError } =
    useContext(AuthenticationContext);

  const userEmail = location.state?.email;
  const userData = location.state?.userData;

  useEffect(() => {
    if (!userEmail || !userData) {
      navigate("/auth/register");
    }
  }, [userEmail, userData, navigate]);

  // Handle input change
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    clearError(); // Clear errors when user types

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newCode.every((digit) => digit !== "") && index === 5) {
      handleVerify();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numbers = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    const newCode = [...code];
    numbers.forEach((num, index) => {
      if (index < 6) {
        newCode[index] = num;
      }
    });

    setCode(newCode);
    clearError();

    const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex].focus();
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      return; // Let the hook handle the error
    }
    const registrationData = {
      ...userData,
      verificationCode: verificationCode,
    };

    console.log("📝 Completing registration with verification code...");
    const result = await register(registrationData);

    if (result.success) {
      console.log("✅ Registration successful!");
      setTimeout(() => {
        navigate("/auth/login", {
          state: {
            message: "Registration successful! Please login to continue.",
          },
        });
      }, 2000);
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) return;

    setResendLoading(true);
    clearError();

    try {
      // Use the sendVerificationCode from the hook
      const result = await sendVerificationCode(userEmail);

      if (result.success) {
        setTimeLeft(300); // Reset timer to 5 minutes
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      }
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen md:bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl md:shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate("/auth/register")}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center fixed hover:bg-gray-200 transition-colors mb-6 mx-auto"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>

            {/* Icon */}
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-red-600" />
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-base">
              We sent a 6-digit code to your email
            </p>
            <p className="text-red-600 font-semibold text-sm mt-1">
              {userEmail}
            </p>
          </div>

          {/* Code Input */}
          <div className="mb-8">
            <label className="text-gray-700 font-semibold mb-4 text-sm block text-center">
              Enter verification code
            </label>

            <div className="flex justify-center gap-2 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  className="w-12 h-12 text-center text-xl font-bold bg-white border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-colors disabled:bg-gray-50 disabled:opacity-50"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Clock size={16} className="mr-1" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <button
                onClick={handleResendCode}
                disabled={timeLeft > 0 || resendLoading}
                className={`text-sm font-semibold transition-colors ${
                  timeLeft > 0 || resendLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-600 hover:text-red-700"
                }`}
              >
                {resendLoading ? (
                  <Loader2 size={16} className="animate-spin mx-auto" />
                ) : (
                  "Resend Code"
                )}
              </button>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center">
                <AlertCircle size={20} className="text-red-600" />
                <span className="text-red-700 font-semibold text-sm ml-2">
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading || code.some((digit) => digit === "")}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
              loading || code.some((digit) => digit === "")
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 transform hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <RefreshCw size={20} className="animate-spin text-white" />
                <span className="text-white ml-2">Verifying...</span>
              </div>
            ) : (
              <span className="text-white">Verify & Complete Registration</span>
            )}
          </button>

          {/* Help Text */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Didn't receive the code? Check your spam folder or{" "}
              <button
                onClick={handleResendCode}
                disabled={timeLeft > 0 || resendLoading}
                className={`font-semibold ${
                  timeLeft > 0 || resendLoading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-600 hover:text-red-700"
                }`}
              >
                resend
              </button>
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 rounded-2xl p-4 mt-6 border border-blue-200">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle size={16} className="text-blue-600" />
            <span className="text-blue-800 font-semibold text-sm ml-2">
              Email Verification Required
            </span>
          </div>
          <p className="text-blue-600 text-xs text-center">
            You must verify your email before your account is created. Check
            your inbox for the 6-digit code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;

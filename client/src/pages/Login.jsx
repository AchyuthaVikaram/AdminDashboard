import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "../utils/constant";
import { showSuccessToast, showErrorToast } from "../utils/toastUtil";
import { useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger entrance animations
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      showErrorToast("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      showSuccessToast("Login successful");

      if (data.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/welcome");
      }
    } catch (err) {
      console.log(err);
      showErrorToast(err?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user?.role) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/welcome");
      }
    }
  }, [navigate]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)",
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating 3D Spheres - Now properly positioned and visible */}
        <div
          className="absolute w-80 h-80 rounded-full border border-white/30 animate-float-slow"
          style={{
            top: "5%",
            right: "5%",
            transform: `
        perspective(1000px) 
        rotateX(${mousePosition.y * 0.03}deg) 
        rotateY(${mousePosition.x * 0.03}deg)
        translateZ(${Math.sin(Date.now() * 0.001) * 10}px)
      `,
            transformStyle: "preserve-3d",
            animation: "float-slow 8s ease-in-out infinite",
          }}
        />

        <div
          className="absolute w-60 h-60 rounded-full border border-white/40 animate-float-medium"
          style={{
            bottom: "10%",
            left: "5%",
            transform: `
        perspective(1000px) 
        rotateX(${-mousePosition.y * 0.02}deg) 
        rotateY(${-mousePosition.x * 0.02}deg)
        translateZ(${Math.cos(Date.now() * 0.0015) * 8}px)
      `,
            transformStyle: "preserve-3d",
            animation: "float-medium 6s ease-in-out infinite reverse",
          }}
        />

        {/* Additional smaller accent circles */}
        <div
          className="absolute w-32 h-32 rounded-full border border-white/20"
          style={{
            top: "70%",
            right: "15%",
            transform: `
        perspective(1000px) 
        rotateX(${mousePosition.y * 0.01}deg) 
        rotateY(${mousePosition.x * 0.01}deg)
      `,
            transformStyle: "preserve-3d",
            animation: "float-slow 10s ease-in-out infinite",
          }}
        />

        <div
          className="absolute w-24 h-24 rounded-full border border-white/10"
          style={{
            top: "20%",
            left: "15%",
            transform: `
        perspective(1000px) 
        rotateX(${-mousePosition.y * 0.015}deg) 
        rotateY(${-mousePosition.x * 0.015}deg)
      `,
            transformStyle: "preserve-3d",
            animation: "float-medium 12s ease-in-out infinite reverse",
          }}
        />

        {/* Subtle Particle System - Better positioned */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              top: `${15 + i * 12}%`,
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + (i % 2)}s`,
              transform: `translateZ(${i * 3}px)`,
              transformStyle: "preserve-3d",
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div
        className="w-full max-w-md sm:max-w-lg relative z-10"
        style={{
          transform: isVisible
            ? "translateY(0px) scale(1) rotateX(0deg)"
            : "translateY(30px) scale(0.95) rotateX(5deg)",
          opacity: isVisible ? 1 : 0,
          transition: "all 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Animated Header */}
        <div
          className="text-center mb-8"
          style={{
            transform: isVisible ? "translateY(0px)" : "translateY(-20px)",
            opacity: isVisible ? 1 : 0,
            transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s",
          }}
        >
          <h1
            className="text-3xl font-bold text-white mb-2 tracking-tight"
            style={{
              transform: isVisible ? "translateY(0px)" : "translateY(10px)",
              opacity: isVisible ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.4s",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              perspective: "1000px",
            }}
          >
            Welcome Back
          </h1>
          <p
            className="text-zinc-400 text-lg"
            style={{
              transform: isVisible ? "translateY(0px)" : "translateY(10px)",
              opacity: isVisible ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s",
            }}
          >
            Access your secure dashboard
          </p>
        </div>

        {/* Enhanced Login Form with 3D Depth */}
        <div
          className="bg-zinc-900/40 backdrop-blur-lg border border-zinc-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative group"
          style={{
            transform: isVisible
              ? `perspective(1000px) rotateX(${
                  mousePosition.y * 0.01
                }deg) rotateY(${mousePosition.x * 0.01}deg) translateZ(20px)`
              : "perspective(1000px) rotateX(10deg) rotateY(0deg) translateZ(0px)",
            opacity: isVisible ? 1 : 0,
            transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
            transformStyle: "preserve-3d",
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.8),
              0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `
              0 35px 70px -12px rgba(0, 0, 0, 0.9),
              0 0 0 1px rgba(255, 255, 255, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.15)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `
              0 25px 50px -12px rgba(0, 0, 0, 0.8),
              0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `;
          }}
        >
          {/* Animated Top Accent */}
          <div
            className="absolute top-0 left-1/2 h-0.5 bg-white/30 rounded-full"
            style={{
              width: isVisible ? "64px" : "0px",
              transform: "translateX(-50%)",
              transition: "width 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.8s",
              boxShadow: "0 0 20px rgba(255,255,255,0.3)",
            }}
          />

          <div className="space-y-7">
            {/* Email Field with Advanced Animation */}
            <div
              style={{
                transform: isVisible
                  ? "translateX(0px) rotateY(0deg)"
                  : "translateX(-50px) rotateY(-10deg)",
                opacity: isVisible ? 1 : 0,
                transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.6s",
                transformStyle: "preserve-3d",
              }}
            >
              <label className="text-sm font-medium text-zinc-300 mb-2 block">
                Email Address
              </label>
              <div
                className="relative group"
                style={{
                  transform:
                    focusedField === "email"
                      ? "perspective(1000px) rotateX(-2deg) translateZ(8px) scale(1.02)"
                      : "perspective(1000px) rotateX(0deg) translateZ(0px) scale(1)",
                  transformStyle: "preserve-3d",
                  transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <Mail
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-400 ${
                    focusedField === "email"
                      ? "text-white scale-110 drop-shadow-sm"
                      : "text-zinc-500 scale-100"
                  }`}
                  style={{
                    filter:
                      focusedField === "email"
                        ? "drop-shadow(0 0 8px rgba(255,255,255,0.3))"
                        : "none",
                  }}
                />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 focus:border-zinc-400 text-white placeholder:text-zinc-500 rounded-xl transition-all duration-400"
                  style={{
                    boxShadow:
                      focusedField === "email"
                        ? "0 8px 25px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,0.05)"
                        : "0 4px 12px rgba(0,0,0,0.2)",
                    transform:
                      focusedField === "email"
                        ? "translateZ(4px)"
                        : "translateZ(0px)",
                    transformStyle: "preserve-3d",
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            {/* Password Field with Advanced Animation */}
            <div
              style={{
                transform: isVisible
                  ? "translateX(0px) rotateY(0deg)"
                  : "translateX(50px) rotateY(10deg)",
                opacity: isVisible ? 1 : 0,
                transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.7s",
                transformStyle: "preserve-3d",
              }}
            >
              <label className="text-sm font-medium text-zinc-300 mb-2 block">
                Password
              </label>
              <div
                className="relative group"
                style={{
                  transform:
                    focusedField === "password"
                      ? "perspective(1000px) rotateX(-2deg) translateZ(8px) scale(1.02)"
                      : "perspective(1000px) rotateX(0deg) translateZ(0px) scale(1)",
                  transformStyle: "preserve-3d",
                  transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <Lock
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-400 ${
                    focusedField === "password"
                      ? "text-white scale-110 drop-shadow-sm"
                      : "text-zinc-500 scale-100"
                  }`}
                  style={{
                    filter:
                      focusedField === "password"
                        ? "drop-shadow(0 0 8px rgba(255,255,255,0.3))"
                        : "none",
                  }}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-11 pr-12 py-3 bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 focus:border-zinc-400 text-white placeholder:text-zinc-500 rounded-xl transition-all duration-400"
                  style={{
                    boxShadow:
                      focusedField === "password"
                        ? "0 8px 25px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px rgba(255,255,255,0.05)"
                        : "0 4px 12px rgba(0,0,0,0.2)",
                    transform:
                      focusedField === "password"
                        ? "translateZ(4px)"
                        : "translateZ(0px)",
                    transformStyle: "preserve-3d",
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-all duration-300"
                  style={{
                    transform: "scale(1)",
                    transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "scale(1.15) rotateZ(5deg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1) rotateZ(0deg)";
                  }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Enhanced Login Button with 3D Effect */}
            <div
              style={{
                transform: isVisible
                  ? "translateY(0px) scale(1)"
                  : "translateY(20px) scale(0.9)",
                opacity: isVisible ? 1 : 0,
                transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.8s",
              }}
            >
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-12 bg-white hover:bg-zinc-100 text-black font-semibold rounded-xl transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                style={{
                  boxShadow:
                    "0 8px 25px rgba(0,0,0,0.3), 0 3px 10px rgba(0,0,0,0.2)",
                  transformStyle: "preserve-3d",
                  transform: "translateZ(0px)",
                  transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform =
                      "translateZ(8px) translateY(-2px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 35px rgba(0,0,0,0.4), 0 5px 15px rgba(0,0,0,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateZ(0px) translateY(0px) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(0,0,0,0.3), 0 3px 10px rgba(0,0,0,0.2)";
                }}
                onMouseDown={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform =
                      "translateZ(2px) translateY(0px) scale(0.98)";
                  }
                }}
                onMouseUp={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform =
                      "translateZ(8px) translateY(-2px) scale(1.02)";
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                {isLoading ? (
                  <div className="flex items-center justify-center relative z-10">
                    <div
                      className="rounded-full h-4 w-4 border-2 border-zinc-700 border-t-transparent mr-3"
                      style={{
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center relative z-10">
                    <span className="mr-2">Sign In</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div
            className="text-center mt-6 pt-6 border-t border-zinc-800"
            style={{
              transform: isVisible ? "translateY(0px)" : "translateY(15px)",
              opacity: isVisible ? 1 : 0,
              transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 1s",
            }}
          >
            <p className="text-sm text-zinc-400">
              Need an account?{" "}
              <a
                href="/signup"
                className="text-white hover:text-zinc-300 font-medium transition-all duration-300 relative inline-block"
                style={{
                  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-1px) scale(1.05)";
                  e.currentTarget.style.textShadow =
                    "0 2px 8px rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px) scale(1)";
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div
          className="mt-6 text-center"
          style={{
            transform: isVisible ? "translateY(0px)" : "translateY(20px)",
            opacity: isVisible ? 1 : 0,
            transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1) 1.1s",
          }}
        >
          <p className="text-xs text-zinc-600">
            Trusted by professionals worldwide
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotateZ(0deg);
          }
          50% {
            transform: translateY(-20px) rotateZ(2deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotateZ(0deg);
          }
          50% {
            transform: translateY(-15px) rotateZ(-1deg);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;

import React, { useEffect, useRef, useState } from "react";
import shopHeroImg from "../assets/shop-hero-img.png";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  ArrowBigDown,
  ArrowDown,
} from "lucide-react";

const ShopHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const statsRef = useRef(null);
  const imageRef = useRef(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Parallax effect for image
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!imageRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const moveX = (clientX / innerWidth - 0.5) * 20;
      const moveY = (clientY / innerHeight - 0.5) * 20;

      imageRef.current.style.transform = `
        perspective(1000px)
        rotateX(${moveY * 0.5}deg)
        rotateY(${moveX * 0.5}deg)
        translate3d(${moveX * 0.5}px, ${moveY * 0.5}px, 0)
      `;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animated numbers for stats
  const AnimatedNumber = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      if (isVisible && !hasAnimated) {
        setHasAnimated(true);
        let start = 0;
        const end = parseInt(value.replace(/[^0-9]/g, ""));
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);

        return () => clearInterval(timer);
      }
    }, [isVisible, value, duration, hasAnimated]);

    return (
      <span>
        {value.includes("+")
          ? `${count.toLocaleString()}+`
          : value.includes("%")
          ? `${count}%`
          : value}
      </span>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-[#0B0B0D] via-[#121218] to-[#0B0B0D] text-white flex items-center overflow-hidden "
    >
      {/* Animated background elements - MORE SPREAD OUT AND DILATED */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary blobs - spread to corners */}
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-yellow-400/7 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[120px] animate-pulse delay-700" />

        {/* Secondary blobs - more spread out */}
        <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-purple-400/4 rounded-full blur-[100px] animate-pulse delay-300" />
        <div className="absolute bottom-1/3 -left-20 w-[600px] h-[600px] bg-cyan-400/3 rounded-full blur-[100px] animate-pulse delay-500" />

        {/* Corner accent blobs */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-yellow-400/3 rounded-full blur-[80px] animate-pulse delay-900" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-400/4 rounded-full blur-[80px] animate-pulse delay-1100" />

        {/* Center glow - more dilated */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-yellow-400/8 via-transparent to-blue-400/8 rounded-full blur-[150px] opacity-40" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-24 pt-28 lg:px-20 grid lg:grid-cols-2 gap-20 z-10">
        {/* LEFT */}
        <div
          className={`flex flex-col justify-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Heading with gradient */}
          <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-yellow-400">
              Discover
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-white animate-gradient">
              Industrial-Grade
            </span>
            <br />
            <span className="text-4xl lg:text-5xl font-light">
              Tape Solutions
            </span>
          </h1>

          {/* Subtitle with icon */}
          <div className="flex items-start gap-3 mb-10">
            <Zap className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: "rgb(1, 160, 242)" }}/>
            <p className="text-gray-300 text-xl max-w-lg leading-relaxed">
              <span
                className="font-semibold"
                style={{ color: "rgb(1, 160, 242)" }}
              >
                Built to stick. Made to last.
              </span>{" "}
              From packaging tape to industrial adhesives, our catalog delivers
              unmatched strength, durability, and performance for every
              application.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button className="group relative bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 px-10 rounded-xl hover:shadow-2xl hover:shadow-yellow-400/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-3 text-lg">
                <ArrowDown className="w-5 h-5" />
                Find Your Tape
              </span>
            </button>
          </div>

          {/* Enhanced Stats with icons */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10"
          >
            {[
              {
                statistic: "10K+",
                title: "Premium Products",
                icon: Zap,
                color: "text-yellow-400",
              },
              {
                statistic: "98%",
                title: "Customer Satisfaction",
                icon: Shield,
                color: "text-green-400",
              },
              {
                statistic: "24/7",
                title: "Expert Support",
                icon: Sparkles,
                color: "text-blue-400",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`transform transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: `${i * 200 + 500}ms` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                    {item.statistic}
                  </div>
                </div>
                <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                  {item.title}
                </div>
                <div className="h-0.5 w-8 bg-gradient-to-r from-yellow-400/50 to-transparent mt-3" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT - Enhanced Image Container */}
        <div className="relative">
          <div
            ref={imageRef}
            className="relative overflow-hidden transition-transform duration-300 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
            }}
          >
            <img
              src={shopHeroImg}
              alt="Premium Product Showcase"
              className="w-full h-[600px] object-cover scale-105 hover:scale-100 transition-transform duration-700"
            />
          </div>

          {/* Enhanced Discount Badge */}

          <div
            style={{ color: "rgb(1, 160, 242)" }}
            className="absolute top-10 right-10 bg-gradient-to-br  text-black font-black px-6 py-3 rounded-xl shadow-2xl shadow-blue-400/40 animate-bounce-slow hover:animate-none hover:scale-110 transition-transform duration-300"
          >
            <div className="text-sm">LIMITED TIME</div>
            <div className="text-2xl">30% OFF</div>
            <div className="text-[10px] opacity-90">Use code: PREMIUM30</div>
          </div>

          {/* Floating Elements - More spread out */}
          <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-blue-400/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 -left-20 w-[400px] h-[400px] bg-yellow-400/6 rounded-full blur-[80px]" />
          <div className="absolute -top-10 right-1/3 w-[300px] h-[300px] bg-purple-400/5 rounded-full blur-[60px]" />
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
};

export default ShopHero;

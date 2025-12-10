import { useState, useEffect, useRef } from "react";
import {
  Package,
  Truck,
  Shield,
  Zap,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import DealerModal from "./components/DealerModal";
import heroImage from "./assets/hero-img.png";
import logoNoText from "./assets/logo-notext.png";
import packagingTape from "./assets/packaging-tape.jpg";
import maskingTape from "./assets/masking-tape.jpg";
import doubleSidedTape from "./assets/double-sided-tape.jpg";
import electricalTape from "./assets/electrical-tape.jpeg";
import ductTape from "./assets/duct-tape.jpg";
import specialtyTape from "./assets/specialty-tape.png";
import "./index.css";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoFadedOut, setLogoFadedOut] = useState(false);

  const logoWrapperRef = useRef(null);
  const heroContentRef = useRef(null);

  const navigate = useNavigate();

  // Scroll-based animations (logo intro + hero fade-in) WITHOUT React re-render
  useEffect(() => {
    const logoEl = logoWrapperRef.current;
    const heroEl = heroContentRef.current;

    if (!logoEl && !heroEl) return;

    let ticking = false;
    let logoHidden = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset || 0;

        // Logo intro scale + fade
        if (logoEl && !logoHidden) {
          const scale = Math.max(0, 1 - y / 750);
          const opacity = Math.max(0, 1 - y / 700);

          logoEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
          logoEl.style.opacity = String(opacity);
        }

        // Hero section fade-in
        if (heroEl) {
          const heroOpacity = Math.min(1, y / 500);
          heroEl.style.opacity = String(heroOpacity);
        }

        // Once past threshold: collapse intro block and stop listening
        if (!logoHidden && y > 750) {
          logoHidden = true;
          setLogoFadedOut(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
          window.removeEventListener("scroll", onScroll);
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initialize on first render
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // IntersectionObserver for scroll-in animations (one-shot)
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-visible");
          // stop observing once animated – big perf win
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const products = [
    {
      title: "Packaging Tape",
      image: packagingTape,
      description: "Heavy-duty sealing solutions for secure packaging",
      features: ["Clear & Brown", "Multiple Widths", "Strong Adhesion"],
    },
    {
      title: "Masking Tape",
      image: maskingTape,
      description: "Perfect for painting, crafts, and delicate surfaces",
      features: ["Easy Removal", "Various Colors", "Professional Grade"],
    },
    {
      title: "Double-Sided Tape",
      image: doubleSidedTape,
      description: "Invisible bonding for mounting and crafting",
      features: ["Foam & Film Options", "Permanent Bond", "Indoor & Outdoor"],
    },
    {
      title: "Electrical Tape",
      image: electricalTape,
      description: "Insulating tape for electrical applications",
      features: ["Multiple Colors", "Weather Resistant", "UL Listed"],
    },
    {
      title: "Duct Tape",
      image: ductTape,
      description: "Heavy-duty tape for repairs and construction",
      features: ["Extra Strong", "Waterproof", "Multi-Purpose"],
    },
    {
      title: "Specialty Tapes",
      image: specialtyTape,
      description: "Custom solutions for unique applications",
      features: ["Custom Sizes", "Branded Options", "Industry Specific"],
    },
  ];

  const whyUsFeatures = [
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description:
        "All products meet the highest industry standards and come with our quality guarantee",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Quick turnaround times with reliable shipping to keep your business running",
    },
    {
      icon: Zap,
      title: "Competitive Pricing",
      description:
        "Wholesale prices that help maximize your profit margins without compromising quality",
    },
    {
      icon: Package,
      title: "Vast Selection",
      description:
        "Extensive inventory with multiple sizes, colors, and types to meet any requirement",
    },
  ];

  const navLinks = [
    { name: "Products", endpoint: "#products" },
    { name: "Why Us", endpoint: "#why-us" },
    { name: "Wholesale", endpoint: "#wholesale" },
  ];

  const navigateTo = (endpoint) => {
    navigate(endpoint);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <main className="bg-black">
      {/* Intro logo scroll animation section */}
      <div
        className="relative bg-black z-50 pointer-events-none transition-all duration-1000 ease-in-out"
        style={{
          height: logoFadedOut ? "0vh" : "250vh",
        }}
      >
        <div
          ref={logoWrapperRef}
          id="logo-wrapper"
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <div className="relative">
            <img
              src={logoNoText}
              alt="AdheroTape Logo"
              className="w-[35vw] max-w-[450px] mx-auto relative z-20 drop-shadow-[0_8px_40px_rgba(0,0,0,1)]"
            />
            <h1 className="text-[35vw] md:text-[25vw] lg:text-[16vw] font-extrabold leading-tight text-yellow-400 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1">
              ADHERO
            </h1>
            <h1 className="text-[25vw] md:text-[15vw] lg:text-[12vw] font-extrabold leading-tight text-white absolute top-72 left-1/2 -translate-x-1/2 z-1">
              TAPE
            </h1>
          </div>
        </div>
      </div>

      <div className="bg-black text-white overflow-x-hidden">
        {/* HEADER */}

        <Header navLinks={navLinks} showShop={true} />

        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
            <img
              src={heroImage}
              alt="Professional tape products"
              className="w-full h-100 object-cover mt-5"
              style={{ opacity: 0.5 }}
            />
          </div>

          {/* Fire Particles Container */}
          <div className="absolute bottom-0 left-0 right-0 h-96 z-10 pointer-events-none overflow-hidden">
            {/* Embers */}
            {[...Array(10)].map((_, i) => (
              <div
                key={`ember-${i}`}
                className="absolute w-1 h-1 rounded-full animate-ember"
                style={{
                  left: `${10 + i * 8}%`,
                  background:
                    "radial-gradient(circle, rgba(255,200,100,0.7) 0%, rgba(255,150,50,0.5) 50%, transparent 80%)",
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${5 + Math.random() * 2}s`,
                  bottom: "-15px",
                  opacity: 0.3 + Math.random() * 0.3,
                  boxShadow: "0 0 4px rgba(255, 150, 50, 0.4)",
                }}
              />
            ))}

            {/* Sparks */}
            {[...Array(20)].map((_, i) => (
              <div
                key={`spark-${i}`}
                className="absolute w-[2px] h-[2px] rounded-full animate-spark"
                style={{
                  left: `${Math.random() * 100}%`,
                  background:
                    "radial-gradient(circle, rgba(255,255,220,0.8) 0%, rgba(255,200,100,0.5) 60%, transparent 90%)",
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 1.5}s`,
                  bottom: "0px",
                  opacity: 0.2 + Math.random() * 0.2,
                  boxShadow: "0 0 3px rgba(255, 220, 100, 0.3)",
                }}
              />
            ))}
          </div>

          <div
            ref={heroContentRef}
            id="hero-content"
            className="relative z-20 container mx-auto px-6 text-center transition-opacity duration-700"
            style={{ opacity: 0 }}
          >
            <div className="animate-on-scroll opacity-0 translate-y-10">
              <h1 className="text-xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Tape for All Terrain</span>
              </h1>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                <span className="text-yellow-400">Even When It Rains</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Premium quality tapes for every application. From
                industrial-grade to everyday use, we've got you covered with
                sizes and colors to match any need.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="
    bg-yellow-500 text-black px-10 py-4 rounded-full font-bold text-lg
    transition-all duration-300 ease-out
    hover:bg-yellow-400 hover:scale-105 hover:shadow-yellow-500/70
    shadow-lg shadow-yellow-500/50
  "
                >
                  Become a Dealer or Wholesaler
                </button>

                <a
                  href="#products"
                  className="
    btn-glass text-white px-10 py-4 rounded-full font-bold text-lg
    border border-white/30
    transition-[transform,background-color,box-shadow] duration-300 ease-out
    hover:bg-white/20 hover:scale-105 hover:shadow-white/30
  "
                >
                  Explore Products
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* OUR PRODUCTS */}
        <section
          id="products"
          className="py-24 bg-gradient-to-b from-black to-zinc-900"
        >
          <div className="container mx-auto px-20">
            <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10">
              <h2 className="text-5xl font-bold mb-4">
                <span className="text-yellow-400">Our</span> Products
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover our extensive range of high-quality adhesive tapes
                designed for every industry and application
              </p>
              <button
                onClick={() => navigateTo("/shop")}
                className="
    bg-yellow-500 mt-5 text-black px-10 py-4 rounded-full font-bold text-lg
    transition-all duration-300 ease-out
    hover:bg-yellow-400 hover:scale-105 hover:shadow-yellow-500/70
    shadow-lg shadow-yellow-500/50
  "
              >
                Shop Now
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.title}
                  className="group animate-on-scroll product-card opacity-0 translate-y-10"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative bg-gradient-to-br from-zinc-800/40 to-zinc-900/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-zinc-700/50 hover:border-yellow-500/40 smooth-card gpu-card product-card-inner">
                    {/* Animated border glow */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Image container */}
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-purple-500/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-500" />
                    </div>

                    {/* Content */}
                    <div className="relative p-6 bg-gradient-to-b from-zinc-900/70 to-zinc-900/50">
                      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:via-yellow-300 transition-all duration-500">
                        {product.title}
                      </h3>

                      <p className="text-gray-300/80 mb-6 group-hover:text-gray-200 transition-colors duration-500 leading-relaxed">
                        {product.description}
                      </p>

                      <ul className="space-y-3">
                        {product.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-gray-300 group-hover:text-gray-200 transition-colors duration-500"
                          >
                            <div className="relative flex-shrink-0 mt-0.5">
                              <CheckCircle
                                size={18}
                                className="text-yellow-400 transform group-hover:scale-110 transition-transform duration-300 group-hover:text-yellow-300"
                              />
                              <div className="absolute -inset-1 bg-yellow-400/20 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
                            </div>
                            <span className="relative overflow-hidden">
                              {feature}
                              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-500 ease-out" />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent group-hover:w-4/5 transition-all duration-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section
          id="why-us"
          className="py-24 bg-zinc-900 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)",
              }}
            />
          </div>

          <div className="container mx-auto px-20 relative z-10">
            <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10">
              <h2 className="text-5xl font-bold mb-4">
                Why Choose <span className="text-yellow-400">AdheroTape</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                We're not just selling tape - we're providing adhesive solutions
                that stick with you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyUsFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="animate-on-scroll opacity-0 translate-y-10 text-center group"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="feature-card relative overflow-hidden bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 hover:scale-[1.02] shadow-2xl shadow-black/30 smooth-card gpu-card feature-card-inner">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />

                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500/15 to-yellow-600/10 rounded-full mb-6 group-hover:from-yellow-500/25 group-hover:to-yellow-600/20 transition-colors duration-500 shadow-lg shadow-yellow-500/10 group-hover:shadow-yellow-500/20 border border-yellow-500/20 icon-glass">
                        <feature.icon
                          className="text-yellow-300 group-hover:text-yellow-200 transition-colors duration-500 group-hover:scale-110"
                          size={36}
                        />
                      </div>

                      <h3 className="text-xl font-bold mb-4 text-yellow-300 group-hover:text-yellow-200 transition-colors duration-500 bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                        {feature.title}
                      </h3>

                      <p className="text-gray-300/90 group-hover:text-gray-200 transition-colors duration-500 leading-relaxed">
                        {feature.description}
                      </p>

                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-yellow-500/50" />
                    </div>

                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-500/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHOLESALE */}
        <section
          id="wholesale"
          className="py-24 bg-gradient-to-b from-zinc-900 to-black relative"
        >
          <div className="container mx-auto px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-on-scroll opacity-0 -translate-x-10">
                <h2 className="text-5xl font-bold mb-6">
                  <span className="text-yellow-400">Retail & Wholesale</span>
                  <br />
                  Solutions
                </h2>
                {/* <p className="text-xl text-gray-400 mb-8">
                  Whether you're a small business or a large distributor, we
                  have the perfect partnership model for you. Join our network
                  of satisfied dealers and wholesalers across the country.
                </p> */}

                <div className="space-y-6 mb-8">
                  {[
                    "Competitive wholesale pricing with volume discounts",
                    "Flexible minimum order quantities",
                    "Fast order processing and reliable delivery",
                    "Custom packaging and branding options available",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle
                        className="text-yellow-400 flex-shrink-0 mt-1"
                        size={24}
                      />
                      <p className="text-gray-300 text-lg">{benefit}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="
    bg-yellow-500 text-black px-10 py-4 rounded-full font-bold text-lg
    transition-[transform,background-color,box-shadow] duration-300 ease-out
    hover:bg-yellow-400 hover:scale-105 hover:shadow-yellow-500/70
    shadow-lg shadow-yellow-500/50
  "
                >
                  Apply Now
                </button>
              </div>

              <div className="animate-on-scroll opacity-0 translate-x-10 smooth-card gpu-card">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Warehouse with tape products"
                    className="rounded-lg shadow-2xl border border-yellow-500/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/70 backdrop-blur-sm p-6 rounded-lg border border-yellow-500/30">
                      <p className="text-yellow-400 font-bold text-lg mb-2">
                        Join us now
                      </p>
                      <p className="text-gray-300">
                        Trusted by businesses nationwide for quality and
                        reliability
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-black">
          <div className="container mx-auto px-20">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-12 md:p-16 text-center animate-on-scroll opacity-0 scale-95 shadow-2xl shadow-yellow-500/30 smooth-card gpu-card">
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Ready to Stick with the Best?
              </h2>
              <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
                Join the AdheroTape family today and experience the difference
                quality makes
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="
    bg-black text-yellow-400 px-10 py-4 rounded-full font-bold text-lg
    transition-[transform,background-color,box-shadow] duration-300 ease-out
    hover:bg-zinc-900 hover:scale-105 hover:shadow-yellow-500/40
    shadow-lg
  "
              >
                Become a Dealer or Wholesaler
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}

        <Footer showQuickLinks={true} />

        <DealerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </main>
  );
}

export default LandingPage;

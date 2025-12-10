import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import { Package, Truck, Shield, Zap, CheckCircle } from "lucide-react";
import DealerModal from "./components/DealerModal";
import heroImage from "./assets/hero-img.png";
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
  const navigate = useNavigate();

  // Reduced particle count for performance
  const particleCount = 5;
  const sparkCount = 10;

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

  // Simplified animation variants for better performance
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const cardHover = {
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  // Optimized TextReveal component
  const TextReveal = ({ children, delay = 0 }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, {
      once: true,
      amount: 0.1,
      margin: "50px",
    });

    useEffect(() => {
      if (isInView) {
        controls.start("visible");
      }
    }, [controls, isInView]);

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.4,
              delay: delay,
              ease: "easeOut",
            },
          },
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <main className="bg-gradient-to-br from-[#0B0B0D] via-[#121218] to-[#0B0B0D] ">
      <div className="bg-gradient-to-br from-[#0B0B0D] via-[#121218] to-[#0B0B0D]  text-white overflow-x-hidden flex flex-col items-center">
        {/* HEADER */}
        <Header navLinks={navLinks} showShop={true} />

        {/* HERO */}
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
            <img
              src={heroImage}
              alt="Professional tape products"
              className="w-full h-100 object-cover mt-5"
              style={{ opacity: 0.5 }}
            />
          </div>

          {/* Simplified Fire Particles Container */}
          <div className="absolute bottom-0 left-0 right-0 h-96 z-10 pointer-events-none overflow-hidden">
            {/* Static particles with CSS animations instead of framer-motion */}
            {/* Static particles with CSS animations instead of framer-motion */}
            {[...Array(particleCount)].map((_, i) => (
              <div
                key={`ember-${i}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${10 + i * 18}%`,
                  background:
                    "radial-gradient(circle, rgba(255,200,100,0.7) 0%, rgba(255,150,50,0.5) 50%, transparent 80%)",
                  animation: `ember ${4 + Math.random() * 2}s linear infinite`, // CHANGE: ember instead of floatUp
                  animationDelay: `${i * 0.3}s`,
                  bottom: "-15px",
                  opacity: 0.3 + Math.random() * 0.3,
                }}
              />
            ))}

            {/* Static sparks */}
            {[...Array(sparkCount)].map((_, i) => (
              <div
                key={`spark-${i}`}
                className="absolute w-[2px] h-[2px] rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  background:
                    "radial-gradient(circle, rgba(255,255,220,0.8) 0%, rgba(255,200,100,0.5) 60%, transparent 90%)",
                  animation: `spark ${
                    1.5 + Math.random() * 1
                  }s linear infinite`, // CHANGE: spark instead of sparkle
                  animationDelay: `${Math.random() * 2}s`,
                  bottom: "0px",
                  opacity: 0.15 + Math.random() * 0.1,
                }}
              />
            ))}
          </div>

          <div className="relative z-20 container mx-auto px-6 text-center">
            <TextReveal>
              <h1 className="text-xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Tape for All Terrain</span>
              </h1>
            </TextReveal>

            <TextReveal delay={0.1}>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                <span className="text-yellow-400">Even When It Rains</span>
              </h1>
            </TextReveal>

            <TextReveal delay={0.2}>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                Premium quality tapes for every application. From
                industrial-grade to everyday use, we've got you covered with
                sizes and colors to match any need.
              </p>
            </TextReveal>

            <TextReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-yellow-500 text-black px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-yellow-500/50 hover:bg-yellow-400 transition-colors duration-200"
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Become a Dealer or Wholesaler
                </motion.button>

                <motion.a
                  href="#products"
                  className="btn-glass text-white px-10 py-4 rounded-full font-bold text-lg border border-white/30 hover:bg-white/10 transition-colors duration-200"
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore Products
                </motion.a>
              </div>
            </TextReveal>
          </div>
        </section>

        {/* OUR PRODUCTS */}
        <motion.section
          id="products"
          className="py-24 bg-gradient-to-b from-black to-zinc-900"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-20">
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-5xl font-bold mb-4">
                <span className="text-yellow-400">Our</span> Products
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover our extensive range of high-quality adhesive tapes
                designed for every industry and application
              </p>
              <motion.button
                onClick={() => navigate("/shop")}
                className="bg-yellow-500 mt-5 text-black px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-yellow-500/50 hover:bg-yellow-400 transition-colors duration-200"
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{ scale: 0.98 }}
              >
                Shop Now
              </motion.button>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.title}
                  className="group product-card"
                  variants={fadeIn}
                  whileHover="hover"
                >
                  <motion.div
                    className="relative bg-gradient-to-br from-zinc-800/40 to-zinc-900/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-zinc-700/50 hover:border-yellow-500/40 smooth-card gpu-card product-card-inner"
                    variants={cardHover}
                  >
                    {/* Animated border glow */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Image container */}
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-purple-500/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-300" />
                    </div>

                    {/* Content */}
                    <div className="h-[300px] relative p-6 bg-gradient-to-b from-zinc-900/70 to-zinc-900/50">
                      <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:via-yellow-300 transition-all duration-300">
                        {product.title}
                      </h3>

                      <p className="text-gray-300/80 mb-6 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                        {product.description}
                      </p>

                      <ul className="space-y-3">
                        {product.features.map((feature, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-gray-300 group-hover:text-gray-200 transition-colors duration-300"
                          >
                            <div className="relative flex-shrink-0 mt-0.5">
                              <CheckCircle
                                size={18}
                                className="text-yellow-400 transform group-hover:scale-105 transition-transform duration-200 group-hover:text-yellow-300"
                              />
                              <div className="absolute -inset-1 bg-yellow-400/20 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                            </div>
                            <span className="relative overflow-hidden">
                              {feature}
                              <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300 ease-out" />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent group-hover:w-4/5 transition-all duration-500" />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* WHY US */}
        <motion.section
          id="why-us"
          className="py-24 bg-zinc-900 relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
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
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-5xl font-bold mb-4">
                Why Choose{" "}
                <span style={{ color: "rgb(1, 160, 242)" }}>AdheroTape</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                We're not just selling tape - we're providing adhesive solutions
                that stick with you
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
            >
              {whyUsFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="text-center group"
                  variants={scaleIn}
                  whileHover={{
                    scale: 1.03,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="feature-card relative overflow-hidden bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 p-8 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 shadow-2xl shadow-black/30 smooth-card gpu-card feature-card-inner">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />

                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/15 to-blue-600/10 rounded-full mb-6 group-hover:from-blue-500/25 group-hover:to-blue-600/20 transition-colors duration-300 shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20 border border-blue-500/20 icon-glass">
                        <feature.icon
                          className="text-blue-300 group-hover:text-blue-200 transition-colors duration-300"
                          size={36}
                        />
                      </div>

                      <h3 className="text-xl font-bold mb-4 text-blue-300 group-hover:text-blue-200 transition-colors duration-300 bg-gradient-to-r from-blue-300 to-blue-400 bg-clip-text text-transparent">
                        {feature.title}
                      </h3>

                      <p className="text-gray-300/90 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                        {feature.description}
                      </p>

                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg shadow-blue-500/50" />
                    </div>

                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* WHOLESALE */}
        <motion.section
          id="wholesale"
          className="py-24 bg-gradient-to-b from-zinc-900 to-black relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={slideInLeft}>
                <h2 className="text-5xl font-bold mb-9">
                  <span style={{ color: "rgb(1, 160, 242)" }}>
                    Retail & Wholesale
                  </span>
                  <br />
                  Solutions
                </h2>

                <div className="space-y-6 mb-8">
                  {[
                    "Competitive wholesale pricing with volume discounts",
                    "Flexible minimum order quantities",
                    "Fast order processing and reliable delivery",
                    "Custom packaging and branding options available",
                  ].map((benefit, index) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle
                        className="flex-shrink-0 mt-1"
                        size={24}
                        color="rgb(1, 160, 242)"
                      />
                      <p className="text-gray-300 text-lg">{benefit}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="smooth-card gpu-card"
                variants={slideInRight}
              >
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Warehouse with tape products"
                    className="rounded-lg shadow-2xl border border-yellow-500/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/70 backdrop-blur-sm p-6 rounded-lg border border-blue-500/30">
                      <p
                        style={{ color: "rgb(1, 160, 242)" }}
                        className="font-bold text-lg mb-2"
                      >
                        Join us now
                      </p>
                      <p className="text-gray-300">
                        Trusted by businesses nationwide for quality and
                        reliability
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="py-24 bg-black w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="container mx-auto px-20">
            <motion.div
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-12 md:p-16 text-center shadow-2xl shadow-yellow-500/30 smooth-card gpu-card"
              whileHover={{
                scale: 1.01,
              }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Ready to Stick with the Best?
              </h2>
              <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
                Join the AdheroTape family today and experience the difference
                quality makes
              </p>
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-yellow-400 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-zinc-900 transition-colors duration-200"
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{ scale: 0.98 }}
              >
                Become a Dealer or Wholesaler
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

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

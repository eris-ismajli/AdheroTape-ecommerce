import React from "react";
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

const Footer = ({ showQuickLinks }) => {
  return (
    <footer id="contact" className="bg-black/20 py-12 md:py-16 border-t border-white/5 w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 mb-10 md:mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-yellow-400" size={28} md:size={32} />
              <h3 className="text-xl md:text-2xl font-bold text-yellow-400">
                AdheroTape
              </h3>
            </div>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Your trusted partner for premium adhesive solutions. Quality tapes for every application.
            </p>
          </div>

          {/* Quick Links Section */}
          {showQuickLinks && (
            <div className="md:col-span-1 lg:col-span-1">
              <h4 className="text-lg font-bold text-yellow-400 mb-4 md:mb-6">
                Quick Links
              </h4>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a
                    href="#products"
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm md:text-base"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="#why-us"
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm md:text-base"
                  >
                    Why Choose Us
                  </a>
                </li>
                <li>
                  <a
                    href="#wholesale"
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm md:text-base"
                  >
                    Wholesale
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setIsModalOpen && setIsModalOpen(true)}
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm md:text-base text-left"
                  >
                    Become a Dealer
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Contact Section */}
          <div className="md:col-span-1 lg:col-span-1">
            <h4 className="text-lg font-bold text-yellow-400 mb-4 md:mb-6">
              Contact Us
            </h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <Mail size={18} md:size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base break-words">
                  info@adherotape.com
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={18} md:size={20} className="text-yellow-400 flex-shrink-0" />
                <span className="text-sm md:text-base">
                  407 701 7409
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} md:size={20} className="text-yellow-400 flex-shrink-0 mt-1" />
                <span className="text-sm md:text-base leading-relaxed">
                  13790 Bridgewater Crossings Blvd<br />
                  Suite #1080<br />
                  Windermere, FL 34786
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-zinc-800 pt-6 md:pt-8">
          <p className="text-center text-gray-400 text-sm md:text-base">
            &copy; {new Date().getFullYear()} AdheroTape. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
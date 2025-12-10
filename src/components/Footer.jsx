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
    <footer id="contact" className="bg-zinc-950 py-16 border-t border-zinc-800">
      <div className="container mx-auto px-20">
        <div className="flex items-center justify-between gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-yellow-400" size={32} />
              <h3 className="text-2xl font-bold text-yellow-400">AdheroTape</h3>
            </div>
            <p className="text-gray-400">
              Your trusted partner for premium adhesive solutions. <br />{" "}
              Quality tapes for every application.
            </p>
          </div>

          {showQuickLinks && (
            <div>
              <h4 className="text-lg font-bold text-yellow-400 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#products"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="#why-us"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Why Choose Us
                  </a>
                </li>
                <li>
                  <a
                    href="#wholesale"
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Wholesale
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Become a Dealer
                  </button>
                </li>
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-lg font-bold text-yellow-400 mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <Mail size={20} className="text-yellow-400" />
                info@adherotape.com
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone size={20} className="text-yellow-400" />
                407 701 7409
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin size={20} className="text-yellow-400" />
                13790 Bridgewater Crossings Blvd <br />
                Suite #1080 Windermere, FL 34786
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AdheroTape. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

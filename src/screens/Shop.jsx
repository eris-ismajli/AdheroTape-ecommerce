import React, { useEffect, useState } from "react";
import "../index.css";

import { UserRound, ShoppingCart } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopHero from "../components/ShopHero";
import ProductsList from "../components/ProductsList";

const Shop = () => {
  const navLinks = [
    { name: "Home", endpoint: "/" },
    { name: "About", endpoint: "/" },
  ];
  const navButtons = [
    { name: "Profile", icon: UserRound },
    { name: "Cart", icon: ShoppingCart },
  ];

  const [isAsideSticky, setIsAsideSticky] = useState(false);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0D] via-[#121218] to-[#0B0B0D] z-0" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-yellow-400/7 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute scale-110 top-96 -right-40 w-[700px] h-[700px] bg-blue-400/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[100px] animate-pulse delay-300" />
        <div className="absolute bottom-1/3 -left-20 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[100px] animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-yellow-400/25 via-transparent to-blue-400/8 rounded-full blur-[150px] opacity-40" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 flex flex-col items-center justify-center ">
        <Header navLinks={navLinks} navButtons={navButtons} showSearch={true} isAsideSticky={isAsideSticky}/>
        <ShopHero />
        <ProductsList setIsAsideSticky={setIsAsideSticky}/>
        <Footer showQuickLinks={false} />
      </div>
    </div>
  );
};

export default Shop;

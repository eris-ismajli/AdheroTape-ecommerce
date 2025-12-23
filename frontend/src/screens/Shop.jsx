import React, { useEffect, useState } from "react";
import "../index.css";

import { UserRound, ShoppingCart, Heart, UserRoundCog } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopHero from "../components/ShopHero";
import ProductsList from "../components/ProductsList";
import { useSelector } from "react-redux";

const Shop = () => {
  const user = useSelector((state) => state.auth.user)
  const navLinks = [{ name: "About", endpoint: "/" }];
  const ProfileIcon = user?.role === "admin" ? UserRoundCog : UserRound

  const navButtons = [
    { name: "Wishlist", icon: Heart, endpoint: "/wishlist" },
    { name: "Cart", icon: ShoppingCart, endpoint: "/cart" },
    { name: "Profile", icon: ProfileIcon, endpoint: "/login" },
  ];

  const [isAsideSticky, setIsAsideSticky] = useState(false);

  return (
    <div className="relative">
      {/* <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B0D] via-[#121218] to-[#0B0B0D] z-0" /> */}
      <div className="absolute inset-0 bg-gray-950 z-0" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute scale-110 top-96 -right-40 w-[700px] h-[700px] bg-blue-400/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute scale-110 top-[800px] -left-40 w-[700px] h-[700px] bg-blue-400/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        <Header
          navLinks={navLinks}
          navButtons={navButtons}
          showSearch={true}
          isAsideSticky={isAsideSticky}
        />
        <ShopHero />
        <ProductsList setIsAsideSticky={setIsAsideSticky} />
        <Footer showQuickLinks={false} />
      </div>
    </div>
  );
};

export default Shop;

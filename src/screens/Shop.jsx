import React from "react";
import "../index.css"

import { UserRound, ShoppingCart } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopHero from "../components/ShopHero";
import ProductsList from "../components/ProductsList";

const Shop = () => {
  const navLinks = [{ name: "Home", endpoint: "/" }, {name: "About", endpoint: "/"}];
  const navButtons = [
    { name: "Profile", icon: UserRound },
    { name: "Cart", icon: ShoppingCart },
  ];
  return (
    <div className="bg-black">
      <Header navLinks={navLinks} navButtons={navButtons} />
      <ShopHero />
      <ProductsList />
      <Footer showQuickLinks={false} />
    </div>
  );
};

export default Shop;

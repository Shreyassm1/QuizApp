import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <div className="dashboard-container">
        <Dashboard />
      </div>
      <Footer />
    </div>
  );
};

export default Home;

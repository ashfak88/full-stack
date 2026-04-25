import React from "react";
import { motion } from "framer-motion";
import { FaCarSide, FaShippingFast, FaTools, FaSmile } from "react-icons/fa";
import Footer from "../components/Footer";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const About = () => {
  return (
    <>
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans overflow-hidden">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-6 drop-shadow-sm">
              Driven by Passion.
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              We bring you the hottest, sleekest, and most collectible Hot Wheels cars. 
              Experience fast shipping, unbeatable prices, and service you can trust.
            </p>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <motion.div 
            className="grid md:grid-cols-3 gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Card 1 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(234,88,12,0.15)] transition-all duration-300 border border-gray-100/50"
            >
              <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <FaCarSide className="text-orange-600 w-8 h-8" />
              </div>
              <h3 className="font-bold text-2xl text-gray-800 mb-3">Wide Collection</h3>
              <p className="text-gray-500 leading-relaxed">
                From rare editions to premium collectibles, we offer a massive range of authentic Hot Wheels to complete your ultimate garage.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(234,88,12,0.15)] transition-all duration-300 border border-gray-100/50"
            >
              <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <FaShippingFast className="text-orange-600 w-8 h-8" />
              </div>
              <h3 className="font-bold text-2xl text-gray-800 mb-3">Lightning Fast</h3>
              <p className="text-gray-500 leading-relaxed">
                We ship your products securely and rapidly so you can enjoy your collectibles without the agonizing wait.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(234,88,12,0.15)] transition-all duration-300 border border-gray-100/50"
            >
              <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <FaTools className="text-orange-600 w-8 h-8" />
              </div>
              <h3 className="font-bold text-2xl text-gray-800 mb-3">Premium Quality</h3>
              <p className="text-gray-500 leading-relaxed">
                Every single item is inspected carefully. We guarantee you receive only the best, mint-condition Hot Wheels.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-red-500 rounded-[2rem] transform rotate-3 scale-105 opacity-20 blur-lg"></div>
              <img
                src="https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80"
                alt="Hot Wheels Collection"
                className="relative rounded-[2rem] shadow-2xl object-cover w-full h-full aspect-[4/3] border-4 border-white"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
                Our <span className="text-orange-600">Mission</span>
              </h2>
              <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-8"></div>
              <p className="text-gray-600 leading-loose text-lg mb-6">
                Our goal is simple: deliver the absolute best Hot Wheels shopping experience on the internet. 
              </p>
              <p className="text-gray-600 leading-loose text-lg">
                Whether you're a hardcore collector, a casual fan, or buying a gift for someone special, we ensure that every purchase is seamless, secure, and incredibly fast. We share your passion for the track.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Social Proof Banner */}
        <section className="py-20 px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-5xl mx-auto bg-gradient-to-br from-orange-600 to-red-700 rounded-[3rem] p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange-400 opacity-20 blur-3xl"></div>

            <FaSmile className="w-16 h-16 mx-auto mb-6 text-orange-200 relative z-10" />
            <h3 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">
              Collectors Love Us!
            </h3>
            <p className="text-orange-100 text-xl max-w-2xl mx-auto relative z-10">
              With thousands of satisfied customers, we are proud to be the trusted hub for Hot Wheels enthusiasts nationwide.
            </p>
          </motion.div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default About;

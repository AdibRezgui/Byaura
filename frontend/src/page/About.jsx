import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="text-gray-800 bg-gradient-to-b from-white via-gray-50 to-gray-100">
      {/* ABOUT US Section */}
      <div className="text-3xl text-center pt-12 border-t border-gray-200">
        <Title text1="ABOUT" text2="US" />
      </div>

      <div className="my-14 flex flex-col md:flex-row items-center justify-center gap-16 md:w-[90%] w-[95%] mx-auto">
        {/* Image Section */}
        <div className="relative group">
          <img
            src={assets.aboutcover}
            alt="About us"
            className="w-full md:max-w-[450px] rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-black/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center gap-6 md:w-2/4 leading-relaxed">
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-gray-900">Forever</span> was
            born out of a passion for innovation and a desire to revolutionize
            the way people shop online. Our journey began with a simple idea: to
            create a platform where customers can easily discover, explore, and
            purchase products from the comfort of their homes.
          </p>

          <p className="text-gray-700 text-lg">
            Since our inception, we’ve worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference — from fashion and beauty to electronics and home
            essentials.
          </p>

          <div className="mt-4">
            <b className="text-xl text-gray-900">Our Mission</b>
            <p className="text-gray-700 mt-2 text-lg">
              Our mission at Forever is to empower customers with choice,
              convenience, and confidence. We’re dedicated to providing a
              seamless shopping experience that exceeds expectations — from
              browsing and ordering to delivery and beyond.
            </p>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US Section */}
      <div className="text-2xl text-center py-6">
        <Title text1="WHY" text2="CHOOSE US" />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20 md:w-[90%] w-[95%] mx-auto gap-6">
        {[
          {
            title: "Quality Assurance",
            desc: "We meticulously select and vet each product to ensure it meets our highest quality standards.",
          },
          {
            title: "Convenience",
            desc: "Our user-friendly interface and hassle-free ordering process make shopping effortless and enjoyable.",
          },
          {
            title: "Exceptional Service",
            desc: "Our dedicated support team ensures your satisfaction, offering assistance every step of the way.",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex-1 border border-gray-200 bg-white p-10 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <b className="block text-lg text-gray-900 mb-2">{item.title}</b>
            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;

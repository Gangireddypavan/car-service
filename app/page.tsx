"use client"; // This is a Client Component

import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">

      {/* Header */}
      <header className="w-full bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Car Mechanic App</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link></li>
              <li><Link href="/book-service" className="text-gray-700 hover:text-blue-600">Book Service</Link></li>
              <li><Link href="/select-service" className="text-gray-700 hover:text-blue-600">Services</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20 text-center flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Your Car, Our Care, Anywhere.
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
            Expert car mechanic services delivered right to your doorstep.
          </p>
          <Link href="/book-service" className="inline-block bg-white text-blue-600 text-xl font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-gray-100 transition duration-300">
            Book Service Now
          </Link>
        </div>
      </section>

      {/* Popular Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Our Popular Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="text-blue-600 text-5xl mb-4">⚙️</div> {/* Icon placeholder */}
              <h3 className="text-xl font-semibold mb-2">General Service</h3>
              <p className="text-gray-700">Routine check-ups and maintenance.</p>
            </div>
            {/* Service Card 2 */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="text-blue-600 text-5xl mb-4">🔋</div> {/* Icon placeholder */}
              <h3 className="text-xl font-semibold mb-2">Battery Replacement</h3>
              <p className="text-gray-700">Quick and reliable battery services.</p>
            </div>
            {/* Service Card 3 */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="text-blue-600 text-5xl mb-4"> टायर</div> {/* Icon placeholder */}
              <h3 className="text-xl font-semibold mb-2">Flat Tyre Repair</h3>
              <p className="text-gray-700">On-the-spot tyre puncture repairs.</p>
            </div>
            {/* Service Card 4 */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="text-blue-600 text-5xl mb-4">🛢️</div> {/* Icon placeholder */}
              <h3 className="text-xl font-semibold mb-2">Oil Change</h3>
              <p className="text-gray-700">Engine oil and filter replacement.</p>
            </div>
            {/* Service Card 5 */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="text-blue-600 text-5xl mb-4">🚨</div> {/* Icon placeholder */}
              <h3 className="text-xl font-semibold mb-2">Brake Inspection</h3>
              <p className="text-gray-700">Thorough brake system checks.</p>
            </div>
            {/* Service Card 6 */}
            <div className="bg-gray-100 p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300">
              <div className="text-blue-600 text-5xl mb-4">❄️</div> {/* Icon placeholder */}
              <h3 className="text-xl font-semibold mb-2">AC Service</h3>
              <p className="text-gray-700">Air conditioning system repair and refill.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-lg">
              <div className="text-blue-600 text-5xl mb-4">1️⃣</div> {/* Icon placeholder */}
              <h3 className="text-xl font-semibold mb-2">Book Online</h3>
              <p className="text-gray-700">Select your service, date, and time.</p>
            </div>
            {/* Step 2 */}
            <div className="p-6 rounded-lg">
              <div className="text-blue-600 text-5xl mb-4">📍</div> {/* Icon placeholder */}
              <h3 className="text-xl font-semibold mb-2">Share Location</h3>
              <p className="text-gray-700"> Well find the nearest mechanic for you.</p>
            </div>
            {/* Step 3 */}
            <div className="p-6 rounded-lg">
              <div className="text-blue-600 text-5xl mb-4">🛠️</div> {/* Icon placeholder */}
              <h3 className="text-xl font-semibold mb-2">Service at Doorstep</h3>
              <p className="text-gray-700">Our expert mechanic arrives and fixes your car.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white p-8 text-center">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Car Mechanic App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

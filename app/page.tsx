"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  Battery,
  Disc,
  Droplet,
  Activity,
  Thermometer,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Star,
  ShieldCheck,
  Clock
} from "lucide-react";
import clsx from "clsx";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">

      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-background to-background dark:from-blue-900/20"></div>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
              <Star className="w-3 h-3 fill-current" />
              <span>Premium Car Care</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Expert Mechanics, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Delivered to You.
              </span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the future of car maintenance. We bring certified mechanics to your doorstep, saving you time and hassle.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/book-service" className="h-12 px-8 rounded-full bg-primary text-white font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                Book a Service <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/nearby-mechanics" className="h-12 px-8 rounded-full bg-white border border-border text-foreground font-semibold flex items-center gap-2 hover:bg-gray-50 transition-all">
                Find Mechanics Nearby
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "Save Time", desc: "No more waiting at the shop. We come to you." },
              { icon: ShieldCheck, title: "Trusted Pros", desc: "All mechanics are vetted and certified." },
              { icon: Activity, title: "Transparent Pricing", desc: "Know the cost upfront. No hidden fees." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background p-8 rounded-2xl shadow-sm border border-border/50"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything your car needs to run smoothly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Wrench, title: "General Service", desc: "Comprehensive check-up & maintenance." },
              { icon: Battery, title: "Battery Replacement", desc: "Top brands, installed on the spot." },
              { icon: Disc, title: "Tyre Repair", desc: "Puncture repair & tyre rotation." },
              { icon: Droplet, title: "Oil Change", desc: "Premium synthetic & conventional oils." },
              { icon: Activity, title: "Brake Inspection", desc: "Pad replacement & rotor resurfacing." },
              { icon: Thermometer, title: "AC Service", desc: "Coolant refill & leak detection." }
            ].map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="group bg-card hover:bg-primary/5 border border-border p-6 rounded-2xl transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-secondary rounded-xl group-hover:bg-white transition-colors">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/select-service" className="inline-flex items-center text-primary font-semibold hover:underline">
              View all services <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-700 -z-10"></div>

            {[
              { icon: Calendar, title: "1. Book Online", desc: "Choose your service and preferred time slot." },
              { icon: MapPin, title: "2. We Come to You", desc: "Our mechanic arrives at your location." },
              { icon: CheckCircle2, title: "3. Job Done", desc: "Pay securely after the service is complete." }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 mb-6 shadow-xl">
                  <step.icon className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;

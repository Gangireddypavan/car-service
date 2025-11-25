"use client";



import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Check, Wrench, Battery, Disc, Droplet, Activity, Thermometer } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import clsx from 'clsx';

const services = [
  { id: 'flat_tyre', name: 'Flat Tyre Repair', price: 50, icon: Disc, desc: "Puncture repair & rotation" },
  { id: 'battery', name: 'Battery Replacement', price: 150, icon: Battery, desc: "Top brands, installed on spot" },
  { id: 'general_service', name: 'General Service', price: 200, icon: Wrench, desc: "Comprehensive check-up" },
  { id: 'oil_change', name: 'Oil Change', price: 80, icon: Droplet, desc: "Premium synthetic oil" },
  { id: 'brake_inspection', name: 'Brake Inspection', price: 70, icon: Activity, desc: "Pad replacement & checks" },
  { id: 'ac_service', name: 'AC Service', price: 120, icon: Thermometer, desc: "Coolant refill & leak fix" },
];

const SelectServiceContent = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!bookingId) {
      router.push('/book-service');
    }
  }, [bookingId, router]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(serviceId)
        ? prevSelected.filter((id) => id !== serviceId)
        : [...prevSelected, serviceId]
    );
  };

  const handleNext = async () => {
    if (!bookingId) return;
    if (selectedServices.length === 0) {
      alert("Please select at least one service.");
      return;
    }

    setLoading(true);
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        selectedServices: selectedServices,
        status: 'pending_photo_upload',
      });
      console.log('Booking updated with selected services.');
      router.push(`/upload-photos?bookingId=${bookingId}`);
    } catch (e) {
      console.error('Error updating document: ', e);
      alert("Failed to update booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!bookingId) return null;

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Select Services</h1>
          <p className="text-muted-foreground text-lg">Choose the services you need for your car.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {services.map((service) => {
            const isSelected = selectedServices.includes(service.id);
            return (
              <motion.div
                key={service.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleServiceChange(service.id)}
                className="cursor-pointer"
              >
                <Card className={clsx(
                  "h-full transition-all duration-200 border-2",
                  isSelected ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-primary/50"
                )}>
                  <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between">
                    <div>
                      <div className={clsx(
                        "w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto transition-colors",
                        isSelected ? "bg-primary text-white" : "bg-secondary text-primary"
                      )}>
                        <service.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{service.desc}</p>
                    </div>
                    <div className="w-full">
                      <div className="text-2xl font-bold text-primary mb-4">${service.price}</div>
                      <div className={clsx(
                        "w-full py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors",
                        isSelected ? "bg-primary text-white" : "bg-secondary text-secondary-foreground"
                      )}>
                        {isSelected ? <><Check className="w-4 h-4" /> Selected</> : "Select"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="max-w-md mx-auto">
          <Button
            onClick={handleNext}
            className="w-full h-14 text-lg shadow-xl"
            disabled={loading}
          >
            {loading ? "Processing..." : `Continue (${selectedServices.length} selected)`}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const SelectServicePage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <SelectServiceContent />
    </Suspense>
  );
};

export default SelectServicePage;

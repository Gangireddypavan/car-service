"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Calendar, Clock, Car, Hash } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

const BookServicePage = () => {
  const [carModel, setCarModel] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = async () => {
    if (!carModel || !carNumber || !date || !time) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        carModel,
        carNumber,
        date,
        time,
        status: 'pending_service_selection',
        createdAt: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);
      router.push(`/select-service?bookingId=${docRef.id}`);
    } catch (e) {
      console.error('Error adding document: ', e);
      alert("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col font-sans">
      <Header />

      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="border-border/50 shadow-xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold text-primary">Book Your Service</CardTitle>
              <CardDescription className="text-lg">
                Tell us about your car and preferred schedule.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <label htmlFor="carModel" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Car className="w-4 h-4" /> Car Model
                </label>
                <Input
                  id="carModel"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="e.g., Toyota Camry 2022"
                  className="h-12 bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="carNumber" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <Hash className="w-4 h-4" /> Car Number
                </label>
                <Input
                  id="carNumber"
                  value={carNumber}
                  onChange={(e) => setCarNumber(e.target.value)}
                  placeholder="e.g., ABC 1234"
                  className="h-12 bg-secondary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" /> Date
                  </label>
                  <Input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-12 bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" /> Time
                  </label>
                  <Input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-12 bg-secondary/50"
                  />
                </div>
              </div>

              <Button
                onClick={handleNext}
                className="w-full h-12 text-lg font-semibold mt-4"
                disabled={loading}
              >
                {loading ? "Processing..." : "Continue to Services"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default BookServicePage;

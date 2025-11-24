"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, DollarSign, Calendar, Car } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface BookingData {
  carModel: string;
  carNumber: string;
  date: string;
  time: string;
  selectedServices?: string[];
}

const CheckoutPageContent = () => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      try {
        const docRef = doc(db, 'bookings', bookingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBookingData(docSnap.data() as BookingData);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(async () => {
      try {
        if (!bookingId) return;
        const bookingRef = doc(db, 'bookings', bookingId);
        await updateDoc(bookingRef, {
          status: 'confirmed',
          paymentStatus: 'paid',
        });
        router.push(`/track-order?bookingId=${bookingId}`);
      } catch (e) {
        console.error('Error updating document: ', e);
        alert("Payment failed. Please try again.");
      } finally {
        setProcessing(false);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your booking details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                  <Car className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-lg">{bookingData.carModel}</p>
                    <p className="text-muted-foreground">{bookingData.carNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-lg">{bookingData.date}</p>
                    <p className="text-muted-foreground">{bookingData.time}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold mb-3">Selected Services</h4>
                  <ul className="space-y-2">
                    {bookingData.selectedServices?.map((service: string) => (
                      <li key={service} className="flex items-center gap-2 text-muted-foreground capitalize">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {service.replace('_', ' ')}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="font-bold text-xl">Total</span>
                  <span className="font-bold text-2xl text-primary">$XXX.00</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Secure checkout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cardholder Name</label>
                  <Input placeholder="John Doe" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input placeholder="0000 0000 0000 0000" className="pl-10" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVC</label>
                    <Input placeholder="123" />
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full h-12 text-lg mt-4"
                  disabled={processing}
                >
                  {processing ? (
                    "Processing..."
                  ) : (
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" /> Pay Now
                    </span>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Your payment is secured by 256-bit SSL encryption.
                </p>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
};

export default CheckoutPage;

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Wrench, Car, Clock, Calendar, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import clsx from 'clsx';

interface BookingDetails {
  carModel: string;
  carNumber: string;
  date: string;
  time: string;
  selectedServices: string[];
  photoUrls: string[];
  userLocation: { latitude: number; longitude: number };
  mechanicId: string;
  status: string;
  createdAt: any; // Firestore Timestamp
}

const allServices = [
  { id: 'flat_tyre', name: 'Flat Tyre Repair', price: 50 },
  { id: 'battery', name: 'Battery Replacement', price: 150 },
  { id: 'general_service', name: 'General Service', price: 200 },
  { id: 'oil_change', name: 'Oil Change', price: 80 },
  { id: 'brake_inspection', name: 'Brake Inspection', price: 70 },
  { id: 'ac_service', name: 'AC Service', price: 120 },
];

const dummyMechanics = [
  { id: 'mech1', name: 'AutoFix Pro', rating: 4.8, distance: 5.2, estimatedArrival: '25 min', price: 100 },
  { id: 'mech2', name: 'Speedy Repairs', rating: 4.5, distance: 8.1, estimatedArrival: '40 min', price: 90 },
  { id: 'mech3', name: 'Reliable Auto', rating: 4.9, distance: 3.5, estimatedArrival: '15 min', price: 110 },
  { id: 'mech4', name: 'Quick Service', rating: 4.2, distance: 10.0, estimatedArrival: '50 min', price: 85 },
];

const TrackOrderPage = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    if (!bookingId) {
      router.push('/book-service');
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const bookingRef = doc(db, 'bookings', bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (bookingSnap.exists()) {
          const data = bookingSnap.data();
          setBookingDetails(data as BookingDetails);
        } else {
          setError('Booking not found.');
        }
      } catch (e) {
        console.error('Error fetching booking details:', e);
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, router]);

  const calculateTotalPrice = () => {
    if (!bookingDetails || !bookingDetails.selectedServices) return 0;
    return bookingDetails.selectedServices.reduce((total, serviceId) => {
      const service = allServices.find(s => s.id === serviceId);
      return total + (service ? service.price : 0);
    }, 0);
  };

  const getMechanicName = (mechanicId: string) => {
    const mechanic = dummyMechanics.find(m => m.id === mechanicId);
    return mechanic ? mechanic.name : 'N/A';
  };

  const steps = [
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2, description: 'Order received' },
    { id: 'mechanic_on_way', label: 'On the Way', icon: Car, description: 'Mechanic is traveling' },
    { id: 'service_started', label: 'In Progress', icon: Wrench, description: 'Service started' },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, description: 'Service done' },
  ];

  const getCurrentStepIndex = (status: string) => {
    const statusMap: Record<string, number> = {
      'confirmed': 0,
      'mechanic_on_way': 1,
      'service_started': 2,
      'completed': 3
    };
    return statusMap[status] ?? 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 border-destructive/20 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-destructive">Error</h2>
            <p className="text-muted-foreground">{error || "Booking not found"}</p>
            <Button onClick={() => router.push('/')} variant="outline" className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex(bookingDetails.status);
  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Track Order</h1>
              <p className="text-muted-foreground mt-1">
                Booking ID: <span className="font-mono text-primary font-medium">{bookingId}</span>
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => router.push('/')}>
              <ChevronRight className="w-4 h-4 rotate-180" /> Back to Home
            </Button>
          </div>

          {/* Status Tracker */}
          <Card className="border-border/50 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-secondary/20 border-b border-border/50 pb-8">
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Real-time updates on your service</CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
              <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 w-full h-1 bg-secondary rounded-full -z-10" />

                {/* Active Progress Bar */}
                <motion.div
                  className="absolute top-5 left-0 h-1 bg-primary rounded-full -z-10"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />

                <div className="flex justify-between items-start w-full">
                  {steps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 w-24">
                        <motion.div
                          initial={false}
                          animate={{
                            backgroundColor: isActive ? 'var(--primary)' : 'var(--background)',
                            borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                            scale: isCurrent ? 1.1 : 1,
                          }}
                          className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 shadow-sm",
                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                          )}
                        >
                          <step.icon className="w-5 h-5" />
                        </motion.div>
                        <div className="text-center space-y-1">
                          <p className={clsx(
                            "text-sm font-semibold transition-colors duration-300",
                            isActive ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {step.label}
                          </p>
                          <p className="text-xs text-muted-foreground hidden md:block">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Vehicle & Location */}
              <Card className="border-border/50 shadow-lg h-full">
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Car className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Vehicle</p>
                        <p className="font-semibold text-lg">{bookingDetails.carModel}</p>
                        <p className="text-sm text-muted-foreground">{bookingDetails.carNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium mb-1">Schedule</p>
                        <p className="font-semibold text-lg">{bookingDetails.date}</p>
                        <p className="text-sm text-muted-foreground">{bookingDetails.time}</p>
                      </div>
                    </div>
                  </div>

                  {bookingDetails.mechanicId && (
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <Wrench className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium mb-1">Assigned Mechanic</p>
                          <p className="font-semibold text-lg">{getMechanicName(bookingDetails.mechanicId)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary">
                          <Phone className="w-5 h-5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary">
                          <MessageSquare className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Summary */}
            <div className="space-y-8">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {bookingDetails.selectedServices.map((serviceId) => {
                      const service = allServices.find(s => s.id === serviceId);
                      return (
                        <div key={serviceId} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">{service?.name}</span>
                          <span className="font-medium">${service?.price}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg">Total Paid</span>
                    <span className="font-bold text-2xl text-primary">${totalPrice}</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-secondary/20 border-t border-border/50 p-4">
                  <p className="text-xs text-muted-foreground text-center w-full">
                    Receipt sent to your email
                  </p>
                </CardFooter>
              </Card>

              <Card className="bg-primary/5 border-primary/20 shadow-sm">
                <CardContent className="p-6 text-center space-y-4">
                  <h3 className="font-semibold text-lg">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Have questions about your order? Our support team is here to help 24/7.
                  </p>
                  <Button variant="outline" className="w-full bg-background">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrderPage;

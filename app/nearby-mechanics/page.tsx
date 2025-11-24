"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin, Loader2, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

const libraries: "places"[] = ["places"];

const NearbyMechanicsPage = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'detecting' | 'found' | 'scanning' | 'redirecting'>('detecting');
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  // Ref to prevent double execution of save logic
  const saveInitiated = useRef(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // IMPORTANT: Add your Google Maps API key here
    libraries,
  });

  useEffect(() => {
    if (!bookingId) {
      router.push('/book-service');
      return;
    }

    if (!navigator.geolocation) {
      setTimeout(() => {
        setError('Geolocation is not supported by your browser.');
        setLoadingLocation(false);
      }, 0);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoadingLocation(false);
        setStatus('found');
      },
      (err) => {
        console.error('Error getting location:', err);
        setError('Unable to retrieve your location. Please enable location services.');
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [bookingId, router]);

  // Auto-save and redirect when location is found
  useEffect(() => {
    const autoSaveAndRedirect = async () => {
      if (!bookingId || !location || saveInitiated.current) return;

      saveInitiated.current = true;

      // Small delay to show "Location Found" state before scanning
      setTimeout(async () => {
        setStatus('scanning');

        try {
          const bookingRef = doc(db, 'bookings', bookingId);
          await updateDoc(bookingRef, {
            userLocation: location,
            status: 'location_saved',
          });

          // Simulate scanning delay for better UX
          setTimeout(() => {
            setStatus('redirecting');
            setTimeout(() => {
              router.push(`/checkout?bookingId=${bookingId}`);
            }, 1000);
          }, 2500);

        } catch (e) {
          console.error('Error saving location to Firestore: ', e);
          setError('Failed to save location. Please try again.');
          saveInitiated.current = false; // Allow retry
        }
      }, 1500);
    };

    if (location && status === 'found') {
      autoSaveAndRedirect();
    }
  }, [bookingId, location, status, router]);

  if (!bookingId) return null;

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full space-y-8">

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {status === 'scanning' || status === 'redirecting'
                ? "Finding Nearby Mechanics"
                : "Locating You"}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {status === 'scanning' || status === 'redirecting'
                ? "We are scanning our network to find the best rated mechanics in your area."
                : "Please allow location access so we can connect you with the nearest service providers."}
            </p>
          </div>

          <Card className="border-border/50 shadow-2xl overflow-hidden bg-card/50 backdrop-blur-sm relative min-h-[500px] flex flex-col">
            <CardHeader className="bg-secondary/20 border-b border-border/50 z-10">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Live Location
                </CardTitle>
                <div className="flex items-center gap-2 text-sm font-medium">
                  {status === 'detecting' && (
                    <span className="flex items-center text-muted-foreground">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Detecting...
                    </span>
                  )}
                  {status === 'found' && (
                    <span className="flex items-center text-green-500">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Location Found
                    </span>
                  )}
                  {(status === 'scanning' || status === 'redirecting') && (
                    <span className="flex items-center text-primary">
                      <Search className="w-4 h-4 mr-2 animate-pulse" /> Scanning Area...
                    </span>
                  )}
                  {error && (
                    <span className="flex items-center text-destructive">
                      <AlertCircle className="w-4 h-4 mr-2" /> Error
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex-grow relative">
              {/* Map Layer */}
              <div className="absolute inset-0 w-full h-full bg-secondary/50">
                {loadError && (
                  <div className="absolute inset-0 flex items-center justify-center text-destructive bg-background/80 z-20">
                    Error loading Google Maps
                  </div>
                )}

                {!isLoaded && !loadError && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-background/80 z-20">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                )}

                {isLoaded && location && (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={{ lat: location.latitude, lng: location.longitude }}
                    zoom={15}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: false,
                      styles: [
                        {
                          featureType: "poi",
                          elementType: "labels",
                          stylers: [{ visibility: "off" }],
                        },
                      ],
                    }}
                  >
                    <Marker position={{ lat: location.latitude, lng: location.longitude }} />

                    {/* Simulated nearby mechanics markers */}
                    {(status === 'scanning' || status === 'redirecting') && (
                      <>
                        <Marker
                          position={{ lat: location.latitude + 0.002, lng: location.longitude + 0.002 }}
                          icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 5, fillColor: '#2563eb', fillOpacity: 1, strokeWeight: 0 }}
                        />
                        <Marker
                          position={{ lat: location.latitude - 0.003, lng: location.longitude - 0.001 }}
                          icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 5, fillColor: '#2563eb', fillOpacity: 1, strokeWeight: 0 }}
                        />
                        <Marker
                          position={{ lat: location.latitude + 0.001, lng: location.longitude - 0.004 }}
                          icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 5, fillColor: '#2563eb', fillOpacity: 1, strokeWeight: 0 }}
                        />
                      </>
                    )}
                  </GoogleMap>
                )}
              </div>

              {/* Scanning Overlay */}
              <AnimatePresence>
                {(status === 'scanning' || status === 'redirecting') && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                  >
                    <div className="relative">
                      {/* Radar Pulse Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/50"
                        animate={{ scale: [1, 2], opacity: [1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/30"
                        animate={{ scale: [1, 3], opacity: [0.8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                      />

                      <div className="bg-background/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-primary/20 flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <span className="font-semibold text-foreground">
                          {status === 'redirecting' ? "Mechanics Found!" : "Scanning nearby area..."}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Overlay */}
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-30 p-6">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="text-xl font-bold text-destructive mb-2">Location Error</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NearbyMechanicsPage;

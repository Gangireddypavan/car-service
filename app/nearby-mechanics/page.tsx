"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

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
      },
      (err) => {
        console.error('Error getting location:', err);
        setError('Unable to retrieve your location. Please enable location services.');
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [bookingId, router]);

  const handleSaveLocation = async () => {
    if (!bookingId || !location) return;

    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        userLocation: location,
        status: 'location_saved',
      });
      console.log('Booking updated with user location.');
      // In a real app, this would probably show a list of mechanics or auto-assign
      // For this flow, we'll skip to checkout or mechanic selection simulation
      router.push(`/checkout?bookingId=${bookingId}`);
    } catch (e) {
      console.error('Error saving location to Firestore: ', e);
    }
  };

  if (!bookingId) return null;

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col font-sans">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Share Location</h1>
            <p className="text-muted-foreground text-lg">We need your location to find the nearest mechanics.</p>
          </div>

          <Card className="border-border/50 shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-border/50">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Your Location
              </CardTitle>
              <CardDescription>
                {loadingLocation ? "Detecting..." : location ? "Location found" : "Location required"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px] w-full bg-secondary/50 relative">
                {loadError && (
                  <div className="absolute inset-0 flex items-center justify-center text-destructive">
                    Error loading Google Maps
                  </div>
                )}

                {!isLoaded && !loadError && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
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
                      zoomControl: true,
                    }}
                  >
                    <Marker position={{ lat: location.latitude, lng: location.longitude }} />
                  </GoogleMap>
                )}

                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                    <p className="text-destructive font-medium">{error}</p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-background">
                <Button
                  onClick={handleSaveLocation}
                  className="w-full h-12 text-lg"
                  disabled={!location || loadingLocation || !isLoaded}
                >
                  {loadingLocation ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Detecting Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5 mr-2" /> Confirm Location & Find Mechanics
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  We only use your location to connect you with nearby service providers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NearbyMechanicsPage;

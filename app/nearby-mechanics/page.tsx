"use client"; // This is a Client Component

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming config.js is in src/lib/firebase
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
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
      router.push('/book-service'); // Redirect if no bookingId
      return;
    }

    // Auto-detect GPS location
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
    if (!bookingId || !location) {
      console.error('Booking ID or location is missing.');
      return;
    }

    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        userLocation: location,
        status: 'location_saved',
      });
      console.log('Booking updated with user location.');
      router.push(`/mechanics?bookingId=${bookingId}`);
    } catch (e) {
      console.error('Error saving location to Firestore: ', e);
    }
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading or invalid booking...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Share Your Location</h1>

        {loadingLocation && (
          <p className="text-center text-gray-600 mb-4">Detecting your location...</p>
        )}

        {error && (
          <p className="text-center text-red-500 mb-4">{error}</p>
        )}

        {loadError && (
          <p className="text-center text-red-500 mb-4">Error loading Google Maps.</p>
        )}

        {isLoaded && location && (
          <div className="mb-6">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: location.latitude, lng: location.longitude }}
              zoom={15}
            >
              <Marker position={{ lat: location.latitude, lng: location.longitude }} />
            </GoogleMap>
          </div>
        )}

        <button
          onClick={handleSaveLocation}
          disabled={!location || loadingLocation || !isLoaded}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Location & Find Mechanics
        </button>
      </div>
    </div>
  );
};

export default NearbyMechanicsPage;

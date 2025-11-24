"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserLocation {
    latitude: number;
    longitude: number;
}

interface Mechanic {
    id: string;
    name: string;
    rating: number;
    location: { latitude: number; longitude: number };
    basePrice: number;
    distance?: number;
}

// Haversine distance formula
const getDistance = (loc1: UserLocation, loc2: { latitude: number; longitude: number }) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.latitude - loc1.latitude) * (Math.PI / 180);
    const dLon = (loc2.longitude - loc1.longitude) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(loc1.latitude * (Math.PI / 180)) * Math.cos(loc2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const MechanicsList = () => {
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
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

        const fetchAndSortMechanics = async () => {
            try {
                // Fetch user location from booking
                const bookingRef = doc(db, 'bookings', bookingId);
                const bookingSnap = await getDoc(bookingRef);

                if (!bookingSnap.exists() || !bookingSnap.data()?.userLocation) {
                    setError('User location not found in booking.');
                    setLoading(false);
                    return;
                }
                const userLocation = bookingSnap.data().userLocation as UserLocation;

                // Fetch mechanics from Firestore
                const mechanicsCollection = collection(db, 'mechanics');
                const mechanicsSnap = await getDocs(mechanicsCollection);
                const mechanicsList = mechanicsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mechanic));

                // Calculate distance and sort
                const mechanicsWithDistance = mechanicsList.map(mechanic => ({
                    ...mechanic,
                    distance: getDistance(userLocation, mechanic.location),
                }));
                mechanicsWithDistance.sort((a, b) => a.distance - b.distance);

                setMechanics(mechanicsWithDistance);
            } catch (e) {
                console.error('Error fetching data:', e);
                setError('Failed to fetch mechanics.');
            } finally {
                setLoading(false);
            }
        };

        fetchAndSortMechanics();
    }, [bookingId, router]);

    const handleSelectMechanic = async (mechanicId: string) => {
        if (!bookingId) return;
        try {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, {
                mechanicId: mechanicId,
                status: 'mechanic_selected',
            });
            router.push(`/checkout?bookingId=${bookingId}`);
        } catch (e) {
            console.error('Error saving mechanic:', e);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-lg text-gray-700">Finding nearby mechanics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-lg text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Select Your Mechanic</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mechanics.map((mechanic) => (
                        <div key={mechanic.id} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition duration-300">
                            <h2 className="text-xl font-semibold text-blue-800 mb-2">{mechanic.name}</h2>
                            <p className="text-gray-700 mb-1">Rating: {mechanic.rating} ⭐</p>
                            <p className="text-gray-700 mb-1">Distance: {mechanic.distance?.toFixed(2)} km</p>
                            <p className="text-gray-700 mb-1">Est. Arrival: {`${Math.round(mechanic.distance! * 5)} min`}</p>
                            <p className="text-gray-700 mb-4">Base Price: ${mechanic.basePrice}</p>
                            <button
                                onClick={() => handleSelectMechanic(mechanic.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition duration-300"
                            >
                                Select Mechanic
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MechanicsList;

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { tripService } from "@/services/tripService";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await tripService.getAllTrips();
        if (response.success) {
          setTrips(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      }
    };

    fetchTrips();
  }, []);

  const getGuideName = (guide) => {
    if (!guide) return "Guide not found";

    // Try to get name from user relationship
    if (guide.user?.username) return guide.user.username;
    if (guide.user?.full_name) return guide.user.full_name;
    if (guide.user?.email) return guide.user.email.split("@")[0];

    // Fallback to guide's own properties
    if (guide.username) return guide.username;
    if (guide.full_name) return guide.full_name;
    if (guide.email) return guide.email.split("@")[0];

    return "Unknown Guide";
  };

  // Remove the misplaced JSX fragment and keep only the helper functions
  const getMountainImage = (trip) => {
    if (trip?.mountain?.image_path) {
      return trip.mountain.image_path;
    }
    return "/placeholder.jpg";
  };

  const getGuideInitials = (guide) => {
    if (!guide?.user?.name) return "GD";
    const names = guide.user.name.split(" ");
    return names
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  const getGuideImage = (guide) => {
    return guide?.user?.profile_image || "/default-avatar.png";
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/placeholder.jpg";
    return `http://localhost:8000/storage/${imagePath}`;
  };

  const formatTripDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // If same month
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString(
        "id-ID",
        { month: "long" }
      )}`;
    }

    // Different months
    return `${start.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })} - ${end.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Open Trip Available</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link href={`/trips/${trip.id}`} key={trip.id}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={getImageUrl(trip.images[0]?.image_path)}
                    alt={trip.mountain?.nama_gunung || "Mountain"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    Open Trip
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {trip.mountain?.nama_gunung || "Mountain Name"}
                    </h2>

                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1.5 text-white/90 text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          {formatTripDate(trip.start_date, trip.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/90 text-sm">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <span>{trip.capacity} slot</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {trip.guide?.user?.profile_image ? (
                          <Image
                            src={getImageUrl(trip.guide.user.profile_image)}
                            alt={getGuideName(trip.guide)}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold">
                            {getGuideInitials(trip.guide)}
                          </div>
                        )}
                        <span className="text-white/90 text-sm">
                          {getGuideName(trip.guide)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold">
                          Rp {trip.price?.toLocaleString()}
                        </span>
                        <button className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-all duration-300">
                          Lihat Trip
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiStar, FiRefreshCw, FiFilter, FiCalendar, FiMessageSquare } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function GuideRatingsPage() {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState("all");
  const [trips, setTrips] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  useEffect(() => {
    fetchRatings();
    fetchTrips();
  }, []);

  const fetchRatings = async (tripId = null) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        window.location.href = "/login";
        return;
      }

      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/guide/ratings`;
      if (tripId && tripId !== "all") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/guide/trips/${tripId}/ratings`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setRatings(response.data.data.ratings || []);
        setAverageRating(response.data.data.average_rating || 0);
        setRatingsCount(response.data.data.ratings_count || 0);
        setRatingCounts(response.data.data.rating_counts || {});
      } else {
        setError(response.data.message || "Failed to load ratings");
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setError("Failed to load ratings. Please check your connection and try again.");
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/guide/trips`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setTrips(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const handleTripChange = (e) => {
    const tripId = e.target.value;
    setSelectedTrip(tripId);
    fetchRatings(tripId);
  };

  const refreshRatings = async () => {
    try {
      setIsRefreshing(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/guide/refresh-ratings`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setRatings(response.data.data.ratings || []);
        setAverageRating(response.data.data.average_rating || 0);
        setRatingsCount(response.data.data.ratings_count || 0);
        toast.success("Ratings refreshed successfully");
      } else {
        toast.error(response.data.message || "Failed to refresh ratings");
      }
    } catch (error) {
      console.error("Error refreshing ratings:", error);
      toast.error("Failed to refresh ratings");
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const renderStarRating = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`${
              star <= Math.round(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            size={16}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => fetchRatings()}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Ratings & Reviews</h1>
            <p className="text-gray-600">
              See what climbers are saying about your trips
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select
                value={selectedTrip}
                onChange={handleTripChange}
                className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Trips</option>
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.title || `Trip to ${trip.mountain?.nama_gunung}`}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FiFilter size={16} />
              </div>
            </div>
            
            <button
              onClick={refreshRatings}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} />
              Refresh Ratings
            </button>
          </div>
        </div>

        {/* Rating Summary Card */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="text-5xl font-bold text-gray-800 mr-4">
                  {averageRating.toFixed(1)}
                </div>
                <div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        size={24}
                        className={`${
                          star <= Math.round(averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 mt-1">
                    Based on {ratingsCount} reviews
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star] || 0;
                  const percentage = ratingsCount
                    ? Math.round((count / ratingsCount) * 100)
                    : 0;

                  return (
                    <div key={star} className="flex items-center">
                      <div className="w-12 text-sm text-gray-600">
                        {star} star
                      </div>
                      <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-9 text-sm text-gray-600 text-right">
                        {percentage}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ratings List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            All Reviews ({ratingsCount})
          </h2>

          {ratings.length > 0 ? (
            ratings.map((rating, index) => (
              <motion.div
                key={rating.id || index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold text-lg">
                        {rating.user_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {rating.user_name || "Anonymous Climber"}
                        </h3>
                        <div className="flex items-center mt-1">
                          {renderStarRating(rating.rating)}
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDate(rating.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {rating.trip_title || "Trip"}
                      </div>
                      {rating.mountain_name && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <span>{rating.mountain_name}</span>
                        </div>
                      )}
                      {rating.trip_date && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <FiCalendar className="mr-1" size={12} />
                          <span>{formatDate(rating.trip_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {rating.comment ? (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <FiMessageSquare className="text-gray-400 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">{rating.comment}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg text-gray-500 italic text-sm">
                      No comment provided
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You haven't received any ratings from climbers yet. Ratings will appear here after your trips are completed.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
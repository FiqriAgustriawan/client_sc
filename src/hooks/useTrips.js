import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

export function useTrips(activeCategory = "all", searchQuery = "") {
  // Fetch all trips from real API endpoint
  const { data: tripsData, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/trips/all");
        return response.data.data || [];
      } catch (error) {
        console.error("Error fetching trips:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Filter trips based on category and search query
  const filteredTrips = useMemo(() => {
    if (!tripsData) return [];
    
    let filtered = [...tripsData];
    
    // Apply category filter
    if (activeCategory === "popular") {
      filtered = filtered.filter(trip => trip.participants_count > 3);
    } else if (activeCategory === "upcoming") {
      filtered = filtered.filter(trip => new Date(trip.start_date) > new Date());
    } else if (activeCategory === "weekend") {
      filtered = filtered.filter(trip => {
        const tripDate = new Date(trip.start_date);
        const day = tripDate.getDay();
        return day === 0 || day === 6; // Saturday or Sunday
      });
    } else if (activeCategory === "beginner") {
      filtered = filtered.filter(trip => trip.difficulty_level === "Mudah");
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trip => 
        trip.name?.toLowerCase().includes(query) || 
        trip.mountain_name?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [tripsData, activeCategory, searchQuery]);

  return {
    trips: filteredTrips,
    isLoading,
    featuredTrip: filteredTrips[0] || null
  };
}

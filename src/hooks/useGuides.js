import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function usePopularGuides() {
  // There's no specific endpoint for listing all guides, so we'll get guides from trips
  const { data, isLoading } = useQuery({
    queryKey: ["popularGuides"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/trips/all");
        const trips = response.data.data || [];

        // Extract unique guides from trips
        const guidesMap = {};
        trips.forEach((trip) => {
          if (trip.guide_id && !guidesMap[trip.guide_id]) {
            guidesMap[trip.guide_id] = {
              id: trip.guide_id,
              name: trip.guide_name || `Pemandu ${trip.guide_id}`,
              image: trip.guide_photo
                ? `http://localhost:8000/storage/${trip.guide_photo}`
                : `/guides/guide-${(trip.guide_id % 4) + 1}.jpg`,
              rating: trip.guide_rating || 4.5,
              completed_trips:
                trip.guide_completed_trips ||
                Math.floor(Math.random() * 20) + 5,
            };
          }
        });

        // Convert to array and sort by rating
        return Object.values(guidesMap)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5); // Get top 5 guides
      } catch (error) {
        console.error("Failed to fetch guides:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    guides: data || [],
    isLoading,
  };
}

export function useGuideRatings(guideId) {
  return useQuery({
    queryKey: ["guideRatings", guideId],
    queryFn: async () => {
      if (!guideId) return [];

      try {
        const response = await axios.get(
          `http://localhost:8000/api/guides/${guideId}/ratings`
        );
        return response.data.data || [];
      } catch (error) {
        console.error(`Failed to fetch ratings for guide ${guideId}:`, error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!guideId,
  });
}

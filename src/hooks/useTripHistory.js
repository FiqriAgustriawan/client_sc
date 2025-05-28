import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, subDays } from "date-fns";

export function useTripHistory() {
  // In a real application, you would use an authenticated API call
  const { data: tripHistory, isLoading } = useQuery({
    queryKey: ["tripHistory"],
    queryFn: async () => {
      try {
        // This would be the real API endpoint in a production app
        // const response = await axios.get("http://localhost:8000/api/user/trip-history");
        // return response.data.data;

        // Simulating data for demo
        return Array(8)
          .fill()
          .map((_, i) => ({
            id: i + 1,
            name: `Trip ke Gunung ${
              [
                "Bromo",
                "Semeru",
                "Merbabu",
                "Merapi",
                "Prau",
                "Lawu",
                "Rinjani",
                "Slamet",
              ][i % 8]
            }`,
            date: format(subDays(new Date(), 7 + i * 3), "yyyy-MM-dd"),
            image: `/mountains/mountain-${(i % 4) + 1}.jpg`,
            completed: true,
            participants: 4 + Math.floor(Math.random() * 10),
            duration: 2 + Math.floor(Math.random() * 3),
            elevation: 2000 + Math.floor(Math.random() * 1500),
            rating: 3.5 + Math.random() * 1.5,
            guide: {
              name: `Pemandu ${i + 1}`,
              image: `/guides/guide-${(i % 4) + 1}.jpg`,
            },
          }));
      } catch (error) {
        console.error("Failed to fetch trip history:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    tripHistory: tripHistory || [],
    isLoading,
  };
}

"use client"

import { useState, useEffect } from "react"
import { StoryCard } from "./Card/story-card"
import { Button } from "@/components/ui/button"

const stories = [
  {
    avatarUrl: "/assets/images/ppstory.svg",
    name: "Abu Cudi",
    story: "Wow gunung emang asik yah tetap semangat untuk pendaki gunung",
  },
  {
    avatarUrl: "/assets/images/ppstory.svg",
    name: "Fadlul",
    story:
      "Pendaki pertama, kaya orang tersesat ketinggian. Tapi yang menyenangkan bisa melihat keindahan alam dari ketinggian.",
  },
  {
    avatarUrl: "/assets/images/ppstory.svg",
    name: "James",
    story: "Wow gunung emang asik yah tetap semangat untuk pendaki gunung",
  },
  {
    avatarUrl: "/assets/images/ppstory.svg",
    name: "Akram keren",
    story: "Hanya Nanung berguna dan sangat bermanfaat",
  },
  {
    avatarUrl: "/assets/images/ppstory.svg",
    name: "Digital",
    story:
      "Sebuah perinta yang sangat menanam kebersamaan untuk tim. Gunung memang tempat yang sangat menyenangkan untuk berlatih perluang yang dapat dari pendakian.",
  },
  {
    avatarUrl: "/assets/images/ppstory.svg",
    name: "Akram keren",
    story: "Hanya Nanung berguna dan sangat bermanfaat",
  },
]

export default function StoriesSection() {
  const [showAll, setShowAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is the standard breakpoint for medium screens
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const visibleStories = isMobile && !showAll ? stories.slice(0, 2) : stories

  return (
    <section className="relative py-16 px-4 overflow-hidden min-h-screen">
      <div className="max-w-8xl mx-auto">
        <div className="relative rounded-[40px] overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#D7E9FF] to-[#4A93E8]" />

          {/* Content */}
          <div className="relative z-10 py-16 px-4 md:px-8 lg:px-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block bg-white rounded-full px-4 py-1 text-xs font-semibold text-dark mb-4">
                  Testimoni
                </div>
                <h2 className="text-5xl font-bold text-dark mb-2">Cerita Pendaki</h2>
                <p className="text-dark text-xl font-medium">Pengalaman Nyata di PuncakG Sukowati Selatan</p>
              </div>

              {/* Stories grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {visibleStories.map((story, index) => (
                  <div key={index} className={`${index % 2 === 0 ? "md:translate-y-8" : ""}`}>
                    <StoryCard {...story} />
                  </div>
                ))}
              </div>

              {/* Read More button (only on mobile) */}
              {isMobile && !showAll && stories.length > 2 && (
                <div className="text-center mt-8">
                  <Button onClick={() => setShowAll(true)} className="bg-white text-blue-600 hover:bg-blue-50">
                    Read More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


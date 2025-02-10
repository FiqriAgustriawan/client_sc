import React from 'react'
import Image from 'next/image'

function page() {
  // Sample data - you can replace this with your actual data
  const historyItems = [
    {
      id: 1,
      title: "RawallangiAdventure",
      type: "Open Trip",
      date: "12 - 14 Oktober",
      image:  "/assets/images/Card1.png" // Replace with your actual image path
    },
    {
      id: 2,
      title: "RawallangiAdventure",
      type: "Open Trip",
      date: "12 - 14 Oktober",
      image: "/assets/images/Card1.png"
    },
    {
      id: 3,
      title: "RawallangiAdventure",
      type: "Open Trip",
      date: "12 - 14 Oktober",
      image:  "/assets/images/Card1.png"
    }
  ];

  return (
    <>
      <div className="flex justify-center lg:justify-end pr-1 mt-16">
        <div className="w-full max-w-[1000px] bg-[#FFFFFF] rounded-[24px] overflow-hidden relative mx-4 sm:mx-6 lg:mx-0 lg:mr-14 mt-10 shadow-lg">
          <div className="mt-7 px-4 sm:px-6 lg:px-6">
            <h1 className="text-[28px] font-semibold text-[#2D3648] mb-6">History Pendakian</h1>
            
            <div className="space-y-4 pb-6">
              {historyItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-[#F8FAFC] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Image container */}
                  <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 192px"
                      className="object-cover"
                      priority={item.id === 1}
                    />
                  </div>
                  
                  {/* Content container */}
                  <div className="flex flex-col flex-grow">
                    <h2 className="text-xl font-semibold text-[#2D3648] mb-1">
                      {item.title}
                    </h2>
                    <p className="text-[#64748B] mb-2">
                      {item.type}
                    </p>
                    <p className="text-[#64748B] text-sm">
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
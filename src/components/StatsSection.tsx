export default function StatsSection() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-12 md:gap-24">
          <div className="text-center px-4">
            <div className="text-4xl md:text-5xl font-bold text-gray-900">50+</div>
            <div className="text-sm md:text-base text-gray-600 mt-2">Gunung Terdaftar</div>
          </div>
          <div className="text-center px-4">
            <div className="text-4xl md:text-5xl font-bold text-gray-900">1,234+</div>
            <div className="text-sm md:text-base text-gray-600 mt-2">Pendaki Telah Terdaftar</div>
          </div>
          <div className="text-center px-4">
            <div className="text-4xl md:text-5xl font-bold text-gray-900">20+</div>
            <div className="text-sm md:text-base text-gray-600 mt-2">Trip Tersedia</div>
          </div>
        </div>
      </div>
    </div>
  )
}


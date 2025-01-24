import React from 'react'
import NewsImage from '@/assets/images/News.png'
import Image from 'next/image'
import newsData from '@/data/dataNewsDummy.json'
function News() {
  return (
<div>
  <div>
    <div className='flex justify-center bg-[#F5F5F5] h-[450px] -mt-10'>
      <div className='grid grid-cols-2 gap-4 mt-10'>
        <div className='relative'>
          <div className='relative grid grid-cols-1 mt-24 text-white gap-3'>
            {/* Overlay untuk efek hover */}
            <div className='absolute z-10 w-[576px] h-[284px] bg-gradient-to-t from-black/50 to-transparent hover:bg-black/20 rounded-[20px] transition-all duration-200'>
              <div className='ml-6 mt-[200px] relative'>
                <div className='flex gap-3 -mt-6 relative font-light7'>
                  <h1>Bulu Baria</h1>
                  <div className='w-[2px] rounded-full h-[14px] mt-[6px] bg-white'/>
                  <h1>14 jam yang lalu</h1>
                </div>
                <div>
                  <h1 className='text-xl font-semibold -mt-2 leading-6'>Lorem ipsum odor amet, consectetuer <br/>adipiscing elit.</h1>
                </div>
              </div> 
            </div>
            {/* Image container */}
            <div className='relative group cursor-pointer rounded-2xl overflow-hidden'>
              <Image 
                src={NewsImage} 
                alt='news' 
                className='hover:scale-105 transition-all duration-300 rounded-2xl'
                width={576}
                height={279}
              />
            </div>
          </div>
        </div>
        {/* Pembatas */}
        <div className='relative'>
          <div className='relative grid grid-cols-1 mt-24 text-white gap-3'>
            {/* Overlay untuk efek hover */}
            <div className='absolute z-50 w-[576px] h-[284px] bg-gradient-to-t from-black/50 to-transparent hover:bg-black/20 rounded-[20px] transition-all duration-200'>
              <div className='ml-6 mt-[200px] relative'>
                <div className='flex gap-3 -mt-6 relative'>
                  <h1>Bulu Baria</h1>
                  <div className='w-[2px] rounded-full h-[14px] mt-[6px] bg-white'/>
                  <h1>14 jam yang lalu</h1>
                </div>
                <div>
                  <h1 className='text-xl font-semibold -mt-2 leading-6'>Lorem ipsum odor amet, consectetuer <br/>adipiscing elit.</h1>
                </div>
              </div> 
            </div>
            {/* Image container */}
            <div className='relative group cursor-pointer rounded-2xl overflow-hidden'>
              <Image 
                src={NewsImage} 
                alt='news' 
                className='hover:scale-105 transition-all duration-300 rounded-2xl'
                width={576}
                height={279}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* section banyak */}
    <div className='mx-14'>
      <div>
        <h1 className='text-4xl mt-4 font-semibold'>Berita Terkini</h1>
      </div>
      <div className="grid grid-cols-4">
  {newsData.map((news) => (
    <div key={news.id} className="mt-7">
      <div className="relative">
        <div className="absolute z-50 w-[270px] h-[180px] bg-gradient-to-t hover:bg-black/20 rounded-[20px] transition-all duration-100" />
        <Image
          src={news.gambar}
          alt={news.judul_berita}
          width={270}
          height={180}
          className="w-[270px] object-cover h-[180px] transition-all from-black/0 hover:bg-black/30 duration-300 rounded-2xl"
        />
      </div>
      <div className="mt-4">
        <h1 className="text-[20px] text-black hover:text-red-500 font-semibold leading-6">
          {news.judul_berita}
        </h1>
        <div className="flex gap-3 relative font-medium text-sm mt-2">
          <h1 className="text-red-500">{news.nama_gunung}</h1>
          <div className="w-[2px] rounded-full h-[14px] mt-[4px] bg-stone-600" />
          <h1 className="text-stone-500">{news.timestamp}</h1>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  </div>
</div>
  )
}

export default News
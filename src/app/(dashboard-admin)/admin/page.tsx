import React from 'react';
import Image from 'next/image';
import Adjust from '@/assets/svgs/Adjust.svg';
import Chart21 from '@/app/(dashboard-admin)/admin/chart';




function page() {
  return (
    <>
     <div className="min-h-screen p-4 md:p-10 flex flex-col md:flex-row mt-16 md:mr-5 max-w-[1200px] mx-auto">
        <div className="hidden md:block w-[10%]">{/* sidebar space */}</div>
        <div className=" -mt-[3px] w-[1640px] bg-white rounded-[24px] overflow-hidden relative mr-14 mt-10 shadow-lg p-6 max-w-full ml-14">
          <div className='mx-4 mt-2'>
            <h1 className='text-xl font-medium'>Dashboard</h1>
            <div className='mt-8 grid grid-cols-4 gap-x-7'>
              <div className='bg-[#eff6fe] transition-all duration-100 hover:bg-[#dbe7f6] pt-4 pl-4 w-52 h-32 rounded-[20px]'>
                <h1 className='text-[23px] leading-6 font-semibold'>Penyedia <br/>Trip</h1>
                <h1 className='text-[16px] font-medium mt-2'>17 Penyedia Trip</h1>
              </div>
              <div className='bg-[#eff6fe] transition-all duration-100 hover:bg-[#dbe7f6] pt-4 pl-4 w-52 h-32 rounded-[20px]'>
                <h1 className='text-[23px] leading-6 font-semibold'>Total <br/>Trip</h1>
                <h1 className='text-[16px] font-medium mt-2'>43 Total Trip</h1>
              </div>
              <div className='bg-[#eff6fe] transition-all duration-100 hover:bg-[#dbe7f6] pt-4 pl-4 w-52 h-32 rounded-[20px]'>
                <h1 className='text-[23px] leading-6 font-semibold'>Jumlah <br/>Pengguna</h1>
                <h1 className='text-[16px] font-medium mt-2 leading-5'>3.214 Pengguna <br/>Terdaftar</h1>
              </div>
              <div className='bg-[#eff6fe] transition-all duration-100 hover:bg-[#dbe7f6] pt-4 pl-4 w-52 h-32 rounded-[20px]'>
                <h1 className='text-[23px] leading-6 font-semibold'>Ulasan &<br/>Penilaian</h1>
                <h1 className='text-[16px] font-medium mt-2'>4.8/5 dari 35 Ulasan</h1>
              </div>
            </div>
            <div className='flex justify-between'>
              <div>
                <div className='flex justify-between mt-12 gap-x-36'>
                  <h1 className='text-[28px] font-semibold'>Ringkasan Statistik</h1>
                  <div className='flex gap-x-4'>
                    <h1 className='text-[25px] font-semibold text-[#1f4068]'>1 Tahun</h1>
                    <Image src={Adjust} width={20} height={20} alt='adjust'/>
                  </div>
                </div>
                <div>
                  <div className='flex gap-3 items-end mt-4'> 
                    <div className='w-7 rounded-xl h-60 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-72 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-56 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-80 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-60 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-72 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-56 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-80 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-60 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-72 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-56 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-80 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-56 bg-[#4a90e2]'/>
                    <div className='w-7 rounded-xl h-80 bg-[#4a90e2]'/>
                  </div>
                </div>
              </div>
              <div className='flex items-end grid grid-cols-1 gap-y-2 mt-12'>
                <div className='bg-[#eff6fe] items-center flex justify-center w-[290px] h-[50px] rounded-[20px] '>
                  <h1 className='text-[20px] font-semibold text-[#1f4068]'>Notifikasi</h1>
                </div>
                <div className='bg-[#f6f6f6] px-5 rounded-[18px] mt-3'>
                  <h1 className=' pt-2 text-[15px] '><span className='font-semibold'>SummitGo</span> ingin membuat trip <br/>baru</h1>
                  <div className='flex justify-between text-[10px] text-[#848484] mt-2 mb-2'>
                    <h1>Baru Saja</h1>
                    <h1>22.32</h1>
                  </div>
                </div>
                <div className='bg-[#f6f6f6] px-5 rounded-[18px]'>
                  <h1 className=' pt-2 text-[15px] '><span className='font-semibold'>Fiqri</span> ingin menjadi Penyedia Jasa</h1>
                  <div className='flex justify-between text-[10px] text-[#848484] mt-2 mb-2'>
                    <h1>Baru Saja</h1>
                    <h1>22.32</h1>
                  </div>
                </div>
                <div className='bg-[#f6f6f6] px-5 rounded-[18px]'>
                  <h1 className=' pt-2 text-[15px] '><span className='font-semibold'>Farras1023</span> ingin menjadi<br/>Penyedia Jasa</h1>
                  <div className='flex justify-between text-[10px] text-[#848484] mt-2 mb-2'>
                    <h1>Kemarin</h1>
                    <h1>22.32</h1>
                  </div>
                </div>
                <div className='bg-[#f6f6f6] px-5 rounded-[18px]'>
                  <h1 className=' pt-2 text-[15px] '>Berita baru berhasil dibuat !</h1>
                  <div className='flex justify-between text-[10px] text-[#848484] mt-2 mb-2'>
                    <h1>Januari, 23</h1>
                    <h1>22.32</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       <Chart21/>
    </div> 
    </>
  )
}

export default page

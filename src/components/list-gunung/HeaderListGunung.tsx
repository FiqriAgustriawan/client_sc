
import React from "react";
import HeaderGunung from "@/assets/images/ImgBromo.png";
import Image from "next/image";

const HeaderListGunung = () => {
  return (
    <div>
      <div className="relative -top-[16px] overflow-hidden" >
        <Image
        width={0}
          src={HeaderGunung}
          alt="Mountain landscape"
          className=" object-cover"
        
  
        />
        <div className="absolute inset-0 flex flex-col pt-[47px] text-white justify-center items-start px-[20px] md:px-[50px] lg:px-[65px]">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[68px] font-semibold leading-tight">
            Pilih Gunung Favorit
            <br />
            Anda
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HeaderListGunung;
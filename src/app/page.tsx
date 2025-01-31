import React from 'react'
import HeroSection from '../components/HeroSection'
// import StatsSection from '../components/StatsSection'
import Adventages from '@/components/Adventages'
import WhatwOffer from '@/components/WhatwOffer'
import { LaciTanya } from '@/components/LaciTanya'
import ExploreMount from '@/components/ExploreMount'
import News2 from '@/components/News2'
import Story from '@/components/Story'
import ReadytoChallenge from '@/components/ReadytoChallenge'
import Footer  from '@/components/Footer'




export default function Home() {
  return (
    <>
      <HeroSection />
      <Adventages/>
      <WhatwOffer/>
      <ExploreMount/>
      <News2/>
      <Story/>
      <LaciTanya/>
      <ReadytoChallenge/>
      <Footer/>

    </>
  );
}

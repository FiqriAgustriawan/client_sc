import React from 'react'
import HeroSection from '../components/HeroSection'
import StatsSection from '../components/StatsSection'
import AboutUs from '../components/AboutUs'
import Adventages from '@/components/Adventages'
import WhatwOffer from '@/components/WhatwOffer'
import ExploreMount from '@/components/ExploreMount'
import News2 from '@/components/News2'
import Story from '@/components/Story'
import ReadytoChallenge from '@/components/ReadytoChallenge'


export default function Home() {
  return (
    <>
      <HeroSection />
      <Adventages/>
      <WhatwOffer/>
      <ExploreMount/>
      <News2/>
      <Story/>
      <ReadytoChallenge/>
    </>
  )
}






import React from 'react';
import Menu from "./Menu";
import Slideshow from './Slideshow';

export default function Home() {
  return (
    <>
      <section id='home'>
        <Slideshow />
      </section>
      <Menu />
    </>
  );
}

import React from 'react';
import Banner from '../components/Header/Banner';
import ProductsList from '../components/products/ProductsList';
import Services from '../components/Services/Services';
import Testimonials from '../components/Testimonial/Testimonials';

const HomeScreen = () => {
  return (
    <main className="w-full">
      <Banner />
      <Services />
      <ProductsList />
      <Testimonials />
    </main>
  );
};

export default HomeScreen;

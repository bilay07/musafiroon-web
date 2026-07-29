import React from 'react';

// Real Google reviews for Bin Aziz Tourism and Consultants (Pvt.) Ltd.
const TESTIMONIALS = [
  {
    name: 'Arsal',
    rating: 5,
    quote: 'I booked a 21-day customized Umrah package with Mr. Mawiz, and the experience was excellent. Flights, hotels, and transportation were exactly as promised. Highly recommended.',
  },
  {
    name: 'xoya khan',
    rating: 5,
    quote: 'My trip went very well and we were fully satisfied. The hotels in Makkah and Madinah were very nice and comfortable. The transport system was also very good.',
  },
  {
    name: 'Mehwish Naimat',
    rating: 5,
    quote: 'We had a great experience with Bin Aziz Tourism. They managed all our Umrah events perfectly and provided excellent service. We highly recommend them.',
  },
  {
    name: 'Bilal Haider',
    rating: 5,
    quote: "I recently performed Umrah through Bin Aziz Travels, and I'm extremely satisfied. From visa processing to accommodation, everything was smooth and well-organized.",
  },
  {
    name: 'Aliza Atique',
    rating: 5,
    quote: 'We booked our Umrah package from Lahore & Karachi even without visiting their office, everything was organised so well. Quick response anytime, 24/7.',
  },
  {
    name: 'Muhammad Bilal',
    rating: 5,
    quote: 'Excellent service from Bin Aziz Tourism and Consultant. True professionals who understand the nuances of Umrah travel. Handled with great care.',
  },
  {
    name: 'Hashmi Hasan',
    rating: 5,
    quote: 'With the cooperation of Bin Aziz, we came to Makkah for Umrah. It was a great experience. The hotels provided by their staff and management are excellent.',
  },
  {
    name: 'Shazia Kamal',
    rating: 5,
    quote: 'With the full support of Bin Aziz, their service and strategy are excellent. The experience was good with the support of their staff and owner Mr. Nouman Bin Aziz.',
  },
];

const MARQUEE_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS];

function TestimonialCard({ t }) {
  return (
    <div className="testimonial-card">
      <i className="fa-solid fa-quote-left text-2xl text-[#f0ca00] mb-4"></i>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.quote}"</p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <p className="font-bold text-gray-800">{t.name}</p>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <i key={star} className={`fa-solid fa-star text-xs ${star <= t.rating ? 'text-[#f0ca00]' : 'text-gray-200'}`}></i>
          ))}
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="w-full bg-[#f9fafb] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold text-theme-purple mb-3">What Our Pilgrims Say</h2>
          <p className="text-gray-500 text-lg">Real Google reviews from Bin Aziz Tourism &amp; Consultants</p>
        </div>
      </div>

      <div className="testimonial-marquee-viewport">
        <div className="testimonial-marquee-track">
          {MARQUEE_ITEMS.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

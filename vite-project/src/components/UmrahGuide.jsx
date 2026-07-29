import React, { useEffect, useState } from 'react';

const GUIDES = [
  {
    id: 'visa',
    icon: 'fa-passport',
    title: 'Visa Checklist',
    teaser: 'Documents you need before applying for your Umrah visa.',
    content: [
      'Passport valid for at least 6 months from your travel date, with at least one blank page.',
      'Recent passport-size photo with a white background.',
      'Proof of vaccination as required by Saudi health regulations for the current season.',
      "For women under 45 travelling without a mahram, a group booking with a registered agency (like Mosafiroon) is required.",
      'Confirmed hotel and flight details — we handle this as part of your package.',
    ],
  },
  {
    id: 'packing',
    icon: 'fa-suitcase-rolling',
    title: 'Packing Guide',
    teaser: 'What to pack so you travel light but prepared.',
    content: [
      'Ihram (2-3 sets for men), comfortable slip-on sandals.',
      'Modest, breathable clothing for women — most time is spent walking and standing.',
      'A small pouch/belt for your passport, phone, and cash — keep hands free.',
      'Basic medicines, wet wipes, and a reusable water bottle.',
      'Portable charger — you will use your phone a lot for navigation and photos.',
    ],
  },
  {
    id: 'ziyarat',
    icon: 'fa-mosque',
    title: 'First Ziyarat Tips',
    teaser: 'Making the most of your visits to historic sites.',
    content: [
      'Go early morning or late evening to avoid crowds and heat.',
      'Stay with your group — ziyarat sites can be crowded and easy to get separated in.',
      'Carry a printed or offline map of Makkah/Madinah in case of no signal.',
      'Be respectful of photography restrictions at certain religious sites.',
      'Ask your guide about the history of each site — it adds a lot to the experience.',
    ],
  },
  {
    id: 'ihram',
    icon: 'fa-user',
    title: 'Ihram Guide',
    teaser: 'Entering the state of Ihram correctly and comfortably.',
    content: [
      'Perform Ghusl (full-body wash) and wear Ihram clothing before crossing the Miqat.',
      'Men wear two unstitched white sheets; women wear simple, modest clothing covering the body.',
      'Recite the Talbiyah after entering Ihram, and continue until you begin Tawaf.',
      'Avoid perfume, cutting hair/nails, and marital relations while in Ihram.',
      "If unsure about anything, our team is available on WhatsApp throughout your journey.",
    ],
  },
];

function UmrahGuide() {
  const [openId, setOpenId] = useState(null);
  const openGuide = GUIDES.find((g) => g.id === openId);

  useEffect(() => {
    document.body.style.overflow = openGuide ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openGuide]);

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold text-theme-purple mb-3">Umrah Guide</h2>
          <p className="text-gray-500 text-lg">Practical tips to help first-time and returning pilgrims alike</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GUIDES.map((guide, i) => (
            <button
              type="button"
              key={guide.id}
              onClick={() => setOpenId(guide.id)}
              className="guide-card animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="guide-card-icon">
                <i className={`fa-solid ${guide.icon}`}></i>
              </div>
              <h3 className="guide-card-title">{guide.title}</h3>
              <p className="guide-card-teaser">{guide.teaser}</p>
              <span className="guide-card-cta">Read More <i className="fa-solid fa-arrow-right"></i></span>
            </button>
          ))}
        </div>
      </div>

      {openGuide && (
        <div className="guide-modal-backdrop" onClick={() => setOpenId(null)}>
          <div className="guide-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="guide-modal-close" onClick={() => setOpenId(null)} aria-label="Close">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="guide-modal-icon">
              <i className={`fa-solid ${openGuide.icon}`}></i>
            </div>
            <h3 className="guide-modal-title">{openGuide.title}</h3>
            <ul className="guide-modal-list">
              {openGuide.content.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default UmrahGuide;

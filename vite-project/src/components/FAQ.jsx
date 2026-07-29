import React, { useState } from 'react';

const FAQS = [
  {
    q: 'How long does Umrah visa processing take?',
    a: 'Umrah visa processing typically takes around 15 working days once all documents are complete. It may take a little longer during peak season (Ramadan).',
  },
  {
    q: 'What is included in a package?',
    a: 'Every package includes Umrah visa, hotel accommodation, and transport. Some packages also include ziyarat and meals — exact inclusions are listed on each package card.',
  },
  {
    q: 'What is the cancellation or refund policy?',
    a: 'Cancellation charges depend on how close the request is to the travel date. The exact policy is shared with you via WhatsApp at the time of booking confirmation.',
  },
  {
    q: 'Are group and family packages available?',
    a: 'Yes, we offer customized packages for families and groups as well — use the "Customize Package" section to share your requirements.',
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold text-theme-purple mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-lg">Answers to common questions about booking your Umrah</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between text-left px-5 py-4 bg-white hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-800 text-sm md:text-base pr-4">{item.q}</span>
                  <i className={`fa-solid fa-chevron-down text-[#f0ca00] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                </button>
                <div className={`faq-panel ${isOpen ? 'faq-panel-open' : ''}`}>
                  <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;

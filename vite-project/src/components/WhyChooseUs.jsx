import React from 'react';

const STATS = [
  { icon: 'fa-users', value: '10,000+', label: 'Pilgrims Served' },
  { icon: 'fa-award', value: '8+ Years', label: 'Industry Experience' },
  { icon: 'fa-shield-halved', value: 'IATA', label: 'Certified & Govt. Approved' },
  { icon: 'fa-headset', value: '24/7', label: 'Customer Support' },
];

function WhyChooseUs() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-extrabold text-theme-purple mb-3">Why Choose Mosafiroon</h2>
          <p className="text-gray-500 text-lg">Trusted by thousands of pilgrims for a safe, comfortable journey</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="animate-fade-in text-center p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#4a0000] via-[#810000] to-[#c20000] flex items-center justify-center">
                <i className={`fa-solid ${stat.icon} text-xl text-[#f0ca00]`}></i>
              </div>
              <p className="text-2xl font-extrabold text-theme-purple mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;

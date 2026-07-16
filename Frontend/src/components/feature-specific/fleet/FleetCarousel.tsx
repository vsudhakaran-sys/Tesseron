import * as React from "react";

export function FleetCarousel() {
  const slides = [
    {
      image: "/fleet_delivery_van.png",
      title: "Sustainable Mobility",
      desc: "Optimize TCO and carbon footprint with electric vehicle analytics.",
    },
    {
      image: "/driver_handover.png",
      title: "Seamless Handovers",
      desc: "Digitally log odometer readings, agreements, and driver safety checks.",
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border shadow-sm bg-slate-50 dark:bg-slate-900/50 mt-4 group">
      <div className="relative h-[200px] w-full">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === activeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3.5 text-white space-y-0.5">
              <h4 className="text-[10px] font-bold tracking-wider uppercase text-blue-400">{slide.title}</h4>
              <p className="text-[10px] font-semibold leading-relaxed opacity-90">{slide.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute top-2.5 right-2.5 flex gap-1 z-10 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              idx === activeIndex ? "bg-blue-400 w-2.5" : "bg-white/50"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

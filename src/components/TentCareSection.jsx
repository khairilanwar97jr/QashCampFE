import innerTent from "../assets/innertent_bersih-optimized.jpg";
import dryingTent from "../assets/ourtent_outside_jemur-optimized.jpg";
import pickup from "../assets/customer_pickup_notification-optimized.jpg";

const moments = [
  { image: innerTent, title: "Clean on the inside", label: "01 / Inner tent", text: "Ruang yang bersih untuk berehat selepas seharian menikmati alam.", alt: "Clean interior of a Qashcamp tent", width: 1080, height: 1350 },
  { image: dryingTent, title: "A little sunshine & care", label: "02 / Airing out", text: "Khemah dijemur dan dianginkan sebelum dikemas untuk trip seterusnya.", alt: "Qashcamp tent set up outdoors to air and dry", width: 1080, height: 1350 },
  { image: pickup, title: "Packed for your escape", label: "03 / Ready for pickup", text: "Barang camping siap dikemas untuk pickup. Ambil, bawa, dan nikmati perjalanan anda.", alt: "Camping equipment packed and ready for customer pickup", width: 960, height: 1280 },
];

export default function TentCareSection({ onExpand }) {
  return (
    <section className="mx-auto mb-16 max-w-6xl rounded-[2rem] bg-[#263D32] px-5 py-8 text-[#F7F1DE] md:mb-24 md:p-10" aria-labelledby="tent-care-title">
      <header className="mb-8 max-w-2xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6CA8D]">Behind your next escape</p>
        <h2 id="tent-care-title" className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">A little care.<br /><span className="font-serif italic text-[#E6CA8D]">A better camping experience.</span></h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#F7F1DE]/75">Dari ruang dalam khemah hingga barang yang siap untuk pickup. Ini persediaan kami untuk adventure anda.</p>
      </header>
      <div className="relative isolate space-y-8 pb-8 md:hidden" role="region" aria-label="Tent care cards that stack as you scroll">
        <p className="text-xs tracking-wide text-[#E6CA8D]">Scroll to discover our care routine</p>
        {moments.map((moment, index) => (
          <article key={moment.title}
            className="sticky overflow-hidden rounded-2xl border border-[#C6A969]/40 bg-[#F7F1DE] text-[#263D32] shadow-[0_-8px_30px_rgba(0,0,0,0.18)]"
            style={{ top: 20 + index * 16, zIndex: index + 1 }}>
            <div className="border-b border-[#263D32]/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#597E52]">{moment.label}</p>
            </div>
            <button type="button" onClick={() => onExpand(moment.image)}
              aria-label={`Enlarge: ${moment.alt}`} className="block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C6A969]">
              <img src={moment.image} alt={moment.alt} width={moment.width} height={moment.height} loading="lazy" decoding="async"
                className="h-[min(34svh,260px)] w-full object-cover object-[center_65%]" />
            </button>
            <div className="min-h-[140px] p-4">
              <h3 className="text-xl font-semibold tracking-tight">{moment.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#263D32]/80">{moment.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="hidden md:grid md:grid-cols-3 md:gap-5">
        {moments.map((moment) => (
          <article key={moment.title}>
            <button type="button" onClick={() => onExpand(moment.image)} aria-label={`Enlarge: ${moment.alt}`} className="block w-full cursor-zoom-in overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E6CA8D]">
              <img src={moment.image} alt={moment.alt} width={moment.width} height={moment.height} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover transition-transform duration-500 hover:scale-[1.03] motion-reduce:transition-none" />
            </button>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6CA8D]">{moment.label}</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">{moment.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#F7F1DE]/75">{moment.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}


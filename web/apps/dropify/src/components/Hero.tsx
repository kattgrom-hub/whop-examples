import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-32 md:py-44 lg:py-52 text-center">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-primary leading-[1.1]">
        Crafted Light
      </h1>
      <p className="mt-6 max-w-lg text-base md:text-lg font-light leading-relaxed text-secondary">
        Hand-poured in small batches from sustainably sourced beeswax. Each candle is a meditation on scent, light, and place.
      </p>
      <Link
        href="/shop"
        className="mt-10 inline-block bg-gold px-10 py-3.5 text-sm font-medium tracking-wide text-primary rounded-sm transition-all duration-500 hover:bg-gold-hover"
      >
        Shop Collection
      </Link>
    </section>
  );
}

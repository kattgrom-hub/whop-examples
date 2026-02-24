import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Newsletter from "@/components/Newsletter";
import { products } from "@/data/products";

export default function Home() {
  const featured = products.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Featured Collection */}
      <section className="px-6 lg:px-8 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-primary">
              Featured Collection
            </h2>
            <p className="mt-3 text-sm font-light text-secondary">
              Our most beloved scents, chosen by you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-6 lg:px-8 py-20 md:py-28 bg-neutral-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Text */}
            <div>
              <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-primary">
                Our Story
              </h2>
              <p className="mt-6 text-sm font-light leading-[1.8] text-secondary">
                Lumiere was born from a simple belief: the light we surround
                ourselves with shapes how we feel. In our sun-filled atelier on
                the California coast, every candle is hand-poured in small
                batches using sustainably sourced beeswax and pure essential
                oils. No synthetic fragrances, no shortcuts.
              </p>
              <p className="mt-5 text-sm font-light leading-[1.8] text-secondary">
                Each scent is developed over months of careful refinement,
                layering notes to create fragrances that evolve as they burn —
                revealing new dimensions over the course of 50 to 60 hours. We
                believe luxury should be quiet, intentional, and rooted in
                craft.
              </p>
            </div>

            {/* Atelier Image */}
            <div className="aspect-[4/5] bg-neutral-100 overflow-hidden rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=800&h=1000&fit=crop"
                alt="Our sun-filled candle atelier on the California coast"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </>
  );
}

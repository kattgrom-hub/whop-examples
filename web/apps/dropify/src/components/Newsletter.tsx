"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-2xl md:text-3xl font-extralight tracking-tight text-primary leading-tight">
          Stay in the Light
        </h2>
        <p className="mt-4 text-sm font-light text-secondary leading-relaxed">
          New scents, limited editions, and stories from our atelier — delivered
          to your inbox.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmail("");
          }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 max-w-sm border border-neutral-200 px-5 py-3 text-sm font-light text-primary placeholder:text-neutral-400 rounded-sm outline-none transition-colors duration-400 focus:border-neutral-400"
          />
          <button
            type="submit"
            className="bg-gold px-8 py-3 text-sm font-medium tracking-wide text-primary rounded-sm transition-all duration-500 hover:bg-gold-hover"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

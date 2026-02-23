import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-lg font-light tracking-[0.3em] text-primary"
            >
              LUMIERE
            </Link>
            <p className="mt-4 text-xs font-light leading-relaxed text-secondary max-w-xs">
              Hand-poured luxury candles crafted from sustainable beeswax in our
              California atelier.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.15em] text-primary mb-4">
              SHOP
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/shop"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  All Candles
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  Gift Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.15em] text-primary mb-4">
              ABOUT
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  Journal
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-medium tracking-[0.15em] text-primary mb-4">
              SUPPORT
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-xs font-light text-secondary transition-colors duration-400 hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-light text-neutral-400">
            &copy; {new Date().getFullYear()} Lumiere. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-[11px] font-light text-neutral-400 transition-colors duration-400 hover:text-primary"
            >
              Instagram
            </a>
            <a
              href="#"
              className="text-[11px] font-light text-neutral-400 transition-colors duration-400 hover:text-primary"
            >
              Pinterest
            </a>
            <a
              href="#"
              className="text-[11px] font-light text-neutral-400 transition-colors duration-400 hover:text-primary"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

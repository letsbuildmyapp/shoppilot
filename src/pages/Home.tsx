import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SEED_PRODUCTS } from '@/seed/products';
import { formatMoney } from '@/lib/utils';

export default function Home() {
  const featured = SEED_PRODUCTS.slice(0, 6);

  return (
    <div>
      {/* Hero — full-bleed photograph */}
      <section className="relative h-[78vh] min-h-[560px] bg-bone-100 overflow-hidden border-b border-line">
        <img
          src="https://images.unsplash.com/photo-1576247040893-e85ed6f5818c?auto=format&fit=crop&w=2200&q=85"
          alt="Hand-thrown stoneware on a wooden workbench"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bone-50/10 via-bone-50/0 to-coal/40" />
        <div className="relative z-10 container-edit h-full flex flex-col justify-end pb-16 md:pb-24">
          <p className="eyebrow text-bone-50 mb-5">Spring 2026 · Vermont</p>
          <h1 className="display-xl text-bone-50 max-w-[14ch]">
            Made by hand,<br />by one studio.
          </h1>
          <p className="mt-6 text-bone-50/95 max-w-[42ch] text-lg">
            Hand-thrown stoneware and porcelain. Fired in batches of thirty, signed at the foot.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary bg-bone-50 !text-coal hover:!bg-bone-200">
              Shop the studio <ArrowRight className="size-4" />
            </Link>
            <Link to="/about" className="btn-outline !border-bone-50 !text-bone-50 hover:!bg-bone-50 hover:!text-coal">
              About the studio
            </Link>
          </div>
        </div>
      </section>

      {/* Featured grid */}
      <section className="container-edit py-20 md:py-28">
        <div className="flex items-end justify-between mb-12 gap-8">
          <div>
            <p className="eyebrow mb-3">Selected work</p>
            <h2 className="display-md max-w-[20ch]">A handful of pieces from the spring firing.</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-sm text-forest hover:text-forest-deep">
            All work <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {featured.map((p) => (
            <Link key={p.id} to={`/p/${p.slug}`} className="group">
              <div className="aspect-[4/5] bg-bone-100 overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div>
                  <p className="font-display text-2xl leading-tight">{p.name}</p>
                  <p className="text-sm text-coal-mute mt-1">{p.shortDescription}</p>
                </div>
                <p className="text-sm num text-coal-soft shrink-0">{formatMoney(p.basePriceCents)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial blurb */}
      <section className="border-t border-line bg-bone-100 py-24">
        <div className="container-prose text-center">
          <p className="eyebrow mb-5">From the studio</p>
          <p className="display-md leading-[1.15]">
            Each piece is wheel-thrown, trimmed by hand, signed, and fired in batches of about thirty.
          </p>
          <p className="mt-7 text-coal-soft text-lg leading-relaxed max-w-[60ch] mx-auto">
            Variation between pieces in the same firing isn't a flaw — it's the record of what the kiln did that week. We list each batch as it cools.
          </p>
          <div className="mt-10">
            <Link to="/about" className="btn-outline">Read the studio story</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

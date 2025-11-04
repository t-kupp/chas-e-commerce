"use client";
import Link from "next/link";

export default function Hero() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url('/hero_image.jpg')`,
          backgroundPosition: "center center",
        }}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Additional gradient overlays for depth */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-black/30"></div>
      <div className="absolute inset-0 from-transparent via-transparent to-black/50"></div>
      <div className="ml-10">
        <div className="flex items-center justify-between mr-7">
          {/* Left content */}
          <div className="flex-1 max-w-2xl">
            <div className="text-yellow-400 text-lg font-medium tracking-wider uppercase mb-4 drop-shadow-lg">
              Catch.Collect.Battle.
            </div>

            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              POKEMON{" "}
              <span className="text-yellow-400 bg-clip-text">STORE</span>
            </h1>

            <p className="text-gray-100 text-xl lg:text-2xl mb-8 leading-relaxed max-w-lg drop-shadow-lg">
              Discover rare cards and build the ultimate deck. For trainers
              everywhere.
            </p>
            <Link href="/products">
              <button className="group bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-orange-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl drop-shadow-lg">
                <span className="flex items-center gap-2">Shop Cards</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToProducts}
        className="absolute bottom-8 left-1/2 transform text-white/80">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 drop-shadow-lg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </button>
    </section>
  );
}

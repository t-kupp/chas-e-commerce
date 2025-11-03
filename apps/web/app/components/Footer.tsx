import Image from "next/image";

export default function Footer() {
  return (
  <footer className="bg-gray-800 text-gray-300 border-t-8 border-yellow-400">
      <div className="xl:mx-16! py-6! px-6! xl:px-0!">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/*  logo */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <h3 className="text-2xl font-extrabold text-yellow-400 tracking-wider">
              POKÉMON STORE
            </h3>
            <p className="mt-4! text-sm text-gray-400">
              Gotta catch 'em all! Your trusted source for genuine Pokémon TCG
              cards.
              <Image
                src="/pokeball.png"
                alt="Poké Ball Icon"
                width={40}
                height={40}
                className="w-10 h-10 mt-4!"
                priority
              />
            </p>
          </div>

          {/*  shop categories */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4! border-b border-yellow-500/50 pb-1!">
              Shop
            </h3>
            <ul className="space-y-3! text-sm">
              <li>
                <a
                  href="/category/booster-packs"
                  className="hover:text-yellow-400! transition-colors"
                >
                  Booster Packs
                </a>
              </li>
              <li>
                <a
                  href="/category/deck-boxes"
                  className="hover:text-yellow-400! transition-colors"
                >
                  Deck Boxes
                </a>
              </li>
              <li>
                <a
                  href="/category/single-cards"
                  className="hover:text-yellow-400! transition-colors"
                >
                  Single Cards
                </a>
              </li>
            </ul>
          </div>

          {/*  customer service & account */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4! border-b border-yellow-500/50 pb-1!">
              Support
            </h3>
            <ul className="space-y-3! text-sm">
              <li>
                <a
                  href="/account"
                  className="hover:text-yellow-400! transition-colors"
                >
                  My Account
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  className="hover:text-yellow-400! transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="hover:text-yellow-400! transition-colors"
                >
                  FAQ & Help Center
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-yellow-400! transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/*  newsletter & social */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold text-white mb-4! border-b border-yellow-500/50 pb-1!">
              Join the League
            </h3>
            <p className="text-sm text-gray-400 mb-4!">
              Get 10% off your first order and news on rare card drops!
            </p>
            <form className="flex mt-2!">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-white rounded-l-sm border-0 p-2! text-gray-800 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold p-3! rounded-r-md transition-colors"
              >
                Go!
              </button>
            </form>
          </div>
        </div>

        {/* bottom bar*/}
        <div className="mt-5! border-t border-gray-700 p-2! flex items-center flex-col justify-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Pokémon Store. This site is
            fan-made and not affiliated with Nintendo or The Pokémon Company.
          </p>
        </div>
      </div>
    </footer>
  );
}

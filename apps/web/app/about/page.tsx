import Link from "next/link";
import { ShieldCheck, Truck, Globe } from "lucide-react";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Pokémon Store — our story, mission and team. A fan-made shop for collectors and players, focused on authenticity and fast shipping.",
};

// team members
const teamMembers = [
  {
    name: "Embla A.",
    role: "Head Card Curator",
    description: "Masters inventory and authenticates rare cards.",
  },
  {
    name: "Jan TK.",
    role: "Customer Success Trainer",
    description: "Ensures every collector has a 5-star experience.",
  },
  {
    name: "Daniel T.",
    role: "Swift Logistics Operator",
    description: "In charge of fast, secure, and damage-free shipping.",
  },
  {
    name: "Joel K.",
    role: "Digital Deck Strategist",
    description: "Optimizes the site and merchandising for easy finding.",
  },
  {
    name: "Zarha B.",
    role: "Community Guild Leader",
    description: "Manages social media and collector outreach.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* hero */}
      <section className="bg-gray-800 text-white border-b-8 border-yellow-400">
        <div className="px-4 py-20 text-center">
          <h1 className="md:text-6xl font-extrabold tracking-tight text-yellow-400">
            About Pokémon Store
          </h1>
          <p className="mt-4 text-gray-200 text-xl max-w-3xl mx-auto">
            We’re a fan-run store for Pokémon TCG collectors and players. We
            curate rare and everyday cards with a focus on{" "}
            <b>authenticity, fair prices, and fast shipping.</b>
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/products"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-xl shadow-lg transition-transform duration-200 transform hover:scale-105"
            >
              Start Collecting
            </Link>
            <Link
              href="/contact"
              className="inline-block border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Contact the Team
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* our core values */}
          <article className="lg:col-span-2 bg-white rounded-xl shadow-xl p-8 h-full flex flex-col justify-start">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3 border-yellow-400/50">
              Our Core Values
            </h2>
            <ul className="space-y-6 text-gray-700">
              {/* value 1: authenticity */}
              <li className="flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-red-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Guaranteed Genuine
                  </h3>
                  <p className="text-sm mt-1">
                    Every card is sourced from official distributors and
                    authenticated by our Head Curators. Never worry about fakes.
                  </p>
                </div>
              </li>
              {/* value 2: speed & condition */}
              <li className="flex items-start gap-4">
                <Truck className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Swift & Secure Shipping
                  </h3>
                  <p className="text-sm mt-1">
                    We use industrial-grade packaging and fast logistics to
                    ensure your cards arrive in <b>Mint Condition</b>.
                  </p>
                </div>
              </li>
              {/* value 3: community first */}
              <li className="flex items-start gap-4">
                <Globe className="w-8 h-8 text-green-600 shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    Built by Collectors
                  </h3>
                  <p className="text-sm mt-1">
                    We price fairly, list honestly, and constantly engage with
                    the TCG community to serve your needs best.
                  </p>
                </div>
              </li>
            </ul>
          </article>

          {/* our story & mission */}
          <div className="lg:col-span-3 space-y-12">
            <article className="bg-white rounded-xl shadow-xl p-8 border-l-4 border-yellow-400">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Our Origin Story
              </h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Pokémon Store started as a small group of collectors who met
                over trades and tournaments. We wanted a place where fellow fans
                could find both rare pulls and everyday staples{" "}
                <b>curated with care and presented honestly.</b> Over time we
                grew into a trusted online shop that focuses intensely on
                authenticity, quality grading, and a truly excellent customer
                experience. We are here to simplify and celebrate the art of
                collecting.
              </p>
            </article>

            {/* mission & join CTA block */}
            <aside className="bg-gray-800 text-white rounded-xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">
                Our Mission: The Journey Continues
              </h2>
              <p className="text-gray-300">
                To make collecting <b>accessible and fun</b> — whether you’re
                chasing a rare holo or building a competitive deck. We source
                responsibly and work to keep the community first. Every purchase
                helps us keep running and providing the best cards!
              </p>

              <div className="mt-8 border-t border-gray-700 pt-6">
                <h4 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                  Catch Exclusive Drops
                </h4>
                <p className="mt-2 text-sm text-gray-400">
                  Sign up for early access to rare cards, sales, and special
                  offers.
                </p>
                <form className="mt-4 flex max-w-md">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    aria-label="Email"
                    className="flex-1 rounded-l-lg border-none p-3 text-gray-900 bg-white text-sm focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
                  />
                  <button className="bg-red-600 hover:bg-red-700 text-white rounded-r-lg px-6 font-bold transition-colors">
                    Join
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>

        {/* team section */}
        <section className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">
            Meet Our Trainers
          </h2>
          <p className="mt-3 text-gray-600 text-lg">
            The small crew of dedicated collectors and players making Poké Store
            run.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-gray-800 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-800 shrink-0">
                    <span className="text-xl font-extrabold text-gray-700">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-base font-semibold text-gray-600">
                      {member.role}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-700 italic border-t pt-3 mt-3 border-gray-100">
                  {member.description}
                </p>
              </article>
            ))}

            {/* join us card */}
            <article className="hidden lg:flex flex-col justify-center items-center bg-gray-100 rounded-xl p-6 shadow-inner border-4 border-dashed border-gray-400 text-center">
              <h4 className="text-xl font-bold text-gray-600">
                Could this be you?
              </h4>
              <p className="text-sm mt-2 text-gray-500">
                We're always looking for new members to join our league.
              </p>
              <Link
                href="/careers"
                className="mt-3 text-yellow-600 hover:underline font-medium text-sm"
              >
                View open roles
              </Link>
            </article>
          </div>
        </section>

        {/* final CTA */}
        <section className="mt-16 bg-gray-800 text-white rounded-xl shadow-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-yellow-400">
            Ready to Catch Your Next Card?
          </h3>
          <p className="mt-3 text-gray-300 text-lg">
            Explore our curated inventory or reach out if you have questions
            about authenticity or sourcing.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg shadow-lg transition-transform duration-200 transform hover:scale-105"
            >
              Browse The Collection
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

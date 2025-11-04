import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Pokémon Store team for support, business inquiries, or rare card requests.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* hero */}
      <section
        className="bg-gray-800 text-white border-b-8 border-yellow-400"
        aria-labelledby="page-title"
      >
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center">
          <h1
            id="page-title"
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-yellow-400"
          >
            Get In Touch
          </h1>
          <p className="mt-4 text-gray-200 text-xl max-w-3xl text-center">
            Have a question about an order, need help grading a card, or just
            want to chat Pokémon? We&apos;re here!
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <section
            className="lg:col-span-2"
            aria-labelledby="contact-form-heading"
          >
            <h2
              id="contact-form-heading"
              className="text-3xl font-bold text-gray-900 mb-6"
            >
              Send a Message
            </h2>
            <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-yellow-400">
              <form className="space-y-6" aria-label="Contact form" noValidate>
                {/* name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Full Name{" "}
                    <span className="text-red-600" aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    aria-required="true"
                    aria-describedby="name-hint"
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-yellow-400 focus:border-yellow-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                  <span id="name-hint" className="sr-only">
                    Enter your full name
                  </span>
                </div>

                {/* email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Email Address{" "}
                    <span className="text-red-600" aria-label="required">
                      *
                    </span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    aria-required="true"
                    aria-describedby="email-hint"
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-yellow-400 focus:border-yellow-500 focus:outline-none transition-colors"
                    placeholder="john.doe@example.com"
                  />
                  <span id="email-hint" className="sr-only">
                    Enter a valid email address
                  </span>
                </div>

                {/* subject/topic */}
                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Topic{" "}
                    <span className="text-red-600" aria-label="required">
                      *
                    </span>
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    required
                    aria-required="true"
                    aria-describedby="topic-hint"
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-yellow-400 focus:border-yellow-500 focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Select a topic</option>
                    <option value="order-support">
                      Order Support (Shipping/Returns)
                    </option>
                    <option value="product-question">
                      Product Question (Grading/Authenticity)
                    </option>
                    <option value="business-inquiry">
                      Business Inquiry / Partnership
                    </option>
                    <option value="rare-card">
                      I Found a Rare Card for Sale!
                    </option>
                    <option value="general">General Question / Feedback</option>
                  </select>
                  <span id="topic-hint" className="sr-only">
                    Choose the topic that best describes your inquiry
                  </span>
                </div>

                {/* message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    Your Message{" "}
                    <span className="text-red-600" aria-label="required">
                      *
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    aria-required="true"
                    aria-describedby="message-hint"
                    className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-4 focus:ring-yellow-400 focus:border-yellow-500 focus:outline-none transition-colors resize-vertical"
                    placeholder="Tell us what you need help with..."
                  />
                  <span id="message-hint" className="sr-only">
                    Enter your message with details about your inquiry
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-3 bg-green-600 text-white font-bold rounded-lg text-lg shadow-md hover:bg-green-700 focus:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 transition-colors"
                  aria-label="Submit contact form"
                >
                  Send Message
                </button>
              </form>
            </div>
          </section>

          {/* quick help */}
          <aside aria-labelledby="quick-help-heading">
            <h2
              id="quick-help-heading"
              className="text-3xl font-bold text-gray-900 mb-6"
            >
              Quick Help
            </h2>
            <div className="space-y-6">
              {/* email card */}
              <article className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-800">
                <Mail
                  className="w-8 h-8 text-blue-800 mb-3"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  General & Support
                </h3>
                <p className="text-sm text-gray-700">
                  The fastest way to reach us. We typically respond within 1-2
                  business days.
                </p>
                <a
                  href="mailto:support@pokemonstore.com"
                  className="mt-3 block text-blue-800 font-semibold hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-blue-600 focus:rounded"
                  aria-label="Email support at support@pokemonstore.com"
                >
                  support@pokemonstore.com
                </a>
              </article>

              {/* FAQ/help card */}
              <article className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <MessageCircle
                  className="w-8 h-8 text-yellow-500 mb-3"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Common Questions
                </h3>
                <p className="text-sm text-gray-700">
                  Check our FAQ first. You might find instant answers about
                  shipping, grading, or returns.
                </p>
                <Link
                  href="/faq"
                  className="mt-3 block text-yellow-700 font-semibold hover:underline focus:underline focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:rounded"
                >
                  Go to FAQ / Help Center
                </Link>
              </article>

              {/* physical location  */}
              <article className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                <MapPin
                  className="w-8 h-8 text-red-500 mb-3"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Physical Address
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  For mail, returns, and business correspondence only. (No
                  retail walk-ins).
                </p>
                <address className="text-sm font-medium text-gray-800 not-italic">
                  Pokémon Store HQ
                  <br />
                  Arenavägen 61, 121 77 Johanneshov
                </address>
              </article>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

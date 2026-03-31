import Link from "next/link";

export default function ContactPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-900 lg:text-5xl">Contact Us</h1>
            <p className="mt-4 text-lg text-gray-600">
              Get in touch with our team. We are here to help you succeed in your business endeavors.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Contact Form */}
            <div className="lg:col-span-8">
              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">Send us a Message</h2>
                <form>
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Full Name *</label>
                      <input type="text" id="name" name="name" required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gbr-accent focus:outline-none focus:ring-1 focus:ring-gbr-accent" />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email Address *</label>
                      <input type="email" id="email" name="email" required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gbr-accent focus:outline-none focus:ring-1 focus:ring-gbr-accent" />
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
                      <input type="tel" id="phone" name="phone" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gbr-accent focus:outline-none focus:ring-1 focus:ring-gbr-accent" />
                    </div>
                    <div>
                      <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">Subject *</label>
                      <select id="subject" name="subject" required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gbr-accent focus:outline-none focus:ring-1 focus:ring-gbr-accent">
                        <option value="">Select Subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="investment">Investment Inquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">Message *</label>
                    <textarea id="message" name="message" rows={5} required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gbr-accent focus:outline-none focus:ring-1 focus:ring-gbr-accent" />
                  </div>
                  <button type="submit" className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: "#0083ae", borderColor: "#0083ae" }}>
                    <i className="bi bi-send me-2"></i>Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-4">
              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <h2 className="mb-6 text-lg font-semibold text-gray-900">Get in Touch</h2>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900">
                    <i className="bi bi-geo-alt me-2" style={{ color: "#0083ae" }}></i>Office Address
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">123 Business District<br />Global Trade Center<br />New York, NY 10001</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900">
                    <i className="bi bi-telephone me-2" style={{ color: "#0083ae" }}></i>Phone
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">+1 (555) 123-4567</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900">
                    <i className="bi bi-envelope me-2" style={{ color: "#0083ae" }}></i>Email
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">contact@gbr.com</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900">
                    <i className="bi bi-clock me-2" style={{ color: "#0083ae" }}></i>Business Hours
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-gray-900">Follow Us</h3>
                  <div className="flex gap-2">
                    <Link href="#" className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm" style={{ borderColor: "#0083ae", color: "#0083ae" }}>
                      <i className="bi bi-linkedin"></i>
                    </Link>
                    <Link href="#" className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm" style={{ borderColor: "#0083ae", color: "#0083ae" }}>
                      <i className="bi bi-twitter"></i>
                    </Link>
                    <Link href="#" className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm" style={{ borderColor: "#0083ae", color: "#0083ae" }}>
                      <i className="bi bi-facebook"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

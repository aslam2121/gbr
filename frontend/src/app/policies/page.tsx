export default function PoliciesPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-900 lg:text-5xl">Policies &amp; Terms</h1>
            <p className="mt-4 text-lg text-gray-600">
              Understanding our policies helps ensure a safe and productive environment for all members.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Sidebar nav */}
            <div className="lg:col-span-3">
              <div className="rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
                <div className="border-b border-gray-200 px-4 py-3">
                  <h2 className="text-sm font-semibold text-gray-900">Quick Navigation</h2>
                </div>
                <div className="flex flex-col">
                  <a href="#privacy" className="border-b border-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Privacy Policy</a>
                  <a href="#terms" className="border-b border-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Terms of Service</a>
                  <a href="#community" className="border-b border-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Community Guidelines</a>
                  <a href="#refund" className="border-b border-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Refund Policy</a>
                  <a href="#data" className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Data Protection</a>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-9">
              {/* Privacy Policy */}
              <div id="privacy" className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Privacy Policy</h2>
                <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                  <p className="mb-4 text-sm text-gray-600"><strong>Last updated:</strong> September 5, 2025</p>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Information We Collect</h3>
                  <p className="mb-4 text-sm text-gray-600">We collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support.</p>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">How We Use Your Information</h3>
                  <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>To provide and maintain our services</li>
                    <li>To connect you with relevant business opportunities</li>
                    <li>To communicate with you about our services</li>
                    <li>To improve our platform and user experience</li>
                  </ul>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Information Sharing</h3>
                  <p className="text-sm text-gray-600">We do not sell or rent your personal information to third parties. We may share your information in limited circumstances as outlined in our full privacy policy.</p>
                </div>
              </div>

              {/* Terms of Service */}
              <div id="terms" className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Terms of Service</h2>
                <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                  <p className="mb-4 text-sm text-gray-600"><strong>Last updated:</strong> September 5, 2025</p>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Acceptance of Terms</h3>
                  <p className="mb-4 text-sm text-gray-600">By accessing or using Global Business Directory, you agree to be bound by these Terms of Service.</p>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">User Responsibilities</h3>
                  <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Respect other users and maintain professional conduct</li>
                  </ul>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Prohibited Activities</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>Fraudulent or misleading representations</li>
                    <li>Spam or unsolicited communications</li>
                    <li>Harassment or discriminatory behavior</li>
                    <li>Violation of intellectual property rights</li>
                  </ul>
                </div>
              </div>

              {/* Community Guidelines */}
              <div id="community" className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Community Guidelines</h2>
                <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Our Community Values</h3>
                  <p className="mb-4 text-sm text-gray-600">Global Business Directory is built on trust, respect, and professional collaboration.</p>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Professional Conduct</h3>
                  <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>Maintain professional communication standards</li>
                    <li>Be respectful in all interactions</li>
                    <li>Provide honest and accurate business information</li>
                    <li>Honor business commitments and agreements</li>
                  </ul>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Content Standards</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>Keep content relevant to business networking</li>
                    <li>Avoid offensive or inappropriate material</li>
                    <li>Respect confidentiality agreements</li>
                    <li>Use proper grammar and professional language</li>
                  </ul>
                </div>
              </div>

              {/* Refund Policy */}
              <div id="refund" className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Refund Policy</h2>
                <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Premium Services</h3>
                  <p className="mb-4 text-sm text-gray-600">We offer a 30-day satisfaction guarantee for our premium services. If you&apos;re not satisfied, contact us within 30 days for a full refund.</p>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Consultation Services</h3>
                  <p className="mb-4 text-sm text-gray-600">Refunds for expert consultation services are handled on a case-by-case basis. Please contact our support team to discuss your specific situation.</p>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Processing Time</h3>
                  <p className="text-sm text-gray-600">Approved refunds are typically processed within 5-7 business days and will appear on your original payment method.</p>
                </div>
              </div>

              {/* Data Protection */}
              <div id="data" className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Data Protection</h2>
                <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Security Measures</h3>
                  <p className="mb-4 text-sm text-gray-600">We implement industry-standard security measures to protect your personal and business information.</p>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Your Rights</h3>
                  <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-gray-600">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your data</li>
                    <li>Export your data</li>
                  </ul>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">Contact for Data Requests</h3>
                  <p className="text-sm text-gray-600">For any data protection inquiries, contact our Data Protection Officer at privacy@gbr.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

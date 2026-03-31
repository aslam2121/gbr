import { AuthHeader } from "@/modules/cms-sections/AuthHeader";

export default function MessagingPage() {
  return (
    <>
      <AuthHeader />
      <main className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Business Messaging</h1>
            <p className="text-sm text-gray-600">Connect with investors, companies, and experts through secure GBR conversations.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Contacts List */}
            <div className="lg:col-span-4">
              <div className="h-full overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center justify-between p-3 text-white" style={{ backgroundColor: "#033443" }}>
                  <h2 className="text-base font-semibold">Messages</h2>
                  <button className="rounded bg-white px-2 py-1 text-xs text-gray-700" type="button">
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  <a href="#" className="block p-3" style={{ backgroundColor: "#e7f9fc" }}>
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-gray-900">Tech Innovations Corp</strong>
                      <small className="text-xs text-gray-500">3m</small>
                    </div>
                    <small className="text-xs text-gray-500">Looking forward to discussing your proposal.</small>
                  </a>
                  <a href="#" className="block p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-gray-900">Global Investors LLC</strong>
                      <small className="text-xs text-gray-500">1h</small>
                    </div>
                    <small className="text-xs text-gray-500">Can we schedule a call for tomorrow?</small>
                  </a>
                  <a href="#" className="block p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-gray-900">Dr. Sarah Johnson</strong>
                      <small className="text-xs text-gray-500">2h</small>
                    </div>
                    <small className="text-xs text-gray-500">I can support your market expansion strategy.</small>
                  </a>
                  <a href="#" className="block p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-gray-900">FinBridge Partners</strong>
                      <small className="text-xs text-gray-500">Yesterday</small>
                    </div>
                    <small className="text-xs text-gray-500">Thanks for sharing the financial model.</small>
                  </a>
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
                {/* Chat header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-white p-3">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Tech Innovations Corp</h2>
                    <small className="text-xs text-gray-500">Online now</small>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded border px-2 py-1 text-sm" style={{ borderColor: "#0083ae", color: "#0083ae" }} type="button">
                      <i className="bi bi-telephone"></i>
                    </button>
                    <button className="rounded border px-2 py-1 text-sm" style={{ borderColor: "#0083ae", color: "#0083ae" }} type="button">
                      <i className="bi bi-camera-video"></i>
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4" style={{ minHeight: "360px", backgroundColor: "#f7fafb" }}>
                  {/* Incoming */}
                  <div className="mb-4 flex">
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <p className="mb-1 text-sm">Hello, thanks for connecting with us on GBR.</p>
                      <small className="text-xs text-gray-400">10:05 AM</small>
                    </div>
                  </div>
                  {/* Outgoing */}
                  <div className="mb-4 flex justify-end">
                    <div className="rounded-lg p-3 text-white" style={{ backgroundColor: "#0582ad", maxWidth: "80%" }}>
                      <p className="mb-1 text-sm">Thank you. I am interested in exploring your expansion plan.</p>
                      <small className="text-xs text-blue-100">10:07 AM</small>
                    </div>
                  </div>
                  {/* Incoming */}
                  <div className="mb-4 flex">
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                      <p className="mb-1 text-sm">Great. We can share projections and onboarding details.</p>
                      <small className="text-xs text-gray-400">10:10 AM</small>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 bg-white p-3">
                  <form className="grid grid-cols-12 gap-2">
                    <div className="col-span-9">
                      <input type="text" placeholder="Type your message..." className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                    <div className="col-span-2">
                      <button className="w-full rounded-md border px-3 py-2 text-sm" style={{ borderColor: "#0083ae", color: "#0083ae" }} type="button">
                        <i className="bi bi-paperclip"></i>
                      </button>
                    </div>
                    <div className="col-span-1">
                      <button className="w-full rounded-md px-3 py-2 text-sm text-white" style={{ backgroundColor: "#0083ae" }} type="submit">
                        <i className="bi bi-send"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

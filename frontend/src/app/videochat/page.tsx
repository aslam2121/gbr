export default function VideoChatPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-900 lg:text-5xl">Video Conferencing</h1>
            <p className="mt-4 text-lg text-gray-600">
              Connect face-to-face with global business partners through our integrated video chat platform.
            </p>
          </div>
        </div>
      </section>

      {/* Video Conference Area */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-3 text-white" style={{ backgroundColor: "#033443" }}>
              <h2 className="text-base font-semibold">
                <i className="bi bi-camera-video me-2"></i>Video Conference
              </h2>
              <div className="flex gap-2">
                <button className="rounded bg-white px-2 py-1 text-sm text-gray-700" type="button"><i className="bi bi-mic"></i></button>
                <button className="rounded bg-white px-2 py-1 text-sm text-gray-700" type="button"><i className="bi bi-camera"></i></button>
                <button className="rounded bg-red-500 px-2 py-1 text-sm text-white" type="button"><i className="bi bi-telephone-x"></i></button>
              </div>
            </div>

            {/* Video area */}
            <div className="flex items-center justify-center bg-gray-900" style={{ height: "400px" }}>
              <div className="text-center text-white">
                <i className="bi bi-camera-video mb-3" style={{ fontSize: "4rem" }}></i>
                <h3 className="text-xl font-semibold">Video Conference Area</h3>
                <p className="mt-2 text-sm text-gray-300">Click &quot;Start Meeting&quot; to begin your video conference.</p>
                <button className="mt-4 rounded-md px-6 py-3 text-sm font-medium text-white" style={{ backgroundColor: "#0083ae" }} type="button">
                  <i className="bi bi-play-circle me-2"></i>Start Meeting
                </button>
              </div>
            </div>

            {/* Meeting info bar */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Meeting ID: GBR-2026-001</h4>
                  <small className="text-xs text-gray-500">Share this ID with participants</small>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-md border px-3 py-1 text-sm" style={{ borderColor: "#0083ae", color: "#0083ae" }} type="button">
                    <i className="bi bi-share me-1"></i>Share Link
                  </button>
                  <button className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600" type="button">
                    <i className="bi bi-calendar me-1"></i>Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="text-base font-semibold text-gray-900">
                <i className="bi bi-calendar-event me-2"></i>Upcoming Meetings
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">Investor Pitch Meeting</h3>
                  <p className="mt-1 text-sm text-gray-500">Tomorrow at 2:00 PM</p>
                  <small className="text-xs text-gray-400">With: Global Ventures Inc.</small>
                  <div className="mt-3">
                    <button className="rounded-md px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: "#0083ae" }} type="button">Join</button>
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">Strategy Consultation</h3>
                  <p className="mt-1 text-sm text-gray-500">Friday at 10:00 AM</p>
                  <small className="text-xs text-gray-400">With: Dr. Michael Chen</small>
                  <div className="mt-3">
                    <button className="rounded-md px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: "#0083ae" }} type="button">Join</button>
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

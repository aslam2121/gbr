import Image from "next/image";

export function LiveChatSidebar() {
  return (
    <div style={{ padding: 0 }}>
      {/* Sidebar image */}
      <div>
        <Image
          src="/img/sidebar_image.jpg"
          alt="GBR Sidebar"
          width={442}
          height={294}
          className="h-[300px] w-full object-cover"
        />
      </div>

      {/* Live chat card */}
      <div className="overflow-hidden" style={{ borderRadius: "0 0 15px 15px" }}>
        <div className="flex items-center justify-between bg-gbr-primary px-4 py-3 text-white">
          <i className="fas fa-angle-left" />
          <p className="mb-0 text-sm font-bold">Live chat</p>
          <i className="fas fa-times" />
        </div>
        <div className="space-y-4 p-4">
          {/* Message from support */}
          <div className="flex flex-row justify-start gap-3">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
              alt="avatar 1"
              className="h-[45px] w-[45px]"
            />
            <div className="rounded-[15px] p-3" style={{ backgroundColor: "rgba(57, 192, 237, 0.2)" }}>
              <p className="mb-0 text-xs text-gray-700">
                Hello and thank you for visiting MDBootstrap. Please click the video below.
              </p>
            </div>
          </div>

          {/* Message from user */}
          <div className="flex flex-row justify-end gap-3">
            <div className="rounded-[15px] border border-gray-200 bg-gray-100 p-3">
              <p className="mb-0 text-xs">Thank you, I really like your product.</p>
            </div>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
              alt="avatar 1"
              className="h-[45px] w-[45px]"
            />
          </div>

          {/* Screenshot message */}
          <div className="flex flex-row justify-start gap-3">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
              alt="avatar 1"
              className="h-[45px] w-[45px]"
            />
            <div className="ms-3" style={{ borderRadius: "15px" }}>
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/screenshot1.webp"
                alt="video"
                className="rounded-[15px]"
              />
            </div>
          </div>

          {/* Typing indicator */}
          <div className="flex flex-row justify-start gap-3">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
              alt="avatar 1"
              className="h-[45px] w-[45px]"
            />
            <div className="rounded-[15px] p-3" style={{ backgroundColor: "rgba(57, 192, 237, 0.2)" }}>
              <p className="mb-0 text-xs text-gray-400">...</p>
            </div>
          </div>

          {/* Text input */}
          <div>
            <textarea
              className="w-full rounded border border-gray-200 bg-gray-100 p-3 text-sm outline-none focus:border-gbr-accent focus:ring-1 focus:ring-gbr-accent"
              rows={4}
              placeholder="Type your message"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

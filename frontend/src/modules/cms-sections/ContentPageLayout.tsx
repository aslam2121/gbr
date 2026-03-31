import Image from "next/image";
import { LiveChatSidebar } from "./LiveChatSidebar";

interface ContentPageLayoutProps {
  title: string;
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function ContentPageLayout({ title, children, showSidebar = true }: ContentPageLayoutProps) {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
          {/* Left sidebar image */}
          {showSidebar && (
            <div className="hidden lg:col-span-2 lg:block">
              <Image
                src="/img/aboutus_left_sidebar.png"
                alt=""
                width={224}
                height={702}
                className="h-full w-full object-fill"
              />
            </div>
          )}

          {/* Main content */}
          <div className={showSidebar ? "lg:col-span-6" : "lg:col-span-8"}>
            <div className="px-4 py-4 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">{title}</h1>
              <div className="mt-4 text-base leading-relaxed text-gray-600">
                {children}
              </div>
            </div>
          </div>

          {/* Right sidebar with image + chat */}
          {showSidebar && (
            <div className="lg:col-span-4">
              <LiveChatSidebar />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

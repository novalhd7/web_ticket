import { VideoText } from "@/components/ui/video-text";

export function VideoTextDemo() {
  return (
    <div>
      <section
        className="
          relative 
          h-[360px] 
          overflow-hidden 
          flex flex-col 
          items-center 
          justify-start
          pt-16
          -translate-y-20
        "
      >
        {/* TEXT VIDEO */}
        <VideoText
          src="https://cdn.magicui.design/ocean-small.webm"
          className="translate-y-6"
        >
          Welcome
        </VideoText>

        {/* TEXT BAWAH */}
        <div className="mt-8 text-center">
          <h1
            className="
              inline-block 
              text-4xl font-bold text-black
              bg-gray-200/90 
              px-6 py-3 
              rounded-xl 
              shadow-md 
              backdrop-blur
            "
          >
            To Our Ticketing Platform
          </h1>

          <p className="mt-4 text-lg text-gray-300">
            Find and book your favorite events easily
          </p>
        </div>
      </section>
    </div>
  );
}

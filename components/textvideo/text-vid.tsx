import { VideoText } from "@/components/ui/video-text";

export function VideoTextDemo() {
  return (
    <section className="relative h-[260px] bg-black overflow-hidden">
      <VideoText
        src="https://cdn.magicui.design/ocean-small.webm"
        className="translate-y-6"
      >
        Ticking
      </VideoText>
    </section>
  );
}

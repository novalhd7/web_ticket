import { VideoText } from "@/components/ui/video-text";

export function VideoTextDemo() {
  return (
    <section className="relative h-[260px] overflow-hidden flex pb-5 flex items-end">
      <VideoText
        src="https://cdn.magicui.design/ocean-small.webm"
        className="translate-y-6"
      >
        Welcome
      </VideoText>
    </section>
  );
}

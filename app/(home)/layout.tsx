import NavbarWrapper from "@/components/navbar/navbar-wrapper";
import { VideoTextDemo } from "@/components/textvideo/text-vid";
import { StarsBackgroundDemo } from "@/components/baground/bagroundweb";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper />
      <div className="absolute top-0 left-0 w-full h-screen -z-10">
        <StarsBackgroundDemo />
      </div>
      <VideoTextDemo />
      <main>{children}</main>
    </>
  );
}

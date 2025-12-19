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
      <StarsBackgroundDemo>
        <VideoTextDemo />
      </StarsBackgroundDemo>
      <main>{children}</main>
    </>
  );
}

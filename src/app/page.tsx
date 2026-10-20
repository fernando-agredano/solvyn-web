import Image from "next/image";
import { SITE } from "@/src/config/site";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-background">
      <Image
        src="/brand/solvyn-logo.png"
        alt={SITE.name}
        width={1100}
        height={262}
        priority
        className="h-auto w-64 sm:w-80"
      />
    </main>
  );
}

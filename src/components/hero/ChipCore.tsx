import Image from "next/image";

export function ChipCore() {
  return (
    <div className="absolute top-[25.333%] left-[45%] aspect-square w-[10%]">
      <div className="chip-glow absolute -inset-[40%]" />
      <div className="chip-body absolute inset-0" />
      <div className="chip-inner absolute inset-[9%]" />
      <Image
        src="/brand/solvyn-iso.png"
        alt=""
        width={380}
        height={392}
        sizes="70px"
        className="absolute top-1/2 left-1/2 h-auto w-[46%] -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

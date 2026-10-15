import Image from "next/image";
import { heroBackground } from "@/components/shared/carImage";

/**
 * Jaguar's own background (no car) for the theme with a cut-out car photo standing on its floor.
 * `className` positions and sizes the box (relative by default); `carClassName` places the car
 * inside it; `overlayClassName` (e.g. a fade behind copy) sits between the background and the car.
 * With no `src` only the background shows (e.g. the I-Pace, which has no photo of its own).
 */
export default function CarOnBackground({
  src,
  alt = "",
  isDark,
  className = "relative",
  bgClassName = "object-cover object-[center_70%]",
  carClassName = "inset-x-[8%] bottom-[6%] top-[14%]",
  overlayClassName = "",
  sizes = "50vw",
  children,
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <Image src={heroBackground(isDark)} alt="" fill className={bgClassName} sizes={sizes} />
      {overlayClassName ? <div className={`absolute inset-0 ${overlayClassName}`} /> : null}
      {src ? (
        // The car stands on the floor: a soft contact shadow under the tyres and a faint reflection,
        // matching the composed hero scenes.
        <div className={`absolute ${carClassName}`}>
          <div
            className={`absolute inset-x-[8%] bottom-[-3%] h-[9%] rounded-[50%] blur-md ${isDark ? "bg-black/70" : "bg-black/35"}`}
          />
          <div
            aria-hidden="true"
            className={`absolute inset-x-0 top-full h-full -scale-y-100 [mask-image:linear-gradient(to_top,rgba(0,0,0,0.9),transparent_32%)] ${
              isDark ? "opacity-30" : "opacity-25"
            }`}
          >
            <Image src={src} alt="" fill className="object-contain object-bottom blur-[1px]" sizes={sizes} />
          </div>
          <Image src={src} alt={alt} fill className="object-contain object-bottom" sizes={sizes} />
        </div>
      ) : null}
      {children}
    </div>
  );
}

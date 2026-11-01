import { cn } from "@/lib/cn";

export function AmbientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute -left-[14%] -top-[22%] size-[34rem] rounded-full bg-[#d8ccff]/45 blur-[120px] animate-float" />
      <div className="absolute -right-[14%] top-[2%] size-[30rem] rounded-full bg-[#c6e4ff]/45 blur-[120px]" />
      <div className="absolute bottom-[-24%] left-[26%] size-[36rem] rounded-full bg-[#e3d9ff]/35 blur-[130px]" />
      <div className="dot-grid absolute inset-0 opacity-30" />
    </div>
  );
}

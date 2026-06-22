export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        className="absolute w-[50vw] h-[50vw] -top-[10%] -left-[10%] rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, #7F77DD 0%, transparent 70%)",
          animation: "aurora-drift-1 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[45vw] h-[45vw] -bottom-[15%] -right-[10%] rounded-full opacity-35"
        style={{
          background: "radial-gradient(circle, #1D9E75 0%, transparent 70%)",
          animation: "aurora-drift-2 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[40vw] h-[40vw] top-[30%] -right-[5%] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, #7F77DD 0%, transparent 70%)",
          animation: "aurora-drift-3 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}

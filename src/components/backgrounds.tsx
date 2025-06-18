export function NoisyBackground() {
  return (
    <div className="inset-0 dark:bg-[var(--sidebar-bg)] z-0 !fixed">
      <div className="absolute inset-0 opacity-40 background-gradient-overlay"></div>
      <div className="absolute inset-0 bg-noise z-100"></div>
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
}

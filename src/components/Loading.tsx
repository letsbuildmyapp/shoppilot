export function Loading() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 border border-coal border-t-transparent animate-spin" />
        <p className="text-sm text-coal-mute">Loading…</p>
      </div>
    </div>
  );
}

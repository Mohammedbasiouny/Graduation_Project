const CameraAxisGuide = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">

      {/* Soft vignette (focus center) */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/25" />

      {/* X Axis (horizontal alignment) */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />

      {/* Y Axis (vertical alignment) */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

      {/* Center AI tracking zone */}
      <div className="absolute left-1/2 top-1/2 w-56 h-72 -translate-x-1/2 -translate-y-1/2">

        {/* Corner brackets (AI detection frame) */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/25 rounded-tl-md" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/25 rounded-tr-md" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/25 rounded-bl-md" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/25 rounded-br-md" />
        </div>

        {/* subtle scanning line */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute w-full h-0.5 bg-white/10 blur-sm top-1/2 animate-pulse" />
        </div>
      </div>

      {/* Center target (precision point) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

        {/* glow */}
        <div className="absolute w-10 h-10 rounded-full bg-white/5 blur-xl animate-pulse" />

        {/* ring */}
        <div className="w-4 h-4 rounded-full border border-white/40" />

        {/* core dot */}
        <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-white/70" />
      </div>

    </div>
  )
}

export default CameraAxisGuide
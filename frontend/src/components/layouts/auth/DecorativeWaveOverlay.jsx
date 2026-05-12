const DecorativeWaveOverlay = () => {
  return (
    <svg
      className="absolute right-0 top-0 h-full w-auto hidden md:block"
      viewBox="0 0 500 150"
      preserveAspectRatio="none"
    >
      <path
        d="M0,0 C150,100 350,0 500,100 L500,0 Z"
        fill="white"
        opacity="0.1"
      />
    </svg>
  )
}

export default DecorativeWaveOverlay

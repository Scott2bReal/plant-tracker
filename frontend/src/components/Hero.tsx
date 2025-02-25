import { A } from '@solidjs/router'

const Hero = () => {
  return (
    <div class="mb-4 flex flex-col items-center justify-center gap-4 py-4 lg:mb-8">
      <A href="/">
        <span title="Plants!" class="text-5xl sm:text-7xl">
          🪴
        </span>
      </A>
      <div class="mx-auto h-px w-[98%] bg-teal-cycle lg:w-3/4" />
    </div>
  )
}

export default Hero

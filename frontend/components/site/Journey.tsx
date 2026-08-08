export function Journey() {
  return (
    <section className="w-full bg-white pt-[152px] pb-[60px]">
      <div className="mx-auto w-full max-w-[1280px] px-[64px]">
        <h2 className="mx-auto max-w-[720px] text-center font-display text-[60px] font-[590] leading-[60px] tracking-[-1.5px] text-[#111111]">
          The Journey
          <br />
          That <span className="grad-text-green">Defines Us.</span>
        </h2>

        <p className="mx-auto mt-[38px] max-w-[966px] text-center font-sans text-[24px] font-[400] leading-[32px] text-[#A3A3A3]">
          Discover the story behind Hillary Step Solutions and how we help organizations transform
          ideas into technology, talent, and infrastructure that create lasting impact.
        </p>

        <div className="mx-auto mt-[56px] w-full max-w-[1186px] rounded-[50px] bg-gradient-to-r from-[#FF6200] via-[#00FF11] to-[#007BFF] p-[1px]">
          <div className="relative h-[545px] w-full overflow-hidden rounded-[49px] bg-black">
            <img
              src="/assets/mountain-journey.png"
              alt="Mountain range"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#FF6200] via-[#00FF11] to-[#007BFF] p-[4px] shadow-[0_0_46px_14px_rgba(0,255,17,0.25)]">
              <button
                type="button"
                aria-label="Play the company film"
                className="flex h-[204px] w-[204px] items-center justify-center rounded-full bg-white transition-transform hover:scale-105"
              >
                <svg
                  width="110"
                  height="110"
                  viewBox="0 0 52 58"
                  fill="#999898"
                  className="ml-[16px]"
                >
                  <path d="M4 2 48 29 4 56Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

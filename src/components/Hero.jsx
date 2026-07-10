import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [previewPosition, setPreviewPosition] = useState({ x: "50%", y: "50%" });

  const totalVideos = 4;
  const nextVideoRef = useRef(null);
  const heroRef = useRef(null);

  const [showPreview, setShowPreview] = useState(false);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

  const handleMiniVdClick = () => {
    setHasClicked(true);

    setCurrentIndex(upcomingVideoIndex);
    // 0 % 4 = 0 + 1 => 1
    // 1 % 4 = 1 + 1 => 2
    // 2 % 4 = 2 + 1 => 3
    // 3 % 4 = 3 + 1 => 4
    // 4 % 4 = 0 + 1 => 1
  };

  const handleMouseMove = (event) => {
    const isOverExcludedContent = document
      .elementsFromPoint(event.clientX, event.clientY)
      .some((element) => element.closest("[data-no-video-preview]"));

    if (isOverExcludedContent) {
      setShowPreview(false);
      return;
    }

    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setShowPreview(true);
    setPreviewPosition({ x: `${x}%`, y: `${y}%` });
  };

  useEffect(() => {
    if (loadedVideos === totalVideos - 1) {
      setIsLoading(false);
    }
  }, [loadedVideos]);

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVideoRef.current.play(),
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowPreview(false)}
      className="relative h-dvh w-screen overflow-x-hidden"
    >
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}
      <div id="video-frame" className="relative z-40 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75">
        <div>
          <div
            className={`mask-clip-path absolute z-50 overflow-hidden rounded-lg transition-opacity duration-300 ${
              showPreview ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              left: previewPosition.x,
              top: previewPosition.y,
              width: "clamp(6rem, 15vw, 16rem)",
              height: "clamp(6rem, 15vw, 16rem)",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              onClick={handleMiniVdClick}
              className="h-full w-full origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
            >
              <video
                ref={nextVideoRef}
                src={getVideoSrc(upcomingVideoIndex)}
                loop
                muted
                id="current-video"
                className="h-full w-full origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>

          <video ref={nextVideoRef} src={getVideoSrc(currentIndex)} loop muted id="next-video" className="absolute-center invisible absolute z-20 size-64 object-cover object-center" onLoadedData={handleVideoLoad} />
          <video src={getVideoSrc(currentIndex === totalVideos - 1 ? 1 : currentIndex)} autoPlay loop muted className="absolute left-0 top-0 size-full object-cover object-center" onLoadedData={handleVideoLoad} />

          <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
            G<b>a</b>ming
          </h1>

          <div className="pointer-events-none absolute left-0 top-0 z-40">
            <div className="mt-24 px-5 sm:px-10">
              <h1 data-no-video-preview className="pointer-events-auto inline-block leading-[0.75] special-font hero-heading text-blue-100">
                Redefi<b>n</b>ed
              </h1>
              <p data-no-video-preview className="pointer-events-auto mb-5 w-fit max-w-64 font-robert-regular text-blue-100">
                Enter the Metagame Layer <br /> Unleash the Play Economy
              </p>
              <div data-no-video-preview className="pointer-events-auto w-fit">
                <Button id="watch-trailer" title="Watch Trailer" leftIcon={<TiLocationArrow />} containerClass="!bg-yellow-300 flex-center gap-1" />
              </div>
            </div>
          </div>
          <h1 className="special-font hero-heading absolute bottom-5 right-5  z text-black" onMouseEnter={() => setShowPreview(false)}>
            G<b>a</b>ming
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;

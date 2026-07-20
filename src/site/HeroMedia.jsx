import { useEffect, useRef } from "react";
import heroPoster from "../../assets/hero/community-hero-poster.png";

const HERO_VIDEO_URL =
  "https://onmain.blr1.cdn.digitaloceanspaces.com/mainsite/main-on-hero-video-720-02.mp4";

export function shouldLoadHeroVideo({
  effectiveType,
  prefersReducedMotion,
  saveData,
}) {
  return !(
    prefersReducedMotion ||
    saveData ||
    ["slow-2g", "2g"].includes(effectiveType)
  );
}

export function HeroMedia() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = navigator.connection;
    let inView = false;
    let observer;

    const addQueryListener = (query) => {
      if (typeof query.addEventListener === "function") query.addEventListener("change", configureMedia);
      else query.addListener?.(configureMedia);
    };

    const removeQueryListener = (query) => {
      if (typeof query.removeEventListener === "function") query.removeEventListener("change", configureMedia);
      else query.removeListener?.(configureMedia);
    };

    const shouldUsePoster = () => !shouldLoadHeroVideo({
      effectiveType: connection?.effectiveType,
      prefersReducedMotion: motionQuery.matches,
      saveData: connection?.saveData,
    });

    const syncPlayback = () => {
      if (inView && !document.hidden && !shouldUsePoster()) {
        video.play().catch(() => {
          // The poster remains visible when a browser declines autoplay.
        });
      } else {
        video.pause();
      }
    };

    const unloadVideo = () => {
      observer?.disconnect();
      observer = undefined;
      inView = false;
      video.pause();

      if (video.hasAttribute("src")) {
        video.removeAttribute("src");
        video.load();
      }
    };

    const configureMedia = () => {
      unloadVideo();
      if (shouldUsePoster()) return;

      video.src = HERO_VIDEO_URL;
      video.load();

      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting;
            syncPlayback();
          },
          { rootMargin: "160px 0px", threshold: 0.08 },
        );
        observer.observe(video);
      } else {
        inView = true;
        syncPlayback();
      }
    };

    const onVisibilityChange = () => syncPlayback();
    const onVideoError = () => unloadVideo();

    configureMedia();
    document.addEventListener("visibilitychange", onVisibilityChange);
    video.addEventListener("error", onVideoError);
    addQueryListener(motionQuery);
    connection?.addEventListener?.("change", configureMedia);

    return () => {
      video.removeEventListener("error", onVideoError);
      unloadVideo();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      removeQueryListener(motionQuery);
      connection?.removeEventListener?.("change", configureMedia);
    };
  }, []);

  return (
    <div className="hero-media" data-parallax="0.045" aria-hidden="true">
      <img
        className="hero-media-poster"
        src={heroPoster}
        alt=""
        width="1920"
        height="1080"
        decoding="async"
        fetchPriority="high"
      />
      <video
        ref={videoRef}
        className="hero-media-video"
        poster={heroPoster}
        preload="metadata"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        tabIndex={-1}
      />
    </div>
  );
}

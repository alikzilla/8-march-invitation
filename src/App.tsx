import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type Stage = "select" | "slideshow" | "envelope";

type Slide = {
  src: string;
  text: string;
};

type Invitation = {
  date: string;
  time: string;
  place: string;
  city: string;
  message: string;
};

type Girl = {
  name: string;
  background: string;
  slides: Slide[];
  invitation: Invitation;
};

const invitationAlmaty: Invitation = {
  date: "8 марта 2026",
  time: "18:30",
  place: "Bloom Cafe",
  city: "Алматы",
  message:
    "Приглашаю тебя провести этот вечер в теплой атмосфере, с улыбками и красивыми моментами.",
};

const invitationAstana: Invitation = {
  date: "8 марта 2026",
  time: "19:00",
  place: "Aurora Cafe",
  city: "Астана",
  message:
    "Давай проведем этот особенный вечер вместе: с добрыми словами, смехом и нежным настроением.",
};

const girls: Girl[] = [
  {
    name: "Айша",
    background: "/img/aisha.jpg",
    slides: [
      { src: "/img/aisha/1.jpg", text: "Твоя улыбка наполняет день светом." },
      { src: "/img/aisha/2.jpg", text: "Ты вдохновляешь своей нежностью и силой." },
      { src: "/img/aisha/3.jpg", text: "С тобой каждый момент становится красивее." },
      { src: "/img/aisha/4.jpg", text: "Пусть этот день подарит тебе особенную радость." },
    ],
    invitation: invitationAstana,
  },
  {
    name: "Асем",
    background: "/img/assem.jpg",
    slides: [
      { src: "/img/assem/1.jpg", text: "В тебе столько изящества и внутренней силы." },
      { src: "/img/assem/2.jpg", text: "Твоя доброта делает мир вокруг теплее." },
      { src: "/img/assem/3.jpg", text: "Ты умеешь быть яркой и очень настоящей." },
      { src: "/img/assem/4.jpg", text: "Пусть 8 Марта будет наполнено счастьем." },
    ],
    invitation: invitationAlmaty,
  },
  {
    name: "София",
    background: "/img/sophie.jpg",
    slides: [
      { src: "/img/sophie/1.jpg", text: "Твоя красота и стиль всегда восхищают." },
      { src: "/img/sophie/2.jpg", text: "Ты превращаешь обычные дни в волшебные." },
      { src: "/img/sophie/3.jpg", text: "Спасибо тебе за тепло и искренность." },
      { src: "/img/sophie/4.jpg", text: "Этот вечер — маленький праздник в твою честь." },
    ],
    invitation: invitationAlmaty,
  },
  {
    name: "Анеля",
    background: "/img/anelya.jpg",
    slides: [
      { src: "/img/anelya/1.jpg", text: "Твой смех делает каждый день ярче." },
      { src: "/img/anelya/2.jpg", text: "Ты прекрасная, сильная и вдохновляющая." },
      { src: "/img/anelya/3.jpg", text: "Рядом с тобой всегда тепло и уютно." },
      { src: "/img/anelya/4.jpg", text: "Пусть этот день подарит тебе море улыбок." },
    ],
    invitation: invitationAstana,
  },
  {
    name: "Жулдыз",
    background: "/img/zhuldyz.jpg",
    slides: [
      { src: "/img/zhuldyz/1.jpg", text: "Ты сияешь так же ярко, как твое имя." },
      { src: "/img/zhuldyz/2.jpg", text: "В тебе удивительно сочетаются нежность и сила." },
      { src: "/img/zhuldyz/3.jpg", text: "Спасибо за твою искренность и светлую энергию." },
      { src: "/img/zhuldyz/4.jpg", text: "Давай отметим этот вечер красиво и душевно." },
    ],
    invitation: invitationAstana,
  },
  {
    name: "Аружан",
    background: "/img/aruzhan.jpg",
    slides: [
      { src: "/img/aruzhan/1.jpg", text: "С тобой каждый момент становится особенным." },
      { src: "/img/aruzhan/2.jpg", text: "Ты очень светлый и добрый человек." },
      { src: "/img/aruzhan/3.jpg", text: "Твоя энергия заряжает и вдохновляет." },
      { src: "/img/aruzhan/4.png", text: "Пусть 8 Марта принесет тебе радость и любовь." },
    ],
    invitation: invitationAlmaty,
  },
];

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));
const sideClass = (index: number) => (index % 2 === 0 ? "left" : "right");
const STORY_VIEW_MS = 2800;
const PREVIEW_SHARP_MS = 450;
const SCROLL_SETTLE_MS = 1200;
const PROGRESS_TICK_MS = 40;

export default function App() {
  const [stage, setStage] = useState<Stage>("select");
  const [selectedGirl, setSelectedGirl] = useState<Girl | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [previewSharp, setPreviewSharp] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    loop: false,
    dragFree: false,
    align: "start",
    watchDrag: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const slides = selectedGirl?.slides ?? [];
  const sortedGirls = useMemo(
    () => [...girls].sort((a, b) => a.name.localeCompare(b.name, "ru")),
    []
  );

  const appStyle = useMemo(() => {
    if (!selectedGirl) return undefined;
    return {
      ["--girl-bg" as string]: `url("${selectedGirl.background}")`,
    } as CSSProperties;
  }, [selectedGirl]);

  useEffect(() => {
    if (stage !== "slideshow" || !emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0, true);
    setCurrentIndex(0);
    setSlideProgress(0);
    setPreviewSharp(false);
  }, [stage, emblaApi, selectedGirl]);

  useEffect(() => {
    if (stage !== "slideshow" || !emblaApi || slides.length === 0) return;

    let cancelled = false;
    let progressTimer: number | undefined;

    if (currentIndex >= slides.length - 1) {
      setSlideProgress(1);
      const done = window.setTimeout(() => {
        if (!cancelled) setStage("envelope");
      }, 1500);

      return () => {
        cancelled = true;
        window.clearTimeout(done);
      };
    }

    const run = async () => {
      let elapsed = 0;
      setSlideProgress(0);

      progressTimer = window.setInterval(() => {
        elapsed += PROGRESS_TICK_MS;
        setSlideProgress(Math.min(elapsed / STORY_VIEW_MS, 1));
      }, PROGRESS_TICK_MS);

      await wait(STORY_VIEW_MS);
      if (cancelled) return;

      if (progressTimer) {
        window.clearInterval(progressTimer);
      }
      setSlideProgress(1);

      await wait(140);
      if (cancelled) return;

      setPreviewSharp(true);

      await wait(PREVIEW_SHARP_MS);
      if (cancelled) return;

      const nextIndex = currentIndex + 1;
      emblaApi.scrollTo(nextIndex);
      setCurrentIndex(nextIndex);

      await wait(SCROLL_SETTLE_MS);
      if (cancelled) return;

      setPreviewSharp(false);
    };

    void run();

    return () => {
      cancelled = true;
      if (progressTimer) {
        window.clearInterval(progressTimer);
      }
      setPreviewSharp(false);
    };
  }, [stage, emblaApi, slides.length, currentIndex]);

  const startFlow = (girl: Girl) => {
    setSelectedGirl(girl);
    setCurrentIndex(0);
    setSlideProgress(0);
    setPreviewSharp(false);
    setEnvelopeOpen(false);
    setShowCard(false);
    setStage("slideshow");

    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.35;
      void audio.play().catch(() => {
        // Playback may be blocked by browser policy.
      });
    }
  };

  const openEnvelope = () => {
    if (envelopeOpen) return;
    setEnvelopeOpen(true);
    window.setTimeout(() => setShowCard(true), 360);
  };

  return (
    <main className={`app stage-${stage}`} style={appStyle}>
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      <AnimatePresence mode="wait">
        {stage === "select" && (
          <motion.section
            key="select"
            className="screen screen-select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h1>Кто открыл открытку?</h1>
            <div className="name-list">
              {sortedGirls.map((girl) => (
                <button key={girl.name} onClick={() => startFlow(girl)}>
                  {girl.name}
                </button>
              ))}
            </div>
          </motion.section>
        )}

        {stage === "slideshow" && selectedGirl && (
          <motion.section
            key="slideshow"
            className="screen screen-slideshow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="stories-progress">
              {slides.map((_, index) => {
                const fill =
                  index < currentIndex
                    ? 1
                    : index === currentIndex
                      ? slideProgress
                      : 0;

                return (
                  <span
                    key={`${selectedGirl.name}-progress-${index}`}
                    className="story-segment"
                  >
                    <span
                      className="story-fill"
                      style={{ transform: `scaleX(${fill})` }}
                    />
                  </span>
                );
              })}
            </div>

            <div className="embla" ref={emblaRef}>
              <div className="embla-container">
                {slides.map((slide, index) => {
                  const isNext = index === currentIndex + 1;

                  return (
                    <article
                      key={`${selectedGirl.name}-${index}`}
                      className={[
                        "slide-card",
                        sideClass(index),
                        isNext ? "preview" : "",
                        isNext && previewSharp ? "sharp" : "",
                        index < currentIndex ? "past" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <img src={slide.src} alt="Фото" />
                      <p>{slide.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        {stage === "envelope" && selectedGirl && (
          <motion.section
            key="envelope"
            className="screen screen-envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="letter-zone">
              <button
                className={`envelope ${envelopeOpen ? "open" : ""}`}
                type="button"
                onClick={openEnvelope}
                aria-label="Открыть приглашение"
              >
                <span className="envelope-back" />
                <span className="envelope-front" />
                <span className="envelope-flap" />
                <img
                  className="envelope-seal"
                  src="https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Scrolls-PNG/Wax_Seal_Stamp_Red_PNG_Clipart.png?m=1629815086"
                  alt=""
                  aria-hidden="true"
                />
              </button>

              <motion.article
                className="paper-card"
                initial={false}
                onClick={openEnvelope}
                animate={
                  showCard ? { opacity: 1, y: -76 } : { opacity: 0, y: 34 }
                }
                transition={{ duration: 0.9, ease: "easeInOut" }}
              >
                <h2>Приглашение</h2>
                <p>Дорогая {selectedGirl.name},</p>
                <p>
                  <strong>Дата:</strong> {selectedGirl.invitation.date}
                </p>
                <p>
                  <strong>Время:</strong> {selectedGirl.invitation.time}
                </p>
                <p>
                  <strong>Место:</strong> {selectedGirl.invitation.place},{" "}
                  {selectedGirl.invitation.city}
                </p>
                <p>{selectedGirl.invitation.message}</p>
              </motion.article>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

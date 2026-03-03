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
  date?: string;
  time?: string;
  place?: string;
  city?: string;
  link?: string;
  abroad?: boolean;
  message: string;
};

type Girl = {
  name: string;
  background: string;
  slides: Slide[];
  invitation: Invitation;
};

const invitationKazakhstan: Invitation = {
  date: "9 марта 2026",
  time: "19:00",
  place: "Bloom Room Cafe",
  city: "Астана",
  link: "https://2gis.kz/astana/geo/70000001080574946",
  message:
    "Давай проведем этот особенный вечер вместе: с добрыми словами, смехом и нежным настроением.",
};

const girls: Girl[] = [
  {
    name: "Асыл",
    background: "/img/asyl.jpg",
    slides: [
      {
        src: "/img/asyl/1.jpeg",
        text: "Ты умеешь замечать важное в мелочах и делать это искусством.",
      },
      {
        src: "/img/asyl/2.jpeg",
        text: "В твоей улыбке чувствуется мудрость и большое доброе сердце.",
      },
      {
        src: "/img/asyl/3.jpeg",
        text: "Твоя радость настолько настоящая, что мир вокруг начинает светиться в ответ.",
      },
      {
        src: "/img/asyl/4.jpeg",
        text: "Ты — тот самый человек, рядом с которым каждый чувствует себя нужным.",
      },
    ],
    invitation: {
      ...invitationKazakhstan,
      message:
        "Асыл, очень ждем тебя на нашем уютном вечере в Астане. Хочу, чтобы этот праздник подарил тебе тепло, смех и красивое настроение.",
    },
  },
  {
    name: "Дарина",
    background: "/img/darina.jpg",
    slides: [
      {
        src: "/img/darina/1.jpeg",
        text: "Твои победы выглядят так естественно, будто для тебя нет ничего невозможного.",
      },
      {
        src: "/img/darina/4.jpeg",
        text: "Рядом с тобой всегда чувствуется, что жизнь — это прекрасное приключение.",
      },
      {
        src: "/img/darina/2.jpeg",
        text: "С тобой даже обычный поход в бар превращается в легендарную историю.",
      },
      {
        src: "/img/darina/3.jpeg",
        text: "Твоя поддержка — это та самая тихая гавань, в которой каждый находит силы.",
      },
    ],
    invitation: {
      abroad: true,
      message:
        "ты сейчас не рядом с нами, но мы тебя очень любим и от всей души поздравляем. Ждем тебя в Казахстане и обязательно отметим вместе.",
    },
  },
  {
    name: "Айко",
    background: "/img/aiko.jpg",
    slides: [
      {
        src: "/img/aiko/1.jpeg",
        text: "Ты выглядишь как главная героиня истории, которую хочется дочитать до конца.",
      },
      {
        src: "/img/aiko/4.jpeg",
        text: "Твой образ — это чистое вдохновение, будто сошедшее со страниц классического романа.",
      },
      {
        src: "/img/aiko/3.jpeg",
        text: "Рядом с тобой даже бесконечные горизонты кажутся понятными и уютными.",
      },
      {
        src: "/img/aiko/2.jpeg",
        text: "В твоей простоте чувствуется больше содержания, чем в самых сложных фанфиках.",
      },
    ],
    invitation: {
      ...invitationKazakhstan,
      message:
        "Айко, приглашаем тебя на праздничный вечер в Астаны. Очень хотим провести этот день рядом с тобой — красиво, душевно и по-весеннему тепло.",
    },
  },
  {
    name: "Дильназ",
    background: "/img/dilnaz.jpg",
    slides: [
      {
        src: "/img/dilnaz/1.jpeg",
        text: "Ты выглядишь как человек, который знает цену истине и всегда находит нужные слова.",
      },
      {
        src: "/img/dilnaz/4.jpeg",
        text: "Ты покоряешь города так же легко и изящно, как и новые жизненные вершины.",
      },
      {
        src: "/img/dilnaz/3.jpeg",
        text: "Твой путь всегда ведет к свету, потому что ты сама его создаешь.",
      },
      {
        src: "/img/dilnaz/2.jpeg",
        text: "Рядом с тобой любая трудность кажется лишь временным этапом пути.",
      },
    ],
    invitation: {
      abroad: true,
      message:
        "пусть сейчас ты не рядом с нами, но мы тебя очень любим и искренне поздравляем. Очень ждем тебя в Казахстане, чтобы обнять и отметить вместе.",
    },
  },
];

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));
const sideClass = (index: number) => (index % 2 === 0 ? "left" : "right");
const STORY_VIEW_MS = 3500;
const PREVIEW_SHARP_MS = 450;
const SCROLL_SETTLE_MS = 1200;
const PROGRESS_TICK_MS = 40;
const preloadedImages = new Set<string>();
const EVENT_DATE_ICS = "20260309";
const EVENT_TIMEZONE = "Asia/Almaty";

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    if (preloadedImages.has(src)) {
      resolve();
      return;
    }

    const img = new Image();
    img.onload = () => {
      preloadedImages.add(src);
      resolve();
    };
    img.onerror = () => {
      resolve();
    };
    img.src = src;
  });

const escapeIcsText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");

const formatUtcForIcs = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const d = `${date.getUTCDate()}`.padStart(2, "0");
  const h = `${date.getUTCHours()}`.padStart(2, "0");
  const min = `${date.getUTCMinutes()}`.padStart(2, "0");
  const s = `${date.getUTCSeconds()}`.padStart(2, "0");
  return `${y}${m}${d}T${h}${min}${s}Z`;
};

const addHoursToHm = (hm: string, hoursToAdd: number) => {
  const [h, m] = hm.split(":").map((part) => Number(part));
  const total = h * 60 + m + hoursToAdd * 60;
  const nextMinutes = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const nextH = `${Math.floor(nextMinutes / 60)}`.padStart(2, "0");
  const nextM = `${nextMinutes % 60}`.padStart(2, "0");
  return `${nextH}${nextM}`;
};

const buildCalendarIcs = (girl: Girl) => {
  const time = girl.invitation.time ?? "";
  const [startH, startM] = time.split(":");
  const startHm = `${startH}${startM}`;
  const endHm = addHoursToHm(time, 3);
  const uid = `invite-8march-${girl.name}-${EVENT_DATE_ICS}@vibe.local`;
  const location = `${girl.invitation.place}, ${girl.invitation.city}`;
  const summary = `Вечер 8 Марта — ${girl.name}`;
  const description = girl.invitation.message;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "PRODID:-//8 March Invitation//RU",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatUtcForIcs(new Date())}`,
    `DTSTART;TZID=${EVENT_TIMEZONE}:${EVENT_DATE_ICS}T${startHm}00`,
    `DTEND;TZID=${EVENT_TIMEZONE}:${EVENT_DATE_ICS}T${endHm}00`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

export default function App() {
  const [stage, setStage] = useState<Stage>("select");
  const [selectedGirl, setSelectedGirl] = useState<Girl | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [previewSharp, setPreviewSharp] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [preparingName, setPreparingName] = useState<string | null>(null);

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
    [],
  );

  const appStyle = useMemo(() => {
    if (!selectedGirl) return undefined;
    return {
      ["--girl-bg" as string]: `url("${selectedGirl.background}")`,
    } as CSSProperties;
  }, [selectedGirl]);

  const calendarHref = useMemo(() => {
    if (!selectedGirl) return "#";
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(
      buildCalendarIcs(selectedGirl),
    )}`;
  }, [selectedGirl]);

  const calendarFilename = useMemo(() => {
    if (!selectedGirl) return "priglashenie-8-marta.ics";
    return `priglashenie-8-marta-${selectedGirl.name}.ics`;
  }, [selectedGirl]);

  useEffect(() => {
    const allSources = [
      ...new Set(
        girls.flatMap((girl) => [
          girl.background,
          ...girl.slides.map((slide) => slide.src),
        ]),
      ),
    ];

    allSources.forEach((src) => {
      void preloadImage(src);
    });
  }, []);

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

  const startFlow = async (girl: Girl) => {
    if (isPreparing) return;

    setIsPreparing(true);
    setPreparingName(girl.name);

    try {
      const girlSources = [
        girl.background,
        ...girl.slides.map((slide) => slide.src),
      ];
      await Promise.all(girlSources.map((src) => preloadImage(src)));

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
    } finally {
      setIsPreparing(false);
      setPreparingName(null);
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
                <button
                  key={girl.name}
                  onClick={() => startFlow(girl)}
                  disabled={isPreparing}
                >
                  {girl.name}
                </button>
              ))}
            </div>
            {isPreparing && (
              <div className="loading-overlay" role="status" aria-live="polite">
                <span className="loading-spinner" />
                <p>Загружаю фото для {preparingName}...</p>
              </div>
            )}
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
                {!selectedGirl.invitation.abroad && <h2>Приглашение</h2>}
                <p>Дорогая {selectedGirl.name},</p>
                {!selectedGirl.invitation.abroad && (
                  <p>
                    <strong>Дата:</strong> {selectedGirl.invitation.date}
                  </p>
                )}
                {!selectedGirl.invitation.abroad && (
                  <p>
                    <strong>Время:</strong> {selectedGirl.invitation.time}
                  </p>
                )}
                {!selectedGirl.invitation.abroad && (
                  <div className="place-row">
                    <p className="place-text">
                      <strong>Место:</strong> {selectedGirl.invitation.place},{" "}
                      {selectedGirl.invitation.city}
                    </p>
                    {stage === "envelope" && (
                      <a
                        className="place-plus-btn"
                        href={selectedGirl.invitation.link}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Открыть локацию: ${selectedGirl.invitation.place}`}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" />
                          <circle cx="12" cy="11" r="2.4" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
                <p>{selectedGirl.invitation.message}</p>
                {!selectedGirl.invitation.abroad && (
                  <a
                    className="calendar-btn"
                    href={calendarHref}
                    download={calendarFilename}
                  >
                    Добавить в Apple Календарь
                  </a>
                )}
              </motion.article>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

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
  link: string;
  message: string;
};

type Girl = {
  name: string;
  background: string;
  slides: Slide[];
  invitation: Invitation;
};

const invitationAlmaty: Invitation = {
  date: "9 марта 2026",
  time: "20:00",
  place: "Penka Cafe",
  city: "Алматы",
  link: "https://2gis.kz/almaty/firm/70000001087539898/tab/prices",
  message:
    "Приглашаю тебя провести этот вечер в теплой атмосфере, с улыбками и красивыми моментами.",
};

const invitationAstana: Invitation = {
  date: "9 марта 2026",
  time: "19:00",
  place: "Aurora Cafe",
  city: "Астана",
  link: "https://2gis.kz/astana/firm/70000001087773789/tab/prices",
  message:
    "Давай проведем этот особенный вечер вместе: с добрыми словами, смехом и нежным настроением.",
};

const girls: Girl[] = [
  {
    name: "Айша",
    background: "/img/aisha.jpg",
    slides: [
      { src: "/img/aisha/1.jpg", text: "Ты умеешь делать обычный день особенно теплым." },
      { src: "/img/aisha/2.jpg", text: "В твоей мягкости чувствуется настоящая сила." },
      { src: "/img/aisha/3.jpg", text: "С тобой всегда легко, светло и очень спокойно." },
      { src: "/img/aisha/4.jpg", text: "Пусть сегодня для тебя сбудется маленькое чудо." },
    ],
    invitation: {
      ...invitationAstana,
      message:
        "Айша, очень жду тебя на нашем уютном вечере в Астане. Хочу, чтобы этот праздник подарил тебе тепло, смех и красивое настроение.",
    },
  },
  {
    name: "Асем",
    background: "/img/assem.jpg",
    slides: [
      { src: "/img/assem/1.jpg", text: "Ты всегда выглядишь изящно и уверенно." },
      { src: "/img/assem/2.jpg", text: "Твоя искренность и доброта очень ценны." },
      { src: "/img/assem/3.jpg", text: "Ты вдохновляешь своей энергией и вкусом к жизни." },
      { src: "/img/assem/4.jpg", text: "Пусть этот день принесет тебе много радости." },
    ],
    invitation: {
      ...invitationAlmaty,
      message:
        "Асем, буду очень рада увидеть тебя на праздничном вечере в Алматы. Давай красиво отметим этот день — с улыбками, разговорами и любимой атмосферой.",
    },
  },
  {
    name: "София",
    background: "/img/sophie.jpg",
    slides: [
      { src: "/img/sophie/1.jpg", text: "У тебя особенный стиль и очень красивый свет внутри." },
      { src: "/img/sophie/2.jpg", text: "Ты добавляешь в каждый момент немного магии." },
      { src: "/img/sophie/3.jpg", text: "С тобой хочется делиться лучшими новостями и мечтами." },
      { src: "/img/sophie/4.jpg", text: "Пусть сегодня тебя окружают только приятные эмоции." },
    ],
    invitation: {
      ...invitationAlmaty,
      message:
        "София, приглашаю тебя на праздничный вечер в Алматы. Очень хочу провести этот день рядом с тобой — красиво, душевно и по-весеннему тепло.",
    },
  },
  {
    name: "Анеля",
    background: "/img/anelya.jpg",
    slides: [
      { src: "/img/anelya/1.jpg", text: "Твой смех моментально поднимает настроение." },
      { src: "/img/anelya/2.jpg", text: "Ты яркая, смелая и очень настоящая." },
      { src: "/img/anelya/3.jpg", text: "С тобой даже тихий вечер становится интересным." },
      { src: "/img/anelya/4.jpg", text: "Пусть этот праздник будет таким же красивым, как ты." },
    ],
    invitation: {
      ...invitationAstana,
      message:
        "Анеля, жду тебя на нашем праздничном вечере в Астане. Хочу, чтобы ты отдохнула, улыбалась и почувствовала, как сильно тебя ценят.",
    },
  },
  {
    name: "Жулдыз",
    background: "/img/zhuldyz.jpg",
    slides: [
      { src: "/img/zhuldyz/1.jpg", text: "Ты сияешь так ярко, что это чувствуется всем вокруг." },
      { src: "/img/zhuldyz/2.jpg", text: "В тебе есть редкое сочетание нежности и характера." },
      { src: "/img/zhuldyz/3.jpg", text: "Твоя энергия заряжает и делает день лучше." },
      { src: "/img/zhuldyz/4.jpg", text: "Пусть этот вечер подарит тебе вдохновение и радость." },
    ],
    invitation: {
      ...invitationAstana,
      message:
        "Жулдыз, приглашаю тебя на праздничный вечер в Астане. Давай сделаем этот день особенным: с душевными разговорами, смехом и красивыми кадрами.",
    },
  },
  {
    name: "Аружан",
    background: "/img/aruzhan.jpg",
    slides: [
      { src: "/img/aruzhan/1.jpg", text: "Рядом с тобой чувствуются спокойствие и тепло." },
      { src: "/img/aruzhan/2.jpg", text: "Ты очень внимательная и искренняя к людям." },
      { src: "/img/aruzhan/3.jpg", text: "Твоя энергия вдохновляет двигаться вперед." },
      { src: "/img/aruzhan/4.png", text: "Пусть этот день будет для тебя по-настоящему счастливым." },
    ],
    invitation: {
      ...invitationAlmaty,
      message:
        "Аружан, буду рада видеть тебя на нашем вечере в Алматы. Хочу, чтобы этот праздник запомнился тебе теплом, вниманием и красивыми моментами.",
    },
  },
];

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));
const sideClass = (index: number) => (index % 2 === 0 ? "left" : "right");
const STORY_VIEW_MS = 2800;
const PREVIEW_SHARP_MS = 450;
const SCROLL_SETTLE_MS = 1200;
const PROGRESS_TICK_MS = 40;
const preloadedImages = new Set<string>();
const EVENT_DATE_ICS = "20260308";
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
  const [startH, startM] = girl.invitation.time.split(":");
  const startHm = `${startH}${startM}`;
  const endHm = addHoursToHm(girl.invitation.time, 3);
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
    []
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
      buildCalendarIcs(selectedGirl)
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
        ])
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
                <h2>Приглашение</h2>
                <p>Дорогая {selectedGirl.name},</p>
                <p>
                  <strong>Дата:</strong> {selectedGirl.invitation.date}
                </p>
                <p>
                  <strong>Время:</strong> {selectedGirl.invitation.time}
                </p>
                <div className="place-row">
                  <p className="place-text">
                    <strong>Место:</strong> {selectedGirl.invitation.place},{" "}
                    {selectedGirl.invitation.city}
                  </p>
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
                </div>
                <p>{selectedGirl.invitation.message}</p>
                <a className="calendar-btn" href={calendarHref} download={calendarFilename}>
                  Добавить в Apple Календарь
                </a>
              </motion.article>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

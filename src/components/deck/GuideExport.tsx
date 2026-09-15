import { useEffect } from "react";
import { modules, slides } from "@/data/deck";
import { buildTranscript } from "@/data/deck/transcript";
import { SlideRenderer } from "./SlideRenderer";

const transcripts = buildTranscript();

export function GuideExport({ auto = false }: { auto?: boolean }) {
  useEffect(() => {
    if (!auto) return;
    const timer = window.setTimeout(() => window.print(), 2200);
    return () => window.clearTimeout(timer);
  }, [auto]);

  const timed = modules.filter((m) => m.minutes > 0);

  return (
    <div className="print-deck bg-paper text-ink">
      <section className="print-slide flex flex-col justify-center px-32">
        <p className="slide-kicker font-mono text-oxy">Instructor guide · complete package</p>
        <h1 className="slide-title-lg mt-6 max-w-[1500px] font-slab font-semibold">
          A Geologist's Guide to AI &amp; Machine Learning in Mineral Exploration
        </h1>
        <p className="slide-body-lg mt-8 max-w-[1400px] text-inksoft">
          Every slide in delivery order, each followed by a full presenter transcript: what to say, how to
          explain it to geology and geophysics students, what to emphasise, which examples to tell, the
          questions and activities to run, and how to move to the next slide.
        </p>
        <div className="mt-12 grid grid-cols-4 gap-6">
          {[
            { value: String(slides.length), label: "slides, original order" },
            { value: String(slides.length), label: "presenter transcripts" },
            { value: String(timed.length), label: "timed workshop modules" },
            { value: `${timed.reduce((sum, m) => sum + m.minutes, 0)} min`, label: "core delivery time" },
          ].map((s) => (
            <div key={s.label} className="border-t-4 border-oxy pt-4">
              <strong className="font-disp text-5xl">{s.value}</strong>
              <p className="slide-caption mt-2 text-inksoft">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="slide-caption mt-12 max-w-[1400px] text-inksoft">
          How to use this document: each slide page is followed by a page headed with the same slide number.
          Deliver from the slide page and prepare from the transcript page. Timings assume the five-hour
          schedule; the reference-library modules are optional self-study material.
        </p>
      </section>

      {slides.map((slide, i) => {
        const t = transcripts[i]!;
        return (
          <div key={slide.id}>
            <div className="print-slide">
              <SlideRenderer slide={slide} number={i + 1} total={slides.length} />
            </div>
            <section className="print-note">
              <header className="flex items-end justify-between gap-10 border-b-4 border-oxy pb-5">
                <div className="min-w-0">
                  <p className="note-kicker font-mono text-oxy">
                    Presenter transcript · Slide {String(t.slideNumber).padStart(3, "0")} of {slides.length}
                  </p>
                  <h2 className="note-title mt-3 font-slab font-semibold">{t.slideTitle}</h2>
                  <p className="note-meta mt-2 text-inksoft">
                    Module {t.moduleCode} — {t.moduleTitle} · {t.act}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="note-meta font-mono text-inksoft">{t.timing}</p>
                  <p className="note-meta mt-1 font-mono text-inksoft">Slide id: {t.slideId}</p>
                </div>
              </header>

              <div className="note-columns mt-7">
                <Block title="Purpose of this slide">
                  <p>{t.purpose}</p>
                </Block>
                <Block title="How to open">
                  <p>{t.opening}</p>
                </Block>
                <Block title="Walk the content" flow>
                  <dl className="space-y-4">
                    {t.walkthrough.map((w, wi) => (
                      <div key={`${w.label}-${wi}`} className="note-item">
                        <dt className="font-semibold text-ink">{w.label}</dt>
                        <dd className="mt-1 text-inksoft">{w.text}</dd>
                      </div>
                    ))}
                  </dl>
                </Block>
                <Block title="Emphasise">
                  <ul className="space-y-3">
                    {t.emphasise.map((e, ei) => (
                      <li key={ei} className="note-item flex gap-3 text-inksoft">
                        <span className="text-oxy">●</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </Block>
                <Block title="Example to tell">
                  <p>{t.example}</p>
                </Block>
                <Block title="Questions &amp; activities" flow>
                  <ol className="space-y-3">
                    {t.interaction.map((q, qi) => (
                      <li key={qi} className="note-item flex gap-3 text-inksoft">
                        <span className="font-mono text-ochre">{String(qi + 1).padStart(2, "0")}</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ol>
                </Block>
                <Block title="Transition to the next slide">
                  <p>{t.transition}</p>
                </Block>
              </div>
              <footer className="note-foot mt-8 flex justify-between border-t border-line pt-4 font-mono text-inksoft">
                <span>Instructor guide — transcript for slide {t.slideNumber}</span>
                <span>{String(t.slideNumber).padStart(3, "0")} / {slides.length}</span>
              </footer>
            </section>
          </div>
        );
      })}
    </div>
  );
}

function Block({ title, children, flow }: { title: string; children: React.ReactNode; flow?: boolean }) {
  return (
    <section className={flow ? "note-flow" : undefined}>
      <h3 className="note-label font-mono uppercase text-oxy">{title}</h3>
      <div className="note-body mt-3 text-inksoft">{children}</div>
    </section>
  );
}

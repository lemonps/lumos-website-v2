"use client";

import type { ParsedHtmlDocument } from "@/lib/webflow-site";
import { WebflowRuntime } from "@/components/webflow-runtime";

type WebflowPageProps = {
  document: ParsedHtmlDocument;
};

function buildHtmlAttributeScript(
  htmlAttributes: ParsedHtmlDocument["htmlAttributes"],
) {
  return `
    const htmlAttributes = ${JSON.stringify(htmlAttributes)};
    for (const [key, value] of Object.entries(htmlAttributes)) {
      document.documentElement.setAttribute(key, value);
    }
  `;
}

function buildQuestionsAccordionScript() {
  return `
    (() => {
      const OPEN_CLASS = "is-open";

      const getItems = (group) =>
        Array.from(group.children).filter(
          (element) => element instanceof HTMLElement && element.classList.contains("questions-container"),
        );

      const setExpanded = (item, expanded) => {
        const trigger = item.querySelector(".question");
        const answer = item.querySelector(".answer-holder");

        if (!(trigger instanceof HTMLElement) || !(answer instanceof HTMLElement)) {
          return;
        }

        item.classList.toggle(OPEN_CLASS, expanded);
        trigger.setAttribute("aria-expanded", String(expanded));
        answer.style.maxHeight = expanded ? \`\${answer.scrollHeight}px\` : "0px";
      };

      const init = () => {
        const groups = Array.from(document.querySelectorAll(".questions-holder"));

        groups.forEach((group, groupIndex) => {
          if (!(group instanceof HTMLElement)) {
            return;
          }

          const items = getItems(group);

          items.forEach((item, itemIndex) => {
            const trigger = item.querySelector(".question");
            const answer = item.querySelector(".answer-holder");

            if (
              !(item instanceof HTMLElement) ||
              !(trigger instanceof HTMLElement) ||
              !(answer instanceof HTMLElement) ||
              item.dataset.accordionReady === "true"
            ) {
              return;
            }

            item.dataset.accordionReady = "true";

            const answerId = \`question-answer-\${groupIndex}-\${itemIndex}\`;
            answer.id = answerId;

            trigger.setAttribute("role", "button");
            trigger.setAttribute("tabindex", "0");
            trigger.setAttribute("aria-controls", answerId);

            const toggle = () => {
              const nextExpanded = !item.classList.contains(OPEN_CLASS);

              items.forEach((candidate) => {
                if (candidate instanceof HTMLElement) {
                  setExpanded(candidate, false);
                }
              });

              if (nextExpanded) {
                setExpanded(item, true);
              }
            };

            trigger.addEventListener("click", toggle);
            trigger.addEventListener("keydown", (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggle();
              }
            });

            setExpanded(item, itemIndex === 0);
          });
        });

        const syncExpandedHeights = () => {
          document
            .querySelectorAll(".questions-container.is-open .answer-holder")
            .forEach((answer) => {
              if (answer instanceof HTMLElement) {
                answer.style.maxHeight = \`\${answer.scrollHeight}px\`;
              }
            });
        };

        window.addEventListener("resize", syncExpandedHeights);
        window.addEventListener("load", syncExpandedHeights, { once: true });
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
      } else {
        init();
      }
    })();
  `;
}

function buildExternalRuntimeScript(
  externalScripts: ParsedHtmlDocument["externalScripts"],
) {
  const categorized = {
    jquery: externalScripts.filter((script) =>
      script.src.includes("d3e54v103j8qbb.cloudfront.net/js/jquery"),
    ),
    gsapCore: externalScripts.filter((script) =>
      script.src.includes("/gsap.min.js"),
    ),
    gsapPlugins: externalScripts.filter(
      (script) =>
        script.src.includes("/SplitText.min.js") ||
        script.src.includes("/ScrollTrigger.min.js"),
    ),
    webflowChunks: externalScripts.filter((script) =>
      script.src.includes("/js/webflow.schunk."),
    ),
    webflowMain: externalScripts.filter(
      (script) =>
        script.src.includes("/js/webflow.") &&
        !script.src.includes("/js/webflow.schunk."),
    ),
    other: externalScripts.filter(
      (script) =>
        !script.src.includes("d3e54v103j8qbb.cloudfront.net/js/jquery") &&
        !script.src.includes("/gsap.min.js") &&
        !script.src.includes("/SplitText.min.js") &&
        !script.src.includes("/ScrollTrigger.min.js") &&
        !script.src.includes("/js/webflow."),
    ),
  };

  const orderedScripts = [
    ...categorized.jquery,
    ...categorized.gsapCore,
    ...categorized.gsapPlugins,
    ...categorized.webflowChunks,
    ...categorized.webflowMain,
    ...categorized.other,
  ];

  return `
    (() => {
      const scripts = ${JSON.stringify(orderedScripts)};

      const loadScript = (script) =>
        new Promise((resolve, reject) => {
          if (!script?.src) {
            resolve();
            return;
          }

          if (document.querySelector(\`script[data-external-runtime-src="\${script.src}"]\`)) {
            resolve();
            return;
          }

          const element = document.createElement("script");
          element.src = script.src;
          element.async = false;
          element.dataset.externalRuntimeSrc = script.src;

          if (script.type) {
            element.type = script.type;
          }

          if (script.crossOrigin) {
            element.crossOrigin = script.crossOrigin;
          }

          if (script.integrity) {
            element.integrity = script.integrity;
          }

          element.onload = () => resolve();
          element.onerror = () =>
            reject(new Error(\`Failed to load external runtime script: \${script.src}\`));

          document.body.appendChild(element);
        });

      const init = async () => {
        try {
          for (const script of scripts) {
            await loadScript(script);
          }

          window.dispatchEvent(new Event("load"));
        } catch (error) {
          console.error(error);
        }
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
      } else {
        init();
      }
    })();
  `;
}

function buildNavbarScript() {
  return `
    (() => {
      const MOBILE_BREAKPOINT = 991;

      const init = () => {
        const navbars = Array.from(document.querySelectorAll(".navbar.w-nav"));

        navbars.forEach((navbar, navbarIndex) => {
          if (!(navbar instanceof HTMLElement) || navbar.dataset.navReady === "true") {
            return;
          }

          const menu = navbar.querySelector(".nav-menu");
          const button = navbar.querySelector(".menu-button");

          if (!(menu instanceof HTMLElement) || !(button instanceof HTMLElement)) {
            return;
          }

          navbar.dataset.navReady = "true";

          const menuId = \`nav-menu-\${navbarIndex}\`;
          menu.id = menuId;
          button.setAttribute("role", "button");
          button.setAttribute("tabindex", "0");
          button.setAttribute("aria-controls", menuId);
          button.setAttribute("aria-label", "Toggle navigation menu");

          const isMobileViewport = () => window.innerWidth <= MOBILE_BREAKPOINT;

          const setOpen = (open) => {
            const shouldOpen = isMobileViewport() && open;

            menu.classList.toggle("w--open", shouldOpen);
            button.classList.toggle("w--open", shouldOpen);
            button.setAttribute("aria-expanded", String(shouldOpen));

            if (shouldOpen) {
              menu.style.display = "block";
              menu.setAttribute("data-nav-menu-open", "");
            } else {
              menu.style.display = isMobileViewport() ? "none" : "";
              menu.removeAttribute("data-nav-menu-open");
            }
          };

          const toggle = () => {
            setOpen(!menu.classList.contains("w--open"));
          };

          button.addEventListener("click", toggle);
          button.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              toggle();
            }
          });

          menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
              setOpen(false);
            });
          });

          document.addEventListener("click", (event) => {
            if (!(event.target instanceof Node)) {
              return;
            }

            if (!navbar.contains(event.target)) {
              setOpen(false);
            }
          });

          window.addEventListener("resize", () => {
            setOpen(false);
          });

          setOpen(false);
        });
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
      } else {
        init();
      }
    })();
  `;
}

function buildMotionScript() {
  return `
    (() => {
      const VISIBLE_CLASS = "is-motion-visible";
      const TARGET_CLASS = "motion-target";
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const immediateSelectors = [
        ".navbar",
        ".nav-link",
        ".animate-on-load",
      ];

      const scrollSelectors = [
        ".fade-in-on-scroll",
        ".fade-in-blur",
        ".hero-text-wrapper",
        ".hero-section-app-container",
        ".shadow",
      ];

      const hasInlineMotion = (element) => {
        const style = element.getAttribute("style") ?? "";
        return (
          /opacity\\s*:\\s*0/i.test(style) ||
          /filter\\s*:\\s*blur\\(/i.test(style) ||
          /transform\\s*:\\s*translate3d\\(/i.test(style)
        );
      };

      const setDelay = (element, delay) => {
        element.style.setProperty("--motion-delay", \`\${delay}ms\`);
      };

      const reveal = (element) => {
        if (!(element instanceof HTMLElement) || element.dataset.motionVisible === "true") {
          return;
        }

        element.dataset.motionVisible = "true";
        element.classList.add(VISIBLE_CLASS);

        if (element.dataset.motionKind === "inline") {
          element.style.willChange = "opacity, transform, filter";
          element.style.transition = [
            "opacity 720ms cubic-bezier(0.22, 1, 0.36, 1)",
            "transform 720ms cubic-bezier(0.22, 1, 0.36, 1)",
            "filter 720ms cubic-bezier(0.22, 1, 0.36, 1)",
          ].join(", ");
          element.style.transitionDelay = element.style.getPropertyValue("--motion-delay") || "0ms";
          element.style.opacity = "1";

          if ((element.style.filter || "").includes("blur")) {
            element.style.filter = "blur(0px)";
          }

          if ((element.style.transform || "").includes("translate3d")) {
            element.style.transform =
              "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)";
          }
        }
      };

      const prepareTargets = (selectorList, kind) => {
        const targets = Array.from(document.querySelectorAll(selectorList.join(", "))).filter(
          (element) => element instanceof HTMLElement,
        );

        targets.forEach((element, index) => {
          if (!(element instanceof HTMLElement) || element.dataset.motionPrepared === "true") {
            return;
          }

          element.dataset.motionPrepared = "true";
          element.dataset.motionKind = kind;

          if (kind === "class") {
            element.classList.add(TARGET_CLASS);
          }

          setDelay(element, Math.min(index * 50, 240));

          if (reduceMotion) {
            reveal(element);
          }
        });

        return targets;
      };

      const prepareInlineTargets = () => {
        const targets = Array.from(document.querySelectorAll("[data-w-id]")).filter(
          (element) => element instanceof HTMLElement && hasInlineMotion(element),
        );

        targets.forEach((element, index) => {
          if (!(element instanceof HTMLElement) || element.dataset.motionPrepared === "true") {
            return;
          }

          element.dataset.motionPrepared = "true";
          element.dataset.motionKind = "inline";
          setDelay(element, Math.min(index * 70, 280));

          if (reduceMotion) {
            reveal(element);
          }
        });

        return targets;
      };

      const init = () => {
        if (
          document.querySelector('[data-external-runtime-src*="/js/webflow."]') ||
          window.Webflow
        ) {
          document.documentElement.classList.add("w-mod-ix3");
          return;
        }

        const immediateTargets = prepareTargets(immediateSelectors, "class");
        const scrollTargets = prepareTargets(scrollSelectors, "class");
        const inlineTargets = prepareInlineTargets();

        document.documentElement.classList.add("w-mod-ix3");

        if (reduceMotion) {
          [...immediateTargets, ...scrollTargets, ...inlineTargets].forEach((element) => {
            reveal(element);
          });
          return;
        }

        requestAnimationFrame(() => {
          immediateTargets.forEach((element) => reveal(element));
        });

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                reveal(entry.target);
                observer.unobserve(entry.target);
              }
            });
          },
          {
            rootMargin: "0px 0px -10% 0px",
            threshold: 0.15,
          },
        );

        [...scrollTargets, ...inlineTargets].forEach((element) => {
          observer.observe(element);
        });
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
      } else {
        init();
      }
    })();
  `;
}

function buildFeatureSliderScript() {
  return `
    (() => {
      const READY_CLASS = "is-carousel-ready";

      const getSlides = (mask) =>
        Array.from(mask.children).filter(
          (child) => child instanceof HTMLElement && child.classList.contains("feature-slide"),
        );

      const getSignature = (slide) => {
        const image = slide.querySelector("img");
        const heading = slide.querySelector(".slider-heading");
        const body = slide.querySelector(".grey-text-2");

        return [
          image?.getAttribute("src") ?? "",
          heading?.textContent?.trim() ?? "",
          body?.textContent?.trim() ?? "",
        ].join("::");
      };

      const init = () => {
        const sliders = Array.from(document.querySelectorAll(".feature-slider-wrapper"));

        sliders.forEach((slider) => {
          if (!(slider instanceof HTMLElement) || slider.dataset.carouselReady === "true") {
            return;
          }

          const mask = slider.querySelector(".feature-slider-mask");
          const previousButton = slider.querySelector(".left-arrow");
          const nextButton = slider.querySelector(".right-arrow");

          if (
            !(mask instanceof HTMLElement) ||
            !(previousButton instanceof HTMLElement) ||
            !(nextButton instanceof HTMLElement)
          ) {
            return;
          }

          slider.dataset.carouselReady = "true";
          slider.classList.add(READY_CLASS);
          slider.setAttribute("tabindex", "0");
          slider.setAttribute("aria-roledescription", "carousel");

          let slides = getSlides(mask);
          if (slides.length >= 2 && slides.length % 2 === 0) {
            const midpoint = slides.length / 2;
            const firstHalf = slides.slice(0, midpoint);
            const secondHalf = slides.slice(midpoint);
            const isMirrored = firstHalf.every(
              (slide, index) => getSignature(slide) === getSignature(secondHalf[index]),
            );

            if (isMirrored) {
              secondHalf.forEach((slide) => slide.remove());
              slides = firstHalf;
            }
          }

          if (slides.length === 0) {
            return;
          }

          previousButton.setAttribute("role", "button");
          nextButton.setAttribute("role", "button");
          previousButton.setAttribute("tabindex", "0");
          nextButton.setAttribute("tabindex", "0");
          previousButton.setAttribute("aria-label", "Previous slide");
          nextButton.setAttribute("aria-label", "Next slide");

          let currentIndex = 0;

          const render = () => {
            const gap = parseFloat(window.getComputedStyle(mask).columnGap || window.getComputedStyle(mask).gap || "0");
            const slideWidth = slides[0]?.getBoundingClientRect().width ?? 0;
            const offset = currentIndex * (slideWidth + gap);

            mask.style.transform = \`translate3d(-\${offset}px, 0, 0)\`;

            slides.forEach((slide, index) => {
              const isActive = index === currentIndex;
              slide.classList.toggle("is-active", isActive);
              slide.setAttribute("aria-hidden", String(!isActive));
            });
          };

          const goTo = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            render();
          };

          const next = (event) => {
            event?.preventDefault?.();
            event?.stopPropagation?.();
            event?.stopImmediatePropagation?.();
            goTo(currentIndex + 1);
          };

          const previous = (event) => {
            event?.preventDefault?.();
            event?.stopPropagation?.();
            event?.stopImmediatePropagation?.();
            goTo(currentIndex - 1);
          };

          previousButton.addEventListener("click", previous);
          nextButton.addEventListener("click", next);

          [previousButton, nextButton].forEach((button, buttonIndex) => {
            button.addEventListener("keydown", (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (buttonIndex === 0) {
                  previous(event);
                } else {
                  next(event);
                }
              }
            });
          });

          slider.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
              previous(event);
            }

            if (event.key === "ArrowRight") {
              next(event);
            }
          });

          let pointerStartX = null;
          mask.addEventListener("pointerdown", (event) => {
            pointerStartX = event.clientX;
          });

          mask.addEventListener("pointerup", (event) => {
            if (pointerStartX === null) {
              return;
            }

            const deltaX = event.clientX - pointerStartX;
            pointerStartX = null;

            if (Math.abs(deltaX) < 40) {
              return;
            }

            if (deltaX < 0) {
              next(event);
            } else {
              previous(event);
            }
          });

          mask.addEventListener("pointercancel", () => {
            pointerStartX = null;
          });

          window.addEventListener("resize", render);

          if (typeof ResizeObserver !== "undefined") {
            const observer = new ResizeObserver(render);
            observer.observe(slider);
          }

          window.addEventListener("load", render, { once: true });
          render();
        });
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
      } else {
        init();
      }
    })();
  `;
}

function buildSlideInCopyScript() {
  return `
    (() => {
      const init = () => {
        const copy = document.querySelector('.lumos-intro__copy');
        if (!copy || copy.dataset.slideReady === 'true') return;

        const text = copy.textContent || '';
        copy.innerHTML = text
          .split('')
          .map((char, i) =>
            \`<span class="char" style="animation-delay:\${i * 30}ms">\${char === ' ' ? '&nbsp;' : char}</span>\`
          )
          .join('');
        copy.dataset.slideReady = 'true';
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
      } else {
        init();
      }
    })();
  `;
}

function buildBlurInTitleScript() {
  return `
    (() => {
      const DESKTOP_BREAKPOINT = 767;

      const fitTitle = (title) => {
        if (!(title instanceof HTMLElement)) {
          return;
        }

        if (window.innerWidth <= DESKTOP_BREAKPOINT) {
          title.style.removeProperty('--lumos-intro-title-size');
          return;
        }

        const container = title.closest('.lumos-intro__content');
        if (!(container instanceof HTMLElement)) {
          return;
        }

        title.style.removeProperty('--lumos-intro-title-size');

        const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const availableWidth = Math.min(container.clientWidth, viewportWidth - 64);
        const measuredWidth = title.scrollWidth;
        const currentSize = parseFloat(window.getComputedStyle(title).fontSize);

        if (!availableWidth || !measuredWidth || !currentSize) {
          return;
        }

        const fittedSize = currentSize * Math.min(1, (availableWidth / measuredWidth) * 0.98);
        title.style.setProperty('--lumos-intro-title-size', \`\${Math.max(24, fittedSize).toFixed(2)}px\`);
      };

      const init = () => {
        const title = document.querySelector('.lumos-intro__title');
        if (!title || title.dataset.blurReady === 'true') return;
        const text = title.textContent || '';
        const words = text.trim().split(/\\s+/);
        title.innerHTML = words
          .map((word, i) =>
            \`<span class="word" style="animation-delay:\${i * 280}ms">\${word}</span>\`
          )
          .join(' ');
        title.dataset.blurReady = 'true';

        fitTitle(title);
        window.addEventListener('resize', () => fitTitle(title));
        window.addEventListener('load', () => fitTitle(title), { once: true });

        if (document.fonts?.ready) {
          document.fonts.ready.then(() => fitTitle(title));
        }

        if (typeof ResizeObserver !== 'undefined') {
          const observer = new ResizeObserver(() => fitTitle(title));
          const container = title.closest('.lumos-intro__content');

          if (container instanceof HTMLElement) {
            observer.observe(container);
          }
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
      } else {
        init();
      }
    })();
  `;
}

export function WebflowPage({ document }: WebflowPageProps) {
  const runtimeScripts = [
    buildHtmlAttributeScript(document.htmlAttributes),
    buildExternalRuntimeScript(document.externalScripts),
    buildNavbarScript(),
    buildMotionScript(),
    buildQuestionsAccordionScript(),
    buildFeatureSliderScript(),
    buildSlideInCopyScript(),
    buildBlurInTitleScript(),
  ];

  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: document.bodyHtml }}
      />
      <WebflowRuntime scripts={runtimeScripts} />
    </>
  );
}

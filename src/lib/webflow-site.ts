import { cache } from "react";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

const SOURCE_DIR = path.join(process.cwd(), "site-export");

type HtmlAttributes = Record<string, string>;

type MetaMap = Record<string, string>;

export type ExternalScript = {
  crossOrigin?: "anonymous" | "use-credentials";
  integrity?: string;
  src: string;
  type?: string;
};

export type ParsedHtmlDocument = {
  bodyHtml: string;
  description?: string;
  externalScripts: ExternalScript[];
  htmlAttributes: HtmlAttributes;
  jsonLdBlocks: string[];
  meta: MetaMap;
  title: string;
};

function walkHtmlFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkHtmlFiles(fullPath);
    }

    return entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function parseAttributes(source: string): Record<string, string> {
  const attributes: Record<string, string> = {};

  for (const match of source.matchAll(
    /([:@\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g,
  )) {
    const [, key, doubleQuoted, singleQuoted, bare] = match;
    const value = doubleQuoted ?? singleQuoted ?? bare ?? "";
    attributes[key] = decodeHtml(value);
  }

  return attributes;
}

function getTagContent(source: string, tagName: string) {
  const match = source.match(
    new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, "i"),
  );

  return match ? match[1].trim() : "";
}

function buildHomeIntroSection() {
  return `<section class="lumos-intro"><div class="container"><div class="lumos-intro__inner"><div class="lumos-intro__content"><h1 class="lumos-intro__title">Specialized Autonomous Systems</h1><p class="lumos-intro__copy">Making businesses scalable without scaling costs.</p><a class="button w-inline-block lumos-intro__button" href="/contact"><div class="button-text-holder"><div class="button-text">Learn more</div></div></a></div></div></div></section>`;
}

function buildOrbitingCirclesGraphic() {
  const icons = {
    whatsapp: `
      <svg viewBox="0 0 175.216 175.552" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="lumos-whatsapp-gradient" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#57d163" />
            <stop offset="1" stop-color="#23b33a" />
          </linearGradient>
          <filter id="lumos-whatsapp-shadow" width="1.115" height="1.114" x="-.057" y="-.057" color-interpolation-filters="sRGB">
            <feGaussianBlur stdDeviation="3.531" />
          </filter>
        </defs>
        <path d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0" fill="#b3b3b3" filter="url(#lumos-whatsapp-shadow)" />
        <path d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z" fill="#ffffff" />
        <path d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.929z" fill="url(#lumos-whatsapp-gradient)" />
        <path d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647" fill="#ffffff" fill-rule="evenodd" />
      </svg>
    `,
    notion: `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z" fill="#ffffff" />
        <path d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z" fill="#000000" fill-rule="evenodd" clip-rule="evenodd" />
      </svg>
    `,
    openai: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="currentColor" d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
      </svg>
    `,
    googleDrive: `
      <svg viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
        <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
        <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
        <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
        <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
        <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
      </svg>
    `,
  };

  return `
    <div class="bento-grid-image-full lumos-orbit-demo" aria-hidden="true">
      <div class="lumos-orbit-demo__backdrop"></div>
      <div class="lumos-orbit-demo__ring lumos-orbit-demo__ring--outer"></div>
      <div class="lumos-orbit-demo__ring lumos-orbit-demo__ring--mid"></div>
      <div class="lumos-orbit-demo__ring lumos-orbit-demo__ring--inner"></div>

      <div class="lumos-orbit-demo__orbit" style="--orbit-duration: 28s;">
        <div class="lumos-orbit-demo__node" style="--angle: 8deg; --radius: 205px; --node-size: 74px; --node-tint: rgba(255, 163, 122, 0.28);">
          <span class="lumos-orbit-demo__node-label"><span class="lumos-orbit-demo__node-icon">${icons.whatsapp}</span></span>
        </div>
        <div class="lumos-orbit-demo__node" style="--angle: 72deg; --radius: 205px; --node-size: 78px; --node-tint: rgba(255, 216, 188, 0.16);">
          <span class="lumos-orbit-demo__node-label"><span class="lumos-orbit-demo__node-icon">${icons.notion}</span></span>
        </div>
        <div class="lumos-orbit-demo__node" style="--angle: 146deg; --radius: 205px; --node-size: 82px; --node-tint: rgba(255, 117, 87, 0.22);">
          <span class="lumos-orbit-demo__node-label"><span class="lumos-orbit-demo__node-icon">${icons.openai}</span></span>
        </div>
        <div class="lumos-orbit-demo__node" style="--angle: 218deg; --radius: 205px; --node-size: 76px; --node-tint: rgba(255, 226, 202, 0.14);">
          <span class="lumos-orbit-demo__node-label"><span class="lumos-orbit-demo__node-icon">${icons.googleDrive}</span></span>
        </div>
        <div class="lumos-orbit-demo__node" style="--angle: 292deg; --radius: 205px; --node-size: 88px; --node-tint: rgba(255, 141, 107, 0.22);">
          <span class="lumos-orbit-demo__node-label"><span class="lumos-orbit-demo__node-icon">${icons.whatsapp}</span></span>
        </div>
      </div>

      <div class="lumos-orbit-demo__orbit lumos-orbit-demo__orbit--reverse" style="--orbit-duration: 19s;">
        <div class="lumos-orbit-demo__node" style="--angle: 34deg; --radius: 132px; --node-size: 62px; --node-tint: rgba(255, 220, 190, 0.12);">
          <span class="lumos-orbit-demo__node-label"><span class="lumos-orbit-demo__node-icon lumos-orbit-demo__node-icon--small">${icons.whatsapp}</span></span>
        </div>
        <div class="lumos-orbit-demo__node" style="--angle: 124deg; --radius: 132px; --node-size: 68px; --node-tint: rgba(255, 123, 91, 0.2);">
          <span class="lumos-orbit-demo__node-label"><span class="lumos-orbit-demo__node-icon lumos-orbit-demo__node-icon--small">${icons.notion}</span></span>
        </div>
        <div class="lumos-orbit-demo__node" style="--angle: 214deg; --radius: 132px; --node-size: 58px; --node-tint: rgba(255, 214, 184, 0.14);">
          <span class="lumos-orbit-demo__node-label"><span class="lumos-orbit-demo__node-icon lumos-orbit-demo__node-icon--small">${icons.openai}</span></span>
        </div>
        <div class="lumos-orbit-demo__node" style="--angle: 304deg; --radius: 132px; --node-size: 60px; --node-tint: rgba(255, 149, 116, 0.24);">
          <span class="lumos-orbit-demo__node-label"><span class="lumos-orbit-demo__node-icon lumos-orbit-demo__node-icon--small">${icons.googleDrive}</span></span>
        </div>
      </div>

      <div class="lumos-orbit-demo__core">
        <div class="lumos-orbit-demo__core-glow"></div>
        <div class="lumos-orbit-demo__core-shell">
          <div class="lumos-orbit-demo__core-lines"></div>
          <div class="lumos-orbit-demo__core-mark">
            <img alt="Lumos logomark" class="lumos-orbit-demo__core-logo" src="/lumos-logomark-white.png" />
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildAnimatedListGraphic() {
  return `
    <div class="bento-grid-image-full lumos-animated-list" aria-hidden="true">
      <div class="lumos-animated-list__stack">
        <article class="lumos-animated-list__item" style="--list-delay: 0ms;">
          <div class="lumos-animated-list__icon" style="--list-accent: #f06b3d;">$</div>
          <div class="lumos-animated-list__content">
            <div class="lumos-animated-list__meta">
              <span class="lumos-animated-list__title">Lead qualified</span>
              <span class="lumos-animated-list__time">Now</span>
            </div>
            <p class="lumos-animated-list__text">Lumos AI surfaced a high-intent prospect from live chat.</p>
          </div>
        </article>

        <article class="lumos-animated-list__item" style="--list-delay: 240ms;">
          <div class="lumos-animated-list__icon" style="--list-accent: #f08b4a;">+</div>
          <div class="lumos-animated-list__content">
            <div class="lumos-animated-list__meta">
              <span class="lumos-animated-list__title">Reply drafted</span>
              <span class="lumos-animated-list__time">2m ago</span>
            </div>
            <p class="lumos-animated-list__text">Suggested a response using customer context and tone memory.</p>
          </div>
        </article>

        <article class="lumos-animated-list__item" style="--list-delay: 480ms;">
          <div class="lumos-animated-list__icon" style="--list-accent: #bf4b2f;">!</div>
          <div class="lumos-animated-list__content">
            <div class="lumos-animated-list__meta">
              <span class="lumos-animated-list__title">Action scheduled</span>
              <span class="lumos-animated-list__time">5m ago</span>
            </div>
            <p class="lumos-animated-list__text">Follow-up call booked and CRM notes synced automatically.</p>
          </div>
        </article>

        <article class="lumos-animated-list__item" style="--list-delay: 720ms;">
          <div class="lumos-animated-list__icon" style="--list-accent: #ffd08b;">*</div>
          <div class="lumos-animated-list__content">
            <div class="lumos-animated-list__meta">
              <span class="lumos-animated-list__title">Insight captured</span>
              <span class="lumos-animated-list__time">9m ago</span>
            </div>
            <p class="lumos-animated-list__text">Conversation summary saved for the team with next-best actions.</p>
          </div>
        </article>
      </div>

      <div class="lumos-animated-list__fade"></div>
    </div>
  `;
}

function buildAboutChatHeroGraphic(containerClass = "premium-icons-holder") {
  return `
    <div class="${containerClass} lumos-about-chat" aria-hidden="true">
      <div class="chat-holder">
        <div class="chat-container">
          <div class="chat-image-holder _01">
            <img alt="Team Member" class="chat-image" loading="lazy" sizes="(max-width: 1110px) 100vw, 1110px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%20Member%2005.webp" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%20Member%2005.webp 1110w"/>
            <div class="light-blur"></div>
            <div class="chat-wrapper"><div class="gradient-bg"><div class="chat"><div>Hey team, what if we made a super cool app that changes the way people chat?</div><img alt="" class="chat-blur" loading="lazy" sizes="(max-width: 1568px) 100vw, 1568px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-500.png 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-800.png 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-1080.png 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif 1568w"/></div></div></div>
          </div>
          <div class="chat-image-holder _02"><div class="chat-wrapper"><div class="chat"><div>You mean, like mixing AI with group chats? Sounds awesome!</div></div></div><img alt="Team Member" class="chat-image" loading="lazy" sizes="(max-width: 1110px) 100vw, 1110px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp 1110w"/></div>
          <div class="chat-image-holder _01"><img alt="Team Member" class="chat-image" loading="lazy" sizes="(max-width: 1110px) 100vw, 1110px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%20Member%2005.webp" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%20Member%2005.webp 1110w"/><div class="chat-wrapper"><div class="gradient-bg"><div class="chat"><div>Exactly! Imagine resolving conflicts or getting instant answers right in your chat.</div><img alt="" class="chat-blur" loading="lazy" sizes="(max-width: 1568px) 100vw, 1568px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-500.png 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-800.png 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-1080.png 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif 1568w"/></div></div></div></div>
          <div class="chat-image-holder _02"><div class="chat-wrapper"><div class="chat"><div>Plus, we could add voice chatting with AI for hands-free convos. Super futuristic!</div></div></div><img alt="Team Member" class="chat-image" loading="lazy" sizes="(max-width: 1110px) 100vw, 1110px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp 1110w"/></div>
          <div class="chat-image-holder _01"><img alt="Team Member" class="chat-image" loading="lazy" sizes="(max-width: 1110px) 100vw, 1110px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%20Member%2005.webp" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%20Member%2005.webp 1110w"/><div class="light-blur"></div><div class="chat-wrapper"><div class="gradient-bg"><div class="chat"><div>And what if people could personalize chats with cool features, like adding cards?</div><img alt="" class="chat-blur" loading="lazy" sizes="(max-width: 1568px) 100vw, 1568px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-500.png 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-800.png 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-1080.png 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif 1568w"/></div></div></div></div>
          <div class="chat-image-holder _02"><div class="chat-wrapper"><div class="chat"><div>Let’s do it. This is going to be the smartest app anyone’s ever used!</div></div></div><img alt="Team Member" class="chat-image" loading="lazy" sizes="(max-width: 1110px) 100vw, 1110px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp 1110w"/></div>
        </div>
      </div>
    </div>
  `;
}

function normalizeBodyHtml(body: string, filePath: string) {
  let normalizedBody = body.replaceAll(
    '<a class="button w-inline-block" href="https://webflow.com/templates/designers/over-sight" target="_blank"><div class="button-text-holder"><div class="button-text">Buy Template</div></div></a>',
    '<a class="button w-inline-block" href="/contact"><div class="button-text-holder"><div class="button-text">Learn More</div></div></a>',
  );

  normalizedBody = normalizedBody.replace(
    /<div class="premium-icons-holder"[^>]*><div class="premium-icon-holder _01"[\s\S]*?<div class="premium-icon-holder _03"[\s\S]*?<\/div><\/div>/,
    buildAboutChatHeroGraphic("premium-icons-holder"),
  );

  normalizedBody = normalizedBody.replace(
    '<div class="bento-grid-wrapper _02" data-w-id="1d0c9a22-fef3-2282-5200-c685356db56e" style="-webkit-transform:translate3d(0, 45px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 45px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 45px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 45px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);filter:blur(10px);opacity:0"><div class="bento-grid-content"><img alt="" class="bento-grid-image-full _02" loading="lazy" sizes="(max-width: 1080px) 100vw, 1080px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac62_Feature%20Images%2003.avif" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac62_Feature%20Images%2003.avif 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac62_Feature%20Images%2003.avif 1080w"/><div class="bento-grid-text-holder _02"><div class="bento-grid-text">AI Images</div><p class="grey-text">Turn simple prompts into striking visuals in seconds.</p></div></div></div>',
    "",
  );

  normalizedBody = normalizedBody.replace(
    '<div class="bento-grid-wrapper" data-w-id="1d0c9a22-fef3-2282-5200-c685356db57e" id="w-node-_1d0c9a22-fef3-2282-5200-c685356db57e-ddca84cf" style="-webkit-transform:translate3d(0, 45px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-moz-transform:translate3d(0, 45px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);-ms-transform:translate3d(0, 45px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);transform:translate3d(0, 45px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0);filter:blur(10px);opacity:0"><div class="bento-grid-content _03"><img alt="" class="bento-grid-image-full _03" loading="lazy" sizes="(max-width: 1892px) 100vw, 1892px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac5a_Feature%20Images%2004.avif" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac5a_Feature%2520Images%252004-p-500.png 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac5a_Feature%2520Images%252004-p-800.png 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac5a_Feature%2520Images%252004-p-1080.png 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac5a_Feature%20Images%2004.avif 1892w"/><div class="bento-grid-text-holder _03"><div class="bento-grid-text">Voice Chat</div><p class="grey-text">Speak and get the response in real time</p></div></div></div>',
    "",
  );

  normalizedBody = normalizedBody.replace(
    '<img alt="Chat list showing three contacts: Super Chat with a geometric icon and partial message, Cameron Williamson with a black-and-white portrait and partial message, and Darrell Steward with a color portrait and partial message." class="bento-grid-image-full" loading="lazy" sizes="(max-width: 1480px) 100vw, 1480px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac51_Feature%20Images%2002.avif" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac51_Feature%20Images%2002.avif 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac51_Feature%20Images%2002.avif 1480w"/>',
    buildAnimatedListGraphic(),
  );

  normalizedBody = normalizedBody.replace(
    '<img alt="" class="bento-grid-image-full _03" loading="lazy" sizes="(max-width: 1892px) 100vw, 1892px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac5a_Feature%20Images%2004.avif" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac5a_Feature%2520Images%252004-p-500.png 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac5a_Feature%2520Images%252004-p-800.png 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac5a_Feature%2520Images%252004-p-1080.png 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac5a_Feature%20Images%2004.avif 1892w"/>',
    '<img alt="Search bar UI preview with red-orange accents." class="bento-grid-image-full _03" loading="lazy" sizes="(max-width: 3712px) 100vw, 3712px" src="/search_bar_red_orange.png" srcset="/search_bar_red_orange.png 3712w"/>',
  );

  normalizedBody = normalizedBody.replace(
    '<img alt="" class="bento-grid-image-full" loading="lazy" sizes="(max-width: 1410px) 100vw, 1410px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac69_Feature%20Images%2001.avif" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac69_Feature%20Images%2001.avif 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b77c2337adec7328ac69_Feature%20Images%2001.avif 1410w"/>',
    buildOrbitingCirclesGraphic(),
  );

  normalizedBody = normalizedBody.replaceAll(
    '<img alt="" class="hero-section-phone-screenshot-image" loading="eager" sizes="(max-width: 742px) 100vw, 742px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b544d986f1cb5f4764d0_Chating.jpg" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b544d986f1cb5f4764d0_Chating-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b544d986f1cb5f4764d0_Chating.jpg 742w"/>',
    '<img alt="Lumos logo." class="hero-section-phone-screenshot-image hero-section-phone-screenshot-image--lumos" loading="eager" sizes="(max-width: 3998px) 100vw, 3998px" src="/lumos-logo-white.png" srcset="/lumos-logo-white.png 3998w"/>',
  );

  if (path.basename(filePath) !== "index.html" || normalizedBody.includes("lumos-intro")) {
    return normalizedBody;
  }

  const firstSectionMarker =
    '<div class="section overflow-hidden" data-w-id="094d25be-efb6-883f-47ad-a5bd0931fa81">';

  if (!normalizedBody.includes(firstSectionMarker)) {
    return normalizedBody;
  }

  normalizedBody = normalizedBody.replace(
    firstSectionMarker,
    `${buildHomeIntroSection()}${firstSectionMarker}`,
  );

  return normalizedBody;
}

function getHtmlFileForSegments(segments: string[]) {
  const relativePath =
    segments.length === 0 ? "index.html" : `${segments.join("/")}.html`;
  const normalizedPath = path.normalize(relativePath);

  if (normalizedPath.startsWith("..") || path.isAbsolute(normalizedPath)) {
    return null;
  }

  const fullPath = path.join(SOURCE_DIR, normalizedPath);
  return existsSync(fullPath) ? fullPath : null;
}

const parseHtmlDocument = cache((filePath: string): ParsedHtmlDocument => {
  const source = readFileSync(filePath, "utf8");
  const head = getTagContent(source, "head");
  const body = getTagContent(source, "body");
  const htmlTagMatch = source.match(/<html\b([^>]*)>/i);

  const meta: MetaMap = {};
  for (const match of head.matchAll(/<meta\b([^>]*?)\/?>/gi)) {
    const attributes = parseAttributes(match[1]);
    const key = attributes.name ?? attributes.property;

    if (key && attributes.content) {
      meta[key] = attributes.content;
    }
  }

  const externalScripts: ExternalScript[] = [];
  for (const match of source.matchAll(/<script\b([^>]*)><\/script>/gi)) {
    const attributes = parseAttributes(match[1]);

    if (!attributes.src || attributes.src.includes("ajax.googleapis.com/ajax/libs/webfont")) {
      continue;
    }

    externalScripts.push({
      crossOrigin:
        attributes.crossorigin === "anonymous" ||
        attributes.crossorigin === "use-credentials"
          ? attributes.crossorigin
          : undefined,
      integrity: attributes.integrity,
      src: attributes.src,
      type: attributes.type,
    });
  }

  const jsonLdBlocks = [...head.matchAll(
    /<script\b[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json')[^>]*>([\s\S]*?)<\/script>/gi,
  )].map((match) => match[1].trim());

  return {
    bodyHtml: normalizeBodyHtml(
      body.replace(/<script\b[\s\S]*?<\/script>/gi, "").trim(),
      filePath,
    ),
    description: meta.description,
    externalScripts,
    htmlAttributes: parseAttributes(htmlTagMatch?.[1] ?? ""),
    jsonLdBlocks,
    meta,
    title: decodeHtml(getTagContent(head, "title")),
  };
});

const listRouteSegments = cache(() => {
  return walkHtmlFiles(SOURCE_DIR)
    .map((filePath) => path.relative(SOURCE_DIR, filePath))
    .map((relativePath) => relativePath.replace(/\.html$/i, ""))
    .map((relativePath) =>
      relativePath === "index" ? [] : relativePath.split(path.sep),
    );
});

export function getStaticSlugParams() {
  return listRouteSegments()
    .filter((segments) => segments.length > 0)
    .map((segments) => ({ slug: segments }));
}

export function getDocumentForSegments(segments: string[]) {
  const filePath = getHtmlFileForSegments(segments);
  return filePath ? parseHtmlDocument(filePath) : null;
}

export function getMetadataForSegments(segments: string[]): Metadata {
  const document = getDocumentForSegments(segments);

  if (!document) {
    return {};
  }

  const ogImage = document.meta["og:image"];
  const twitterImage = document.meta["twitter:image"];

  return {
    description: document.description,
    openGraph: {
      description: document.meta["og:description"] ?? document.description,
      images: ogImage ? [ogImage] : undefined,
      title: document.meta["og:title"] ?? document.title,
      type:
        document.meta["og:type"] === "website"
          ? "website"
          : undefined,
    },
    title: document.title,
    twitter: {
      card:
        document.meta["twitter:card"] === "summary_large_image"
          ? "summary_large_image"
          : undefined,
      description:
        document.meta["twitter:description"] ?? document.description,
      images: twitterImage ? [twitterImage] : undefined,
      title: document.meta["twitter:title"] ?? document.title,
    },
  };
}

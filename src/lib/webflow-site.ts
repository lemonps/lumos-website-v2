import { cache } from "react";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

const SOURCE_DIR = path.join(process.cwd(), "site-export");

type HtmlAttributes = Record<string, string>;

type MetaMap = Record<string, string>;

const SITE_TITLE = "Lumos";
const SITE_DESCRIPTION =
  "Lumos AI builds autonomous voice, operations, and business chat systems that help companies scale faster at lower cost.";
const TITLE_SUFFIXES = [
  " - AI App Webflow Template",
  " - AI SaaS Webflow Template",
  " - Premium AI Webflow Template",
];

type StringReplacement = readonly [search: string, replace: string];

type RouteMetadataOverride = {
  description: string;
  title: string;
};

type ArticleOverride = RouteMetadataOverride & {
  bodyHtml: string;
};

type RichTextPageOverride = RouteMetadataOverride & {
  bodyHtml: string;
};

const ROUTE_METADATA_OVERRIDES: Record<string, RouteMetadataOverride> = {
  "index.html": {
    title: "Lumos AI | Autonomous Systems for Business Scale",
    description:
      "Deploy AI voice systems, backoffice automation, and business chatbots built to help teams scale at the lowest cost and fastest pace.",
  },
  "features.html": {
    title: "Features | Lumos AI Systems",
    description:
      "Explore Lumos AI voice systems, operation systems, and business chatbots for Southeast Asia workflows and multilingual customer operations.",
  },
  "about.html": {
    title: "About Lumos AI",
    description:
      "Lumos AI builds autonomous systems that answer, execute, and move work forward across calls, chat, and backoffice tools.",
  },
  "pricing.html": {
    title: "Pricing | Lumos AI",
    description:
      "Lumos AI pricing is structured around deployment scope, automation depth, language coverage, and integration complexity.",
  },
  "blog.html": {
    title: "Insights | Lumos AI",
    description:
      "Field notes on AI voice agents, operations automation, business chatbots, and real autonomous use cases across Southeast Asia.",
  },
  "contact.html": {
    title: "Contact Lumos AI",
    description:
      "Talk to the Lumos AI team about voice systems, operations automation, chatbots, and custom autonomous agents for your business.",
  },
  "utility-pages/privacy-policy.html": {
    title: "Privacy Policy | Lumos AI",
    description:
      "How Lumos AI handles information submitted through its website, demos, and business conversations.",
  },
  "utility-pages/terms-of-service.html": {
    title: "Terms of Service | Lumos AI",
    description:
      "Terms governing use of the Lumos AI website, demos, and related services.",
  },
  "utility-pages/cookie-policy.html": {
    title: "Cookie Policy | Lumos AI",
    description:
      "How Lumos AI uses cookies and similar technologies on its website.",
  },
};

const ARTICLE_OVERRIDES: Record<string, ArticleOverride> = {
  "post/how-to-make-an-ai-product-website-feel-premium-without-slowing-it-down.html":
    {
      title: "How AI Voice Agents Reduce Response Time for SEA Businesses",
      description:
        "Why multilingual AI voice systems are becoming the fastest way for Southeast Asia teams to improve support, sales, and recruiting response times.",
      bodyHtml: `
        <div class="rich-text-block w-richtext">
          <h2>Response time is a cost problem</h2>
          <p>Most service teams do not break because people stop caring. They break because response volume rises faster than headcount. Calls go unanswered, leads cool off, and hiring pipelines slow down. AI voice agents change that equation by answering immediately, collecting structured context, and moving the conversation to the next useful step without waiting for a human to be free.</p>
          <p>For many businesses, the gain is not only speed. It is consistency. The same call flow can qualify a lead, schedule an appointment, resolve a simple support request, or run the first stage of a screening interview with no queue buildup.</p>
          <blockquote>The fastest customer experience is the one that starts before a queue has time to form.</blockquote>
          <h2>Why Southeast Asia deployments are different</h2>
          <p>Voice automation in Southeast Asia needs more than generic language support. It has to handle local pronunciation, mixed-language phrasing, business etiquette, and different expectations around tone. Lumos AI is designed around Thai, Lao, Myanmar, and Malay use cases because those details change whether a call feels usable or unusable.</p>
          <p>That is especially important for outbound sales, inbound support, and interview flows where one awkward response can lower trust immediately. A multilingual phone system has to sound operationally reliable, not merely technically impressive.</p>
          <h2>Where voice agents create immediate ROI</h2>
          <ol role="list">
            <li><strong>Inbound support:</strong> answer FAQs, route cases, capture intent, and escalate only the exceptions.</li>
            <li><strong>Reception and booking:</strong> confirm availability, schedule appointments, and send updates without human admin delay.</li>
            <li><strong>Outbound sales and marketing:</strong> re-activate leads, run qualification questions, and push structured notes into the pipeline.</li>
            <li><strong>Recruitment screening:</strong> call candidates, run first-pass interviews, and score fit before recruiters step in.</li>
          </ol>
          <h2>Roll out one workflow at a time</h2>
          <p>The best deployments start with a narrow call type that already has a repeatable script. That gives the business a clean baseline for containment rate, booking rate, qualification rate, and escalation volume. Once the system is stable, companies can expand into new intents, languages, and handoff rules.</p>
          <p>Trying to automate every conversation on day one usually creates noise. Starting with one measurable workflow creates operational clarity and makes improvement much faster.</p>
          <h2>Measure what happens after the call</h2>
          <p>Call duration is not the main success metric. Businesses should measure whether the voice agent resolved the request, booked the appointment, qualified the lead, updated the right system, or handed the case to a human with useful context attached. The more downstream work the agent can complete, the more meaningful the cost reduction becomes.</p>
        </div>
      `,
    },
  "post/writing-website-copy-for-ai-apps-without-sounding-generic.html": {
    title: "Designing Business Chatbots That Actually Resolve Customer Requests",
    description:
      "A practical guide to building AI business chatbots that do more than answer questions by connecting to real systems and completing useful work.",
    bodyHtml: `
      <div class="rich-text-block w-richtext">
        <h2>Resolution matters more than novelty</h2>
        <p>Most business chatbots fail because they stop at conversation. They sound helpful, but they do not actually complete a task. Customers still need to wait for a person, repeat the issue, or move to another channel. A good chatbot reduces work for both sides by reaching a real outcome, not by producing a long answer.</p>
        <p>That means the design goal should be resolution rate, not message count. If the chatbot cannot finish the job, it should collect the right context and hand off cleanly.</p>
        <blockquote>A chatbot becomes valuable when it can move from answer generation to action execution.</blockquote>
        <h2>Connect the chatbot to the systems that matter</h2>
        <p>Business chatbots only become operationally useful when they can read and write to the tools the company already uses. For Lumos AI, that often means connecting conversations to Sheets, Docs, Drive, Notion, CRMs, booking systems, or internal databases. Once the chatbot can access business context, it can stop giving generic responses and start making progress.</p>
        <p>This is especially important on channels like LINE, WhatsApp, Telegram, and Discord, where users expect fast answers and minimal friction.</p>
        <h2>Design around bounded actions</h2>
        <ul role="list">
          <li>Book, move, or cancel an appointment.</li>
          <li>Collect support details and create a ticket.</li>
          <li>Answer status questions from connected records.</li>
          <li>Qualify a lead and trigger the next workflow.</li>
          <li>Capture a request in the right operational tool.</li>
        </ul>
        <p>These are better starting points than trying to make the chatbot answer everything for everyone. The narrower the action, the easier it is to make the system reliable.</p>
        <h2>Escalation should feel intentional</h2>
        <p>Some requests still need a human. That is fine. The important part is how the handoff happens. A well-designed chatbot should pass the full conversation summary, user intent, extracted entities, and recommended next step so the human team does not start from zero. Escalation is not a failure when it happens with context.</p>
        <h2>Track whether work disappears from the queue</h2>
        <p>The right metric is not whether customers used the bot. It is whether the business removed repetitive work from the queue while maintaining quality. If the chatbot shortens response time, reduces duplicate messages, and completes routine tasks across communication channels, it is doing its job.</p>
      </div>
    `,
  },
  "post/how-to-turn-more-demo-clicks-into-real-product-interest.html": {
    title: "How to Automate Backoffice Operations Without Replacing Your Stack",
    description:
      "Why the highest-return automation programs usually start inside existing tools like Google Sheets, Drive, Docs, and Notion instead of replacing them.",
    bodyHtml: `
      <div class="rich-text-block w-richtext">
        <h2>Start with recurring decisions, not grand transformation</h2>
        <p>Backoffice automation works best when it begins with work that already repeats every day. Status updates, document checks, spreadsheet syncs, routing tasks, and policy-driven approvals create operational drag because humans keep touching the same information in slightly different places. An operations agent can remove that drag without forcing the business to rebuild the stack.</p>
        <p>The objective is not to automate everything at once. It is to remove the most frequent low-value coordination work first.</p>
        <blockquote>The best automation projects usually begin where people are copying, checking, and updating the same data every day.</blockquote>
        <h2>Use the tools your team already depends on</h2>
        <p>Many businesses run critical operations through Google Sheets, Drive, Docs, Notion, and a handful of communication tools. Replacing those systems is slow and expensive. Lumos AI operations agents are designed to work with them directly, so the business can automate work inside the workflows the team already understands.</p>
        <p>That reduces change management risk and helps teams adopt automation faster because the surrounding process still feels familiar.</p>
        <h2>Map triggers, actions, and outputs clearly</h2>
        <ol role="list">
          <li><strong>Trigger:</strong> what event starts the workflow?</li>
          <li><strong>Decision:</strong> what rules or model judgments are needed?</li>
          <li><strong>Action:</strong> what should be updated, created, sent, or approved?</li>
          <li><strong>Output:</strong> where should the result be stored for downstream teams?</li>
        </ol>
        <p>Once these steps are defined, an operations agent can execute them repeatedly with far less delay than a manual queue.</p>
        <h2>Keep humans for edge cases, not every case</h2>
        <p>Backoffice agents should not eliminate human control. They should reduce human involvement on the work that does not need judgment every time. The cleanest model is to let the agent handle common cases automatically and route only exceptions to a person with the full context attached.</p>
        <h2>Scale by expanding workflow depth</h2>
        <p>After one workflow is stable, the next step is not always adding more workflows. Sometimes the higher return comes from letting the same workflow go deeper, such as reading a request, updating multiple systems, producing a summary document, and notifying the right stakeholder automatically. That is how automation starts to feel like an autonomous operation instead of a simple script.</p>
      </div>
    `,
  },
  "post/designing-trust-into-ai-chat-interfaces.html": {
    title: "Building Trust in Multilingual AI Phone Systems",
    description:
      "What makes businesses trust AI phone systems in Thai, Lao, Myanmar, Malay, and other multilingual support and sales workflows.",
    bodyHtml: `
      <div class="rich-text-block w-richtext">
        <h2>Trust starts before the first decision</h2>
        <p>People decide whether a phone system feels credible within seconds. They listen for pronunciation, pacing, tone, and whether the system actually understood the request. In multilingual environments, that first impression matters even more because users immediately notice when the system sounds unnatural or misses obvious context.</p>
        <p>Trust in AI phone systems is operational. If the caller feels uncertain, they ask fewer questions, provide less information, and request a human faster.</p>
        <blockquote>A phone agent earns trust by sounding oriented, not by sounding futuristic.</blockquote>
        <h2>Predictable call flows reduce friction</h2>
        <p>Good phone AI keeps the structure of the call clear. The user should always know what the system is asking, why it is asking, and what happens next. Ambiguity makes AI feel risky. Clear call flow design makes it feel dependable.</p>
        <ul role="list">
          <li>State the goal of the call early.</li>
          <li>Confirm important information before taking action.</li>
          <li>Use short prompts that are easy to answer.</li>
          <li>Repeat key details when booking, routing, or escalating.</li>
          <li>Offer a clean human handoff when confidence is low.</li>
        </ul>
        <h2>Language quality is part of product quality</h2>
        <p>Localization is not just vocabulary support. It includes politeness norms, mixed-language phrasing, common pronunciation patterns, and vertical-specific terminology. Businesses in Southeast Asia need phone systems that respect those realities because trust breaks when the system sounds detached from the local operating context.</p>
        <h2>Transparency beats overclaiming</h2>
        <p>Users do not need the AI to pretend it understands everything. They need it to be honest about what it can do. A strong system is comfortable confirming details, asking follow-up questions, and escalating when needed. That behavior feels more trustworthy than forcing the conversation forward with weak confidence.</p>
        <h2>Trust compounds when the system completes work</h2>
        <p>The most persuasive trust signal is successful follow-through. When the caller sees that the appointment was booked, the ticket was created, or the information was sent correctly, trust grows quickly. In other words, confidence comes from completed tasks, not from good branding alone.</p>
      </div>
    `,
  },
  "post/why-ai-chat-landing-pages-need-stronger-conversion-design.html": {
    title: "AI Recruitment Agents: Screening, Scoring, and Matching at Scale",
    description:
      "How recruitment teams can use autonomous agents to call candidates, run first-pass interviews, score responses, and improve hiring throughput.",
    bodyHtml: `
      <div class="rich-text-block w-richtext">
        <h2>Hiring slows down long before teams notice</h2>
        <p>Recruitment bottlenecks usually appear as small delays. Calls happen later than planned. Screening notes arrive in different formats. Good candidates wait too long for the next step. When volume grows, those delays compound into lost hiring capacity. Recruitment agents help by owning the repetitive parts of the process without removing human judgment from final decisions.</p>
        <p>The immediate benefit is speed, but the deeper benefit is process consistency across every candidate interaction.</p>
        <blockquote>The best candidates often disappear during operational lag, not because the role was wrong.</blockquote>
        <h2>What the agent should own</h2>
        <ol role="list">
          <li>Call or message candidates automatically.</li>
          <li>Run a structured first-pass screening interview.</li>
          <li>Score answers against role requirements.</li>
          <li>Match profiles to hiring criteria or open roles.</li>
          <li>Push summaries and recommendations into the hiring workflow.</li>
        </ol>
        <p>This removes repetitive coordination work from recruiters and lets them focus on deeper assessment, stakeholder alignment, and candidate experience.</p>
        <h2>Scoring should be transparent</h2>
        <p>Recruitment agents are most useful when the scoring logic is visible. Teams should know what competencies were tested, how responses were weighted, and where the model confidence was weak. That makes the system easier to review and safer to improve over time.</p>
        <h2>Human review still matters</h2>
        <p>Autonomy is most effective when it narrows the manual workload, not when it eliminates all oversight. Recruiters should still review borderline cases, refine screening criteria, and handle final interview decisions. The agent should improve throughput and consistency, while the team retains control over hiring quality.</p>
        <h2>Success looks like better pipeline movement</h2>
        <p>A strong recruitment agent shortens time-to-screen, raises candidate follow-up speed, improves note quality, and gives hiring managers cleaner decision inputs. If the process feels faster for both recruiters and candidates, the system is creating real value.</p>
      </div>
    `,
  },
  "post/how-to-structure-a-homepage-for-an-ai-app-that-sells.html": {
    title: "Autonomous Crypto Operations: Monitoring, Execution, and Risk Controls",
    description:
      "What a crypto operations agent should monitor, execute, and record to support faster trading workflows with stronger controls.",
    bodyHtml: `
      <div class="rich-text-block w-richtext">
        <h2>Crypto operations do not stop when teams go offline</h2>
        <p>Markets move continuously, but operations teams do not. That mismatch creates risk around monitoring, execution, reconciliation, and reporting. An autonomous crypto operations agent helps by tracking transaction flow, watching conditions, triggering actions, and keeping an auditable record without waiting for a manual handoff.</p>
        <p>The value is not only faster execution. It is fewer missed checks and more consistent process discipline.</p>
        <blockquote>In crypto operations, speed without controls is dangerous, and controls without automation are too slow.</blockquote>
        <h2>Define the agent's scope clearly</h2>
        <p>A crypto operations agent should have an explicit job description. That may include monitoring trades, reconciling wallet activity, checking thresholds, preparing orders, executing approved actions, or generating summaries for human review. The clearer the boundaries, the safer the system becomes.</p>
        <h2>Controls come before autonomy depth</h2>
        <ul role="list">
          <li>Set approval rules for sensitive actions.</li>
          <li>Track every decision input and system output.</li>
          <li>Separate monitoring from execution when needed.</li>
          <li>Define thresholds for escalation and manual review.</li>
          <li>Log exceptions in a format the team can audit quickly.</li>
        </ul>
        <p>These controls let the business increase autonomy gradually instead of relying on blind execution.</p>
        <h2>Execution is only one layer</h2>
        <p>Many teams focus on order execution first, but a real operations agent also handles context: trade status, transaction traceability, anomaly detection, downstream updates, and the operational notes people need later. That broader view is what turns automation into a dependable operating layer.</p>
        <h2>Auditability is part of the product</h2>
        <p>If the team cannot explain what the agent saw, why it acted, and where the output was written, the system will not scale safely. Good autonomous operations are measurable, reviewable, and easy to trace. That is what allows speed and control to coexist.</p>
      </div>
    `,
  },
};

const LEGAL_PAGE_OVERRIDES: Record<string, RichTextPageOverride> = {
  "utility-pages/privacy-policy.html": {
    title: "Privacy Policy | Lumos AI",
    description:
      "How Lumos AI handles information submitted through its website, demos, and business conversations.",
    bodyHtml: `
      <div class="rich-text-legal w-richtext">
        <h2>Privacy Policy</h2>
        <p><strong>Last updated:</strong> April 9, 2026</p>
        <p>This Privacy Policy explains how Lumos AI collects, uses, stores, and protects information submitted through our website, contact forms, demo requests, and related product interactions.</p>
        <h3>1. Information We Collect</h3>
        <p>We may collect contact details such as name, company, work email, phone number, country, and any business information you choose to submit when requesting a demo, contacting us, or discussing a deployment.</p>
        <p>We may also collect technical data such as device information, browser type, pages visited, referral source, and basic usage analytics needed to operate and improve the website.</p>
        <h3>2. How We Use Information</h3>
        <ul role="list">
          <li>Respond to inquiries and schedule demos or discovery calls.</li>
          <li>Evaluate product fit, language needs, and integration requirements.</li>
          <li>Operate, secure, and improve the website and related services.</li>
          <li>Send relevant product, operational, or commercial follow-up communication.</li>
          <li>Comply with legal obligations and protect our systems, customers, and business.</li>
        </ul>
        <h3>3. Data Sharing</h3>
        <p>We may share information with service providers that support hosting, analytics, communication, scheduling, CRM, or service delivery. We may also disclose information where required by law, to enforce agreements, or to protect rights, safety, and security.</p>
        <p>We do not sell personal information submitted through this website.</p>
        <h3>4. Retention</h3>
        <p>We retain information for as long as needed to respond to inquiries, manage customer relationships, deliver services, meet legal obligations, resolve disputes, and maintain business records.</p>
        <h3>5. Security</h3>
        <p>We use reasonable technical and organizational measures to protect information against unauthorized access, misuse, loss, or disclosure. No method of storage or transmission is completely secure, so we cannot guarantee absolute security.</p>
        <h3>6. Your Choices</h3>
        <p>You may request access, correction, or deletion of personal information we hold about you, subject to legal or operational requirements. You may also opt out of non-essential communications at any time.</p>
        <h3>7. International Operations</h3>
        <p>Lumos AI works with businesses across regions, including Southeast Asia. Information may be processed in jurisdictions where we or our service providers operate.</p>
        <h3>8. Changes to This Policy</h3>
        <p>We may update this Privacy Policy from time to time. Material updates will be reflected on this page with a revised effective date.</p>
        <h3>9. Contact</h3>
        <p>If you have privacy questions or data requests, please contact us through the <a href="/contact">contact page</a> on this website.</p>
      </div>
    `,
  },
  "utility-pages/terms-of-service.html": {
    title: "Terms of Service | Lumos AI",
    description:
      "Terms governing use of the Lumos AI website, demos, and related services.",
    bodyHtml: `
      <div class="rich-text-legal w-richtext">
        <h2>Terms of Service</h2>
        <p><strong>Last updated:</strong> April 9, 2026</p>
        <p>These Terms of Service govern your access to and use of the Lumos AI website, demo experiences, and related communications. If you enter into a separate commercial agreement with Lumos AI, that agreement will control where it conflicts with these website terms.</p>
        <h3>1. Use of the Website</h3>
        <p>You may use this website to learn about Lumos AI, request information, schedule demos, and communicate with us about potential or active deployments. You agree not to misuse the site, interfere with its operation, or attempt unauthorized access to our systems.</p>
        <h3>2. Submitted Information</h3>
        <p>You are responsible for the accuracy of information you submit through forms, emails, scheduling flows, or other communications. You should not submit sensitive information unless it is necessary and appropriate for the engagement.</p>
        <h3>3. Acceptable Use</h3>
        <ul role="list">
          <li>No unlawful, fraudulent, abusive, or deceptive use.</li>
          <li>No attempts to probe, disrupt, or bypass security controls.</li>
          <li>No scraping, reverse engineering, or unauthorized automated access except where permitted by law and by written agreement.</li>
          <li>No use of our website or service materials to build competing deceptive offers or impersonate Lumos AI.</li>
        </ul>
        <h3>4. Intellectual Property</h3>
        <p>The Lumos AI website, branding, copy, designs, software, and related materials are owned by Lumos AI or its licensors. Except as permitted by law, you may not reproduce, distribute, modify, or commercially use them without prior written permission.</p>
        <h3>5. Third-Party Services</h3>
        <p>This website may link to third-party services, communication channels, or software platforms. Lumos AI is not responsible for third-party content, availability, or policies.</p>
        <h3>6. No Warranty</h3>
        <p>The website and related content are provided on an “as is” and “as available” basis. We do not guarantee uninterrupted availability, completeness, or fitness for a particular purpose.</p>
        <h3>7. Limitation of Liability</h3>
        <p>To the maximum extent permitted by law, Lumos AI will not be liable for indirect, incidental, special, consequential, or punitive damages arising out of website use, including loss of revenue, data, goodwill, or business opportunity.</p>
        <h3>8. Changes</h3>
        <p>We may update these Terms from time to time. Continued use of the website after changes take effect means you accept the updated Terms.</p>
        <h3>9. Governing Framework</h3>
        <p>Any separate commercial agreement will govern deployed services. For website-only use, the applicable legal framework will be determined by the contracting Lumos AI entity and applicable law.</p>
        <h3>10. Contact</h3>
        <p>Questions about these Terms can be submitted through the <a href="/contact">contact page</a>.</p>
      </div>
    `,
  },
  "utility-pages/cookie-policy.html": {
    title: "Cookie Policy | Lumos AI",
    description:
      "How Lumos AI uses cookies and similar technologies on its website.",
    bodyHtml: `
      <div class="rich-text-legal w-richtext">
        <h2>Cookie Policy</h2>
        <p><strong>Last updated:</strong> April 9, 2026</p>
        <p>This Cookie Policy explains how Lumos AI uses cookies and similar technologies on this website to keep the experience functional, measure performance, and improve how visitors discover our products and content.</p>
        <h3>1. What Cookies Are</h3>
        <p>Cookies are small data files stored on your device when you visit a website. They help websites remember preferences, maintain sessions, understand usage patterns, and improve reliability.</p>
        <h3>2. How We Use Cookies</h3>
        <ul role="list">
          <li>Support core website functionality and security.</li>
          <li>Understand traffic sources and page performance.</li>
          <li>Improve navigation, content relevance, and conversion flows.</li>
          <li>Remember preferences where applicable.</li>
        </ul>
        <h3>3. Types of Cookies We May Use</h3>
        <p><strong>Essential cookies</strong><br/>Needed for security, page delivery, and core site operation.</p>
        <p><strong>Analytics cookies</strong><br/>Used to understand how visitors interact with the website so we can improve content and user experience.</p>
        <p><strong>Functional cookies</strong><br/>Used to remember certain settings or preferences where applicable.</p>
        <h3>4. Third-Party Technologies</h3>
        <p>Some cookies or similar technologies may be set by third-party tools that support analytics, embedded content, scheduling, or communications. Those providers manage their own data practices under their own policies.</p>
        <h3>5. Managing Cookies</h3>
        <p>You can control or delete cookies through your browser settings. Disabling some cookies may affect website functionality or site performance.</p>
        <h3>6. Updates</h3>
        <p>We may update this Cookie Policy from time to time. The latest version will always be posted on this page.</p>
        <h3>7. Contact</h3>
        <p>If you have questions about our use of cookies, please reach out through the <a href="/contact">contact page</a>.</p>
      </div>
    `,
  },
};

const ARTICLE_REFERENCE_REPLACEMENTS: readonly StringReplacement[] = [
  [
    "How to Make an AI Product Website Feel Premium Without slowing it.",
    "How AI Voice Agents Reduce Response Time for SEA Businesses",
  ],
  [
    "A premium website should feel refined and fast. Here is how to create a modern AI product site that looks expensive without losing clarity or speed.",
    "Why multilingual AI voice systems are becoming the fastest way for Southeast Asia teams to improve support, sales, and recruiting response times.",
  ],
  [
    "Writing Website Copy for AI Apps Without Sounding Generic",
    "Designing Business Chatbots That Actually Resolve Customer Requests",
  ],
  [
    "A guide to writing clearer website copy for AI apps that avoids clichés, explains the product fast, and supports a premium brand.",
    "A practical guide to building AI business chatbots that do more than answer questions by connecting to real systems and completing useful work.",
  ],
  [
    "How to Turn More Demo Clicks Into Real Product Interest",
    "How to Automate Backoffice Operations Without Replacing Your Stack",
  ],
  [
    "Getting clicks is not enough. Learn how AI product websites can guide visitors from curiosity to serious buying intent with better CTA design.",
    "Why the highest-return automation programs usually start inside existing tools like Google Sheets, Drive, Docs, and Notion instead of replacing them.",
  ],
  [
    "Designing Trust Into AI Chat Interfaces",
    "Building Trust in Multilingual AI Phone Systems",
  ],
  [
    "Trust is a key conversion factor for AI products. Here is how interface design, messaging, and proof can make an AI chat experience feel credible.",
    "What makes businesses trust AI phone systems in Thai, Lao, Myanmar, Malay, and other multilingual support and sales workflows.",
  ],
  [
    "Why AI Chat Landing Pages Need Stronger Conversion Design",
    "AI Recruitment Agents: Screening, Scoring, and Matching at Scale",
  ],
  [
    "A practical guide to designing AI chat landing pages that look premium, explain the product fast, and convert more visitors into signups or demos.",
    "How recruitment teams can use autonomous agents to call candidates, run first-pass interviews, score responses, and improve hiring throughput.",
  ],
  [
    "How to Structure a Homepage for an AI App That Sells",
    "Autonomous Crypto Operations: Monitoring, Execution, and Risk Controls",
  ],
  [
    "Learn a simple homepage structure for AI apps that explains the product clearly, builds trust, and drives more demos, trials, and conversions.",
    "What a crypto operations agent should monitor, execute, and record to support faster trading workflows with stronger controls.",
  ],
];

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

function appendClassName(classValue: string, className: string) {
  const classNames = classValue.split(/\s+/).filter(Boolean);

  if (!classNames.includes(className)) {
    classNames.push(className);
  }

  return classNames.join(" ");
}

function sanitizeMetadataTitle(title: string) {
  const trimmedTitle = title.trim();

  if (trimmedTitle.endsWith(" - Webflow HTML website template")) {
    return SITE_TITLE;
  }

  for (const suffix of TITLE_SUFFIXES) {
    if (trimmedTitle.endsWith(suffix)) {
      return trimmedTitle.slice(0, -suffix.length).trim();
    }
  }

  return trimmedTitle;
}

function sanitizeMetadataDescription(description?: string) {
  const trimmedDescription = description?.trim();

  if (!trimmedDescription || /webflow template/i.test(trimmedDescription)) {
    return SITE_DESCRIPTION;
  }

  return trimmedDescription;
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

function applyStringReplacements(
  source: string,
  replacements: readonly StringReplacement[],
) {
  return replacements.reduce(
    (output, [search, replace]) => output.replaceAll(search, replace),
    source,
  );
}

function getRouteKeyFromFilePath(filePath: string) {
  return path.relative(SOURCE_DIR, filePath).split(path.sep).join("/");
}

function getRouteKeyFromSegments(segments: string[]) {
  return segments.length === 0 ? "index.html" : `${segments.join("/")}.html`;
}

function isPublishedRouteKey(routeKey: string) {
  return !routeKey.startsWith("template/") && !routeKey.startsWith("email@");
}

function getTagContent(source: string, tagName: string) {
  const match = source.match(
    new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, "i"),
  );

  return match ? match[1].trim() : "";
}

function buildHomeIntroSection() {
  return `<section class="lumos-intro" id="home"><div class="container"><div class="lumos-intro__inner"><div class="lumos-intro__content"><h1 class="lumos-intro__title">Specialized Autonomous Systems</h1><p class="lumos-intro__copy">Scale faster with voice AI, autonomous operations, and business automation.</p><a class="button w-inline-block lumos-intro__button lumos-interactive-hover-button" href="/contact"><div class="button-text-holder lumos-interactive-hover-button__text" data-lumos-button-label="Book demo"><div class="button-text">Book demo</div><span class="lumos-interactive-hover-button__arrow" aria-hidden="true">&#8594;</span></div></a></div></div></div></section>`;
}

function buildStickyUseCaseSection() {
  const items = [
    {
      icon:
        "https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b543480ae39a2bdc7144_icons%20(4).png",
      title: "24/7 inbound support that answers customer questions",
    },
    {
      icon:
        "https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b54330b8559d7a25507e_icons%20(6).png",
      title: "Outbound sales calls that follow up, promote, and remind",
    },
    {
      icon:
        "https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b5435451b1c69143e15b_icons%20(3).png",
      title: "Screening interviews that ask the right questions",
    },
    {
      icon:
        "https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b543643aaa5f1c862b96_icons%20(2).png",
      title: "Booking and scheduling that works anytime, anywhere",
    },
  ] as const;

  const cards = items
    .map(
      ({ icon, title }, index) => `
        <div class="sticky-content-container lumos-sticky-use-case"${index === 0 ? ' data-w-id="c6555da1-e6f4-eec1-77e9-5d37a330e369"' : ""}>
          <img alt="" class="small-icon" loading="lazy" src="${icon}"/>
          <div class="sticky-title">${title}</div>
        </div>
      `,
    )
    .join("");

  return `<div class="sticky-phone-wrapper"><div class="sticky-phone-holder"><div class="sticky-content-holder lumos-sticky-use-cases" id="w-node-c6555da1-e6f4-eec1-77e9-5d37a330e368-ddca84cf">${cards}</div><div class="sticky-phone-container" id="w-node-c6555da1-e6f4-eec1-77e9-5d37a330e381-ddca84cf"><div class="sticky-phone"><div class="hero-section-phone-holder-sticky"><img alt="" class="hero-section-phone-image-2" loading="lazy" src="https://cdn.prod.website-files.com/6572299361633b4a12812f89/657233058b161c0432c4d99e_Apple%20Iphone%2014%20pro.png"/><div class="hero-section-phone-screenshot-holder-2"><img alt="Lumos voice chat interface showing a meeting scheduling request." class="hero-section-phone-screenshot-image-2" loading="lazy" sizes="(max-width: 1536px) 100vw, 1536px" src="/VoiceChat_lumos_v9.png" srcset="/VoiceChat_lumos_v9.png 1536w"/></div></div></div><div class="blur-bg"></div></div></div></div></div>`;
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
            <div class="chat-wrapper"><div class="gradient-bg"><div class="chat"><div>What if a business could answer, call, and update systems without adding headcount?</div><img alt="" class="chat-blur" loading="lazy" sizes="(max-width: 1568px) 100vw, 1568px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-500.png 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-800.png 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-1080.png 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif 1568w"/></div></div></div>
          </div>
          <div class="chat-image-holder _02"><div class="chat-wrapper"><div class="chat"><div>Then voice agents could handle support, receptionist, sales, and screening interviews.</div></div></div><img alt="Team Member" class="chat-image" loading="lazy" sizes="(max-width: 1110px) 100vw, 1110px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp 1110w"/></div>
          <div class="chat-image-holder _01"><img alt="Team Member" class="chat-image" loading="lazy" sizes="(max-width: 1110px) 100vw, 1110px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%20Member%2005.webp" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%20Member%2005.webp 1110w"/><div class="chat-wrapper"><div class="gradient-bg"><div class="chat"><div>And operations agents could sync Sheets, Drive, Docs, and Notion in the background.</div><img alt="" class="chat-blur" loading="lazy" sizes="(max-width: 1568px) 100vw, 1568px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-500.png 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-800.png 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-1080.png 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif 1568w"/></div></div></div></div>
          <div class="chat-image-holder _02"><div class="chat-wrapper"><div class="chat"><div>We should also deploy chatbots across LINE, WhatsApp, Telegram, and Discord.</div></div></div><img alt="Team Member" class="chat-image" loading="lazy" sizes="(max-width: 1110px) 100vw, 1110px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp 1110w"/></div>
          <div class="chat-image-holder _01"><img alt="Team Member" class="chat-image" loading="lazy" sizes="(max-width: 1110px) 100vw, 1110px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%20Member%2005.webp" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%2520Member%252005-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca87f3_Team%20Member%2005.webp 1110w"/><div class="light-blur"></div><div class="chat-wrapper"><div class="gradient-bg"><div class="chat"><div>Make it multilingual for Thai, Lao, Myanmar, and Malay so it fits Southeast Asia operations.</div><img alt="" class="chat-blur" loading="lazy" sizes="(max-width: 1568px) 100vw, 1568px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-500.png 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-800.png 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur-p-1080.png 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca881e_Blur.avif 1568w"/></div></div></div></div>
          <div class="chat-image-holder _02"><div class="chat-wrapper"><div class="chat"><div>That is Lumos AI: autonomous systems built to scale fast at lower cost.</div></div></div><img alt="Team Member" class="chat-image" loading="lazy" sizes="(max-width: 1110px) 100vw, 1110px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%2520Member%252006-p-1080.jpg 1080w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2ae749ddb18cdddca889f_Team%20Member%2006.webp 1110w"/></div>
        </div>
      </div>
    </div>
  `;
}

function buildPrimaryNavigation(routeKey: string) {
  const items = [
    {
      href: "/features",
      label: "Services",
      isActive: routeKey === "features.html",
    },
    {
      href: "/about",
      label: "Use cases",
      isActive: routeKey === "about.html",
    },
    {
      href: "/blog",
      label: "FAQ",
      isActive: routeKey === "blog.html",
    },
    {
      href: "/contact",
      label: "Contact",
      isActive: routeKey === "contact.html",
    },
  ];

  return `<div class="nav-links">${items
    .map(({ href, isActive, label }) => {
      const ariaCurrent = isActive ? ' aria-current="page"' : "";
      const currentClass = isActive ? " w--current" : "";

      return `<div class="nav-link-wrapper"><a${ariaCurrent} class="nav-link w-nav-link${currentClass}" href="${href}">${label}</a><div class="nav-line"></div></div>`;
    })
    .join("")}</div>`;
}

function rewritePrimaryNavigation(source: string, routeKey: string) {
  return source.replace(
    /<div class="nav-links">[\s\S]*?<\/div><a class="button w-inline-block"/,
    `${buildPrimaryNavigation(routeKey)}<a class="button w-inline-block"`,
  );
}

function getSharedBodyReplacements(): readonly StringReplacement[] {
  return [
    ["Buy Template", "Book Demo"],
    ["Blogs", "Insights"],
    [">Blog<", ">Insights<"],
    ["Ready to Chat with Chat", "Ready to Deploy Lumos AI"],
    [
      "Experience the future of  AI conversation with Lumos",
      "Deploy autonomous systems built for your business",
    ],
    ["Upgrade Your AI Experience", "Plan your Lumos AI rollout"],
    [
      "Unlock more from every conversation with Lumos",
      "Start with one workflow or launch an end-to-end autonomous stack",
    ],
    ["Join our newsletter", "Plan your Lumos AI rollout"],
    ["Sign-up for news letter", "Get Lumos AI updates"],
    ["Enter email here", "Work email"],
    [
      "Powerful, self-serve product and growth analytics to help you convert, engage.",
      "Insights on AI voice systems, operations automation, and business chatbots for real operating teams.",
    ],
    ['href="/about">Features', 'href="/features">Features'],
    ["Webflow stuff", "Solutions"],
    ['href="/template/style-guide">Style Guide', 'href="/features">AI Voice Systems'],
    [
      'href="/template/licensing">Licensing',
      'href="/features">AI Operation Systems',
    ],
    [
      'href="/template/instructions">Instructions',
      'href="/features">AI Business Chatbot',
    ],
    ['href="/template/change-log">Change Log', 'href="/about">Use Cases'],
    [
      'href="https://webflow.com/templates/designers/over-sight" target="_blank">GET TEMPLATE',
      'href="/contact">Book a Demo',
    ],
    [
      'Created by <a class="dark-link" href="/" target="_blank">Lumos</a>',
      "Copyright 2026 Lumos System Co., Ltd.",
    ],
    [
      'Powered by <a class="dark-link" href="https://webflow.com/" target="_blank">WEBFLOW</a>',
      "",
    ],
    ["Social media", "Explore"],
    ['href="https://ig.com" target="_blank"', 'href="/contact"'],
    ['href="https://instagram.com" target="_blank"', 'href="/contact"'],
    ['href="https://fb.com" target="_blank"', 'href="/about"'],
    ['href="https://linkedin.com" target="_blank"', 'href="/blog"'],
    ['href="https://twitter.com" target="_blank"', 'href="/contact"'],
    ['href="mailto:hello@lumos.com"', 'href="/contact"'],
    ['href="/contact">Instagram', 'href="/contact">Book a Demo'],
    ['href="/about">Facebook', 'href="/about">Use Cases'],
    ['href="/blog">Linkedin', 'href="/blog">Insights'],
    ['href="/contact">Twitter', 'href="/contact">Contact'],
    ...ARTICLE_REFERENCE_REPLACEMENTS,
  ];
}

function getRouteBodyReplacements(routeKey: string): readonly StringReplacement[] {
  switch (routeKey) {
    case "index.html":
      return [
        [
          "The Mobile AI Experience, Refined",
          "Autonomous AI Systems for Fast, Low-Cost Scale",
        ],
        [
          "Users write, brainstorm, generate images, and speak with AI through a beautifully designed interface that feels both futuristic and familiar.",
          "Lumos AI helps businesses deploy voice agents, backoffice automation, and business chatbots without adding headcount.",
        ],
        ["Chat Smarter, Together", "Three Systems. One Autonomous Stack."],
        ["Super Chatting", "AI Voice Systems"],
        [
          "Get instant answers, explore ideas, and keep every conversation flowing.",
          "Run inbound and outbound voice agents for support, receptionist, sales, marketing, and interviews.",
        ],
        ["Connect AI to your chats.", "AI Business Chatbots"],
        [
          "Bring smarter replies into every conversation and make chatting more helpful, interactive, and engaging.",
          "Connect Lumos AI to LINE, WhatsApp, Telegram, Discord, and other customer channels.",
        ],
        ["Voice Chat", "AI Operation Systems"],
        [
          "Speak and get the response in real time",
          "Automate repetitive backoffice work across Google Sheets, Drive, Docs, Notion, and other common tools.",
        ],
        [
          "Unlock fluid voice conversations wherever",
          "AI interviewer that screens candidates before your team spends time",
        ],
        [
          "Chat ideas and questions in one seamless flow.",
          "AI phone agents that answer inbound calls and run outbound campaigns",
        ],
        [
          "Generate visuals and concepts instantly",
          "Backoffice agents that update Sheets, Drive, Docs, and Notion automatically",
        ],
        [
          "Collaborate with ride-sharing services like Google Or Apple",
          "Appointment agents that book and reschedule without human admin bottlenecks",
        ],
        [
          "Allow users to share their experiences on social media platforms",
          "Crypto operation agents that track trades, execute actions, and log decisions",
        ],
        [
          "The Whole AI thing is Super Awesome",
          "Built for Real Business Operations",
        ],
        [
          "Engage in natural, real-time voice conversations with AI that feels just like talking to a friend. Get answers, insights, or support-all.",
          "Lumos AI combines multilingual voice, operations automation, and business chatbots into autonomous systems that reduce cost and accelerate execution.",
        ],
        [
          'Faster. Easier. Better.</div><p class="grey-text-2">Experience AI interactions that feel quicker, smoother, and more intuitive — built to help users get answers, ideas, and support without friction.',
          'HR / Recruitment Agent</div><p class="grey-text-2">Call candidates, run screening interviews, score responses, and match talent to hiring criteria automatically.',
        ],
        [
          'Chatting with anyone</div><p class="grey-text-2">Bring AI into every conversation with real-time assistance that helps users reply faster, think clearer, and stay connected more effortlessly.',
          'AI Appointment Agent</div><p class="grey-text-2">Handle booking, reminders, rescheduling, and confirmations so customers never wait for a human reply.',
        ],
        [
          'Any Mobile, Any Time</div><p class="grey-text-2">Experience AI interactions that feel quicker, smoother, and more intuitive — built to help users get answers, ideas, and support without friction.',
          'Crypto Operation Agent</div><p class="grey-text-2">Monitor trades and transactions, execute approved orders, and keep an auditable record of operational decisions.',
        ],
        [
          "Elevate Your Experience with Lumos Premium",
          "Deploy Only What You Need",
        ],
        [
          "Unlock a world of exclusive benefits and unparalleled convenience with Lumos Premium. Our premium features are meticulously crafted to enhance every aspect of your journey.",
          "Start with one workflow or combine voice, operations, and chat into a single autonomous system built around your business.",
        ],
        ["Priority access", "Multilingual by design"],
        [
          "Enjoy smoother interactions, and a more reliable experience",
          "Specialized for Thai, Lao, Myanmar, Malay, and cross-border customer conversations.",
        ],
        ["Advanced tools", "Connected to your stack"],
        [
          "Access enhanced features for voice and image generation",
          "Integrates with common business apps and communication channels so the agent can actually complete work.",
        ],
        [
          "Whether you’re new or exploring deeper support, we know you may have questions.",
          "Answers to the questions teams ask when they are planning their first Lumos AI deployment.",
        ],
        ["What is our AI Chat App?", "What does Lumos AI actually automate?"],
        [
          "Discover a sophisticated chat solution powered by cutting-edge AI technology, designed to enhance your communication and boost productivity. Explore how our app transforms the way teams collaborate and interact.",
          "Lumos AI automates voice calls, business chat conversations, and backoffice tasks. It is designed to answer, execute, and move work forward across real operational systems.",
        ],
        ["How does the AI feature work?", "Which languages does Lumos AI support?"],
        [
          "Our intelligent algorithms analyze conversations in real-time, providing contextual suggestions that enable seamless communication. Experience a chat assistant that evolves with your needs.",
          "We specialize in Southeast Asia language workflows including Thai, Lao, Myanmar, and Malay, with deployment designed around local business operations and customer conversations.",
        ],
        ["Is my data secure?", "Can Lumos AI connect to our existing tools?"],
        [
          "Data security is our priority. We use advanced encryption methods and comply with industry standards to ensure your conversations remain private and safe, giving you peace of mind.",
          "Yes. Lumos AI can connect with tools such as Google Sheets, Drive, Docs, Notion, and communication channels like LINE, WhatsApp, Telegram, and Discord.",
        ],
        ["Can I customize the app?", "Can we start with one use case first?"],
        [
          "Absolutely! Our AI Chat App offers various customization options, allowing you to personalize themes, notifications, and even the AI's responses to align with your brand's voice.",
          "Yes. Most teams start with one high-volume workflow such as customer support, candidate screening, appointment booking, or backoffice processing before expanding.",
        ],
        ["Still have questions?", "Need a deployment plan?"],
        ["Can’t find the answer you’re looking for?", "Share your use case and we will scope the right first agent."],
      ];
    case "features.html":
      return [
        [
          "Built for the Way You Use AI",
          "Autonomous systems built around your workflows",
        ],
        [
          "From chatting and creating to speaking, Lumos brings together the essential tools for a more immersive AI experience.",
          "Lumos AI deploys voice agents, backoffice automation, and business chatbots that work across Southeast Asia languages and everyday business tools.",
        ],
        ['href="https://Youtube.com" target="_blank"', 'href="/contact"'],
        ["Watch Demo", "Book Demo"],
        ["Discover the exceptional features", "Core product lines"],
        ["Powerful Solutions, Seamless Experiences", "Systems that answer, execute, and coordinate"],
        ["Get Started", "Talk to Lumos"],
        ["Real-Time Tracking", "AI Voice Systems"],
        [
          "Keep tabs on your ride with live GPS tracking. Know exactly where your driver is, estimated time of arrival.",
          "Inbound and outbound voice agents for support, receptionist, sales, marketing, and interview workflows.",
        ],
        ["Secure In-App Payments", "AI Interviewer"],
        [
          "Enjoy hassle-free transactions with seamless in-app payments. Your payment information is encrypted, ensuring a secure.",
          "Call candidates, run structured screening interviews, score answers, and pass ranked shortlists to recruiters.",
        ],
        ["Driver Ratings and Feedback", "Phone AI for customer operations"],
        [
          "Rate your drivers and provide feedback after each ride. Foster a community of trust and accountability while helping.",
          "Handle FAQs, route requests, qualify leads, and keep every call documented for the next action.",
        ],
        ["Effortless Booking and Scheduling", "AI Appointment Agent"],
        [
          "Book a ride in seconds and schedule trips in advance. Enjoy the convenience of planning your transportation ahead of time.",
          "Book, reschedule, and confirm appointments with merchants without making customers wait for human admin.",
        ],
        ["Punctuality Assistant", "AI Business Chatbots"],
        [
          "Experience on-time arrivals with intelligent route optimization. Lumos ensures that your trips are efficiently planned.",
          "Respond across LINE, WhatsApp, Telegram, Discord, and other channels with connected business context.",
        ],
        [
          "Access a suite of safety features, including an SOS button for emergencies, real-time sharing of trip details with trusted contacts.",
          "Automate recurring backoffice steps across Google Sheets, Drive, Docs, Notion, and the tools your team already uses.",
        ],
        [
          "Seamless Group Chats with AI Support and so , so much more...",
          "Use cases that operate end-to-end",
        ],
        [
          "Add friends, collaborate, and let AI help streamline discussions. Resolve conflicts and share ideas.",
          "Lumos AI is designed for workflows where speed, consistency, and multilingual execution matter.",
        ],
        [">App<", ">Recruitment<"],
        ["Smart Chats, <br/>Smarter Solutions", "HR / Recruitment Agent"],
        [
          "Streamline conversations with an AI chat experience designed to help users ask questions, get support, and move through everyday tasks with greater speed and clarity.",
          "Autonomously call candidates, run screening interviews, score responses, and match talent to company requirements.",
        ],
        [">Chats<", ">Voice<"],
        [
          "Talk It Out with AI-Powered Voice Chats, easy.",
          "Inbound and outbound phone AI",
        ],
        [
          "Make conversations feel more natural with voice chat that lets users speak freely, get instant responses, and interact with AI in a faster, more intuitive way.",
          "Run customer support, receptionist flows, sales outreach, and marketing calls in local languages without staffing every hour manually.",
        ],
        [">Cards<", ">Operations<"],
        [
          "Personalize Your Chats with Custom Cards",
          "Backoffice automation with real system actions",
        ],
        [
          "Create a more tailored chat experience with custom cards that help organize interactions, highlight important details",
          "Move information across spreadsheets, documents, knowledge bases, and internal systems without waiting for manual updates.",
        ],
        [
          "All Your Conversations, <br/>Organized Effortlessly",
          "Designed to connect with the way businesses already operate",
        ],
        [
          "Navigate with ease using our intuitive tabs feature. Switch between AI chats, group discussions, and personal messages seamlessly.",
          "Keep one agent layer across voice, chat, documents, and operational systems instead of stitching together disconnected tools.",
        ],
        [
          'Real-time Collaboration</div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ultricies egestas ante pellentesqu.',
          'Voice + Chat orchestration</div><p>Move a customer from chatbot to voice call with shared context and no repetition.',
        ],
        [
          'Ask AI</div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ultricies egestas ante pellentesqu.',
          'Backoffice execution</div><p>Trigger real work across spreadsheets, docs, and knowledge tools instead of producing answer-only responses.',
        ],
        [
          'Customizable Reporting</div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ultricies egestas ante pellentesqu.',
          'Human-in-the-loop control</div><p>Escalate only the cases that truly need review while the agent completes the common path automatically.',
        ],
        ["Book Demo", "Book Demo"],
      ];
    case "about.html":
      return [
        [
          "We take pride in our dedicated team",
          "Built to turn AI into operational leverage",
        ],
        [
          "The driving force behind our commitment to excellence. Meet the individuals who bring passion, expertise, and innovation to every aspect of your journey.",
          "Lumos AI helps businesses scale at the lowest possible cost and fastest possible pace by deploying autonomous systems around revenue, service, and operations.",
        ],
        ["Meet the team", "Explore use cases"],
        ['href="#"><div class="button-text-holder"><div class="button-text">Read More</div></div></a>', 'href="/contact"><div class="button-text-holder"><div class="button-text">Contact us</div></div></a>'],
        ["Our Journey.<br/>From Idea to Innovation", "Why Lumos AI exists"],
        [
          "It all started with a vision to make communication smarter and more seamless. Through countless hours of brainstorming, development, and collaboration.",
          "Most businesses do not need another dashboard. They need autonomous systems that can answer, execute, and move work forward across channels and tools.",
        ],
        [
          "<div>Hey team, what if we made a super cool app that changes the way people chat?</div>",
          "<div>What if a business could answer, call, and update systems without adding headcount?</div>",
        ],
        [
          "<div>You mean, like mixing AI with group chats? Sounds awesome!</div>",
          "<div>Then voice agents could handle support, receptionist, sales, and screening interviews.</div>",
        ],
        [
          "<div>Exactly! Imagine resolving conflicts or getting instant answers right in your chat.</div>",
          "<div>And operations agents could sync Sheets, Drive, Docs, and Notion in the background.</div>",
        ],
        [
          "<div>Plus, we could add voice chatting with AI for hands-free convos. Super futuristic!</div>",
          "<div>We should also deploy chatbots across LINE, WhatsApp, Telegram, and Discord.</div>",
        ],
        [
          "<div>And what if people could personalize chats with cool features, like adding cards?</div>",
          "<div>Make it multilingual for Thai, Lao, Myanmar, and Malay so it fits Southeast Asia operations.</div>",
        ],
        [
          "<div>Let’s do it. This is going to be the smartest app anyone’s ever used!</div>",
          "<div>That is Lumos AI: autonomous systems built to scale fast at lower cost.</div>",
        ],
        ["100+", "SEA+"],
        [
          "Universe brings together👋 the world’s developers",
          "Localized for Thai, Lao, Myanmar, and Malay business conversations",
        ],
        ["Join Our Journey, Explore Opportunities", "Use cases we help automate"],
        [
          "Career paths, become a part of the Lumos.",
          "Operational agents designed for recurring high-volume work.",
        ],
        ["Become Part Of Team", "Plan a use case"],
        ['href="http://linkedin.com/" target="_blank"', 'href="/contact"'],
        [
          'Alexander Mitchell</div></div><div class="name-and-description"><div class="job-position">CEO - Oversight',
          'HR / Recruitment Agent</div></div><div class="name-and-description"><div class="job-position">Calls candidates, runs screening interviews, scores, and matches talent.',
        ],
        [
          'Olivia Bennett</div></div><div class="name-and-description"><div class="job-position">CEO - Oversight',
          'Customer Support Phone AI</div></div><div class="name-and-description"><div class="job-position">Answers inbound calls, routes requests, and resolves repetitive support questions.',
        ],
        [
          'Elijah Turner</div></div><div class="name-and-description"><div class="job-position">CEO - Oversight',
          'Sales and Marketing Caller</div></div><div class="name-and-description"><div class="job-position">Runs outbound qualification, follow-up campaigns, and lead reactivation workflows.',
        ],
        [
          'Sophia Williams</div></div><div class="name-and-description"><div class="job-position">CEO - Oversight',
          'AI Appointment Agent</div></div><div class="name-and-description"><div class="job-position">Books, confirms, and reschedules appointments for merchants and service teams.',
        ],
        [
          'Liam Anderson</div></div><div class="name-and-description"><div class="job-position">CEO - Oversight',
          'Crypto Operation Agent</div></div><div class="name-and-description"><div class="job-position">Tracks trades, executes approved orders, and keeps an auditable operating trail.',
        ],
        [
          'Isabella Parker</div></div><div class="name-and-description"><div class="job-position">Dog :)',
          'Business Chatbot</div></div><div class="name-and-description"><div class="job-position">Supports LINE, WhatsApp, Telegram, and Discord with connected business context.',
        ],
      ];
    case "pricing.html":
      return [
        ["Flexible Pricing for Every Need", "Deployment models built around your scope"],
        [
          "Discover the brilliant team driving our AI chat app. We are committed to transforming your engagement with state-of-the-art technology that elevates every interaction.",
          "Lumos AI engagements depend on call volume, workflow complexity, language coverage, integrations, and autonomy level. Start with a pilot or roll out a full stack.",
        ],
        ["Basic Plan", "Discovery Sprint"],
        ["Discover Plan", "Map the highest-ROI workflow"],
        [">$0<", ">Custom<"],
        ["Starter", "AI Voice System"],
        ["Perfect for entrepreneurs", "Inbound, outbound, or interviewer flows"],
        [">$10<", ">Custom<"],
        ["Premium", "AI Operation System"],
        ["Teams enhancing ", "Backoffice automation across business tools"],
        [">$20<", ">Custom<"],
        ["Pro", "Enterprise Autonomous Stack"],
        ["Dynamic group chats.", "Voice, ops, and chatbot orchestration"],
        [">$45<", ">Custom<"],
        ["per month", "custom pricing"],
        ["Usage Limites", "Includes"],
        ["200 voice messages/month", "Workflow audit and automation roadmap"],
        ["1 active chat session", "Use case prioritization and integration planning"],
        ["5MB storage space", "Pilot recommendation with success metrics"],
        ["Intuitive chat experience", "Scoped deployment and technical design"],
        ["Ready-to-use automation workflows", "Launch plan aligned to business ROI"],
        ["Unlimited voice", "Inbound support or outbound campaign flows"],
        ["3 active chat sessions", "Thai, Lao, Myanmar, or Malay localization"],
        ["2GB data storage", "Call summaries and system updates"],
        ["All Essentials Included", "Routing, qualification, and escalation design"],
        ["Scheduled voice messages", "Inbound, outbound, or interviewer automation"],
        ["API Integration Triggers", "CRM and workflow integration hooks"],
        ["Version Control for Workflows", "Continuous optimization after launch"],
        ["Recommended", "Recommended"],
        ["Unlimited events", "Google Sheets, Drive, Docs, and Notion actions"],
        ["15 active workflows", "Backoffice triggers, approvals, and updates"],
        ["10GB data storage", "Structured outputs for recurring operations"],
        ["Everything in Starter", "System-connected task execution"],
        ["Team activity insights", "Operational summaries and exception handling"],
        ["Advanced API access", "Business rules plus AI decision support"],
        ["Priority workflow execution", "Human-in-the-loop checkpoints when needed"],
        ["Unlimited workflows", "Voice, ops, and chatbot orchestration"],
        ["50GB data storage", "Cross-channel context and audit trail"],
        ["Everything in Pro", "Unified automation layer across customer and internal workflows"],
        ["SSO &amp; team provisioning", "Enterprise rollout and governance support"],
        ["Dedicated manager", "Custom deployment and language expansion"],
        ["Workspace-level", "Multi-team operating model"],
        ["Engage in Group Chat Insights", "Need a custom rollout?"],
        ["Stay Updated on Latest Chat Features.", "Tell us your use case, language needs, and integration stack."],
        ['href="#">', 'href="/contact">'],
      ];
    case "blog.html":
      return [
        ["Daily success stories", "Lumos AI field notes"],
        [
          "Explore transformative insights and success stories from our users, showcasing how our software has elevated their blogging experience.",
          "Articles on AI voice systems, operations automation, business chatbots, and autonomous agent use cases across Southeast Asia.",
        ],
      ];
    case "contact.html":
      return [
        ["Contact Form", "Plan your deployment"],
        ["Contact Lumos", "Talk to the Lumos AI team"],
        [
          "Please feel free to reach out to me if you need any further information",
          "Share your workflow, language needs, and integration stack. We will recommend the right autonomous system to start with.",
        ],
        [">Last Name<", ">Company<"],
        ["Doe*", "Your company"],
        [">Email<", ">Work Email<"],
        ["Johndoe@email.com*", "team@lumos.co.th"],
        ["Select one...", "Choose a starting point"],
        ["Track emissions", "AI voice systems"],
        ["Improve reporting", "AI operation systems"],
        ["Meet compliance requirements", "AI business chatbots"],
        ["I'd like to...", "Tell us about your workflow, volumes, and target languages"],
        ["You agree to our friendly privacy policy.", "You agree to our privacy policy."],
        [">Email<", ">Email<"],
        [
          'href="/contact"><div>hello@lumos.com</div>',
          'href="mailto:team@lumos.co.th"><div>team@lumos.co.th</div>',
        ],
        ["Address", "Region"],
        ["4th Floor, City Towers, Near Grant Road", "Serving Thailand, Southeast Asia, and global teams"],
        ["Working Hours", "Availability"],
        ["<strong>All Week:</strong> 9:00 AM – 6:00 PM (CET)", "<strong>By appointment:</strong> project scoping and deployment planning"],
      ];
    default:
      return [];
  }
}

function applyArticleOverride(source: string, routeKey: string) {
  const articleOverride = ARTICLE_OVERRIDES[routeKey];

  if (!articleOverride) {
    return source;
  }

  let nextSource = applyStringReplacements(source, [
    ...getSharedBodyReplacements(),
    ...getRouteBodyReplacements(routeKey),
  ]);

  nextSource = nextSource.replace(
    /<div class="rich-text-block w-richtext">[\s\S]*?<\/div>/,
    articleOverride.bodyHtml.trim(),
  );

  return nextSource;
}

function applyLegalPageOverride(source: string, routeKey: string) {
  const legalOverride = LEGAL_PAGE_OVERRIDES[routeKey];

  if (!legalOverride) {
    return source;
  }

  return source.replace(
    /<div class="rich-text-legal w-richtext">[\s\S]*?<\/div>/,
    legalOverride.bodyHtml.trim(),
  );
}

function applyHomeSectionAnchors(source: string) {
  let nextSource = applyStringReplacements(source, [
    ['href="/features">Services', 'href="#features">Services'],
    ['href="/about">Use cases', 'href="#about">Use cases'],
    ['href="/blog">FAQ', 'href="#faq">FAQ'],
    ['href="/contact">Contact', 'href="#contact">Contact'],
    ['href="/contact">Book a Demo', 'href="#contact">Book a Demo'],
    ['href="/about">Use Cases', 'href="#about">Use Cases'],
    ['href="/features">AI Voice Systems', 'href="#features">AI Voice Systems'],
    ['href="/features">AI Operation Systems', 'href="#features">AI Operation Systems'],
    ['href="/features">AI Business Chatbot', 'href="#features">AI Business Chatbot'],
  ]);

  nextSource = nextSource.replace(
    '<div class="center-text"><div class="fade-in-blur"><h1>Three Systems. One Autonomous Stack.</h1></div></div>',
    '<div class="center-text" id="features"><div class="fade-in-blur"><h1>Three Systems. One Autonomous Stack.</h1></div></div>',
  );

  nextSource = nextSource.replace(
    '<div class="title-left"><h2 class="no-marings">Built for Real Business Operations</h2>',
    '<div class="title-left" id="about"><h2 class="no-marings">Built for Real Business Operations</h2>',
  );

  nextSource = nextSource.replace(
    '<div class="left-title"><div class="fade-in-on-scroll"><h2 class="title">Questions?</h2>',
    '<div class="left-title" id="faq"><div class="fade-in-on-scroll"><h2 class="title">Questions?</h2>',
  );

  nextSource = nextSource.replace(
    '<div class="center-title"><div class="center-text"><div class="title-left"><div class="fade-in-on-scroll"><div class="title-secondary">Ready to Deploy Lumos AI</div></div>',
    '<div class="center-title" id="contact"><div class="center-text"><div class="title-left"><div class="fade-in-on-scroll"><div class="title-secondary">Ready to Deploy Lumos AI</div></div>',
  );

  return nextSource;
}

function normalizeBodyHtml(body: string, filePath: string) {
  const routeKey = getRouteKeyFromFilePath(filePath);
  let normalizedBody = body.replaceAll(
    '<a class="button w-inline-block" href="https://webflow.com/templates/designers/over-sight" target="_blank"><div class="button-text-holder"><div class="button-text">Buy Template</div></div></a>',
    '<a class="button w-inline-block" href="/contact"><div class="button-text-holder"><div class="button-text">Book Demo</div></div></a>',
  );

  normalizedBody = rewritePrimaryNavigation(normalizedBody, routeKey);

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

  normalizedBody = normalizedBody.replace(
    '<img alt="" class="hero-section-phone-screenshot-image-2" loading="lazy" sizes="(max-width: 860px) 100vw, 860px" src="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b5443a2e9d4ac50694cd_Voice%20Chat.jpg" srcset="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b5443a2e9d4ac50694cd_Voice%20Chat-p-500.jpg 500w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b5443a2e9d4ac50694cd_Voice%20Chat-p-800.jpg 800w, https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b5443a2e9d4ac50694cd_Voice%20Chat.jpg 860w"/>',
    '<img alt="Lumos voice chat interface showing a meeting scheduling request." class="hero-section-phone-screenshot-image-2" loading="lazy" sizes="(max-width: 1536px) 100vw, 1536px" src="/VoiceChat_lumos_v9.png" srcset="/VoiceChat_lumos_v9.png 1536w"/>',
  );

  normalizedBody = normalizedBody.replace(
    /<div class="sticky-phone-wrapper"><div class="sticky-phone-holder"><div class="sticky-content-holder" id="w-node-c6555da1-e6f4-eec1-77e9-5d37a330e368-ddca84cf">[\s\S]*?<\/div><div class="sticky-phone-container" id="w-node-c6555da1-e6f4-eec1-77e9-5d37a330e381-ddca84cf">[\s\S]*?<div class="blur-bg"><\/div><\/div><\/div><\/div><\/div><\/div>/,
    buildStickyUseCaseSection(),
  );

  normalizedBody = applyStringReplacements(normalizedBody, [
    ...getSharedBodyReplacements(),
    ...getRouteBodyReplacements(routeKey),
  ]);

  normalizedBody = applyArticleOverride(normalizedBody, routeKey);
  normalizedBody = applyLegalPageOverride(normalizedBody, routeKey);

  normalizedBody = normalizedBody.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
    (fullMatch, rawAttributes: string, innerHtml: string) => {
      const classMatch = rawAttributes.match(/\bclass=(["'])(.*?)\1/i);
      const labelMatch = innerHtml.match(
        /<div class="button-text">(Learn More|Learn more)<\/div>/,
      );

      if (!classMatch || !labelMatch || !/\bbutton\b/.test(classMatch[2])) {
        return fullMatch;
      }

      const label = labelMatch[1];
      const nextAttributes = rawAttributes.replace(
        /\bclass=(["'])(.*?)\1/i,
        (_match, quote: string, classValue: string) =>
          `class=${quote}${appendClassName(classValue, "lumos-interactive-hover-button")}${quote}`,
      );
      const nextInnerHtml = innerHtml.replace(
        `<div class="button-text-holder"><div class="button-text">${label}</div></div>`,
        `<div class="button-text-holder lumos-interactive-hover-button__text" data-lumos-button-label="${label}"><div class="button-text">${label}</div><span class="lumos-interactive-hover-button__arrow" aria-hidden="true">&#8594;</span></div>`,
      );

      return `<a${nextAttributes}>${nextInnerHtml}</a>`;
    },
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

  normalizedBody = applyHomeSectionAnchors(normalizedBody);

  return normalizedBody;
}

function getHtmlFileForSegments(segments: string[]) {
  const relativePath = getRouteKeyFromSegments(segments);
  const normalizedPath = path.normalize(relativePath);

  if (normalizedPath.startsWith("..") || path.isAbsolute(normalizedPath)) {
    return null;
  }

  if (!isPublishedRouteKey(relativePath)) {
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

  return {
    bodyHtml: normalizeBodyHtml(
      body.replace(/<script\b[\s\S]*?<\/script>/gi, "").trim(),
      filePath,
    ),
    description: meta.description,
    externalScripts,
    htmlAttributes: parseAttributes(htmlTagMatch?.[1] ?? ""),
    jsonLdBlocks: [],
    meta,
    title: decodeHtml(getTagContent(head, "title")),
  };
});

const listRouteSegments = cache(() => {
  return walkHtmlFiles(SOURCE_DIR)
    .map((filePath) => path.relative(SOURCE_DIR, filePath))
    .map((relativePath) => relativePath.replace(/\.html$/i, ""))
    .filter((relativePath) => isPublishedRouteKey(`${relativePath}.html`))
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
  const routeKey = getRouteKeyFromSegments(segments);
  const routeOverride =
    ROUTE_METADATA_OVERRIDES[routeKey] ??
    ARTICLE_OVERRIDES[routeKey] ??
    LEGAL_PAGE_OVERRIDES[routeKey];

  if (!document) {
    return {};
  }

  const ogImage = document.meta["og:image"];
  const twitterImage = document.meta["twitter:image"];
  const title = routeOverride?.title ?? sanitizeMetadataTitle(document.title);
  const description =
    routeOverride?.description ??
    sanitizeMetadataDescription(document.description);
  const openGraphTitle =
    routeOverride?.title ??
    sanitizeMetadataTitle(document.meta["og:title"] ?? document.title);
  const twitterTitle =
    routeOverride?.title ??
    sanitizeMetadataTitle(document.meta["twitter:title"] ?? document.title);
  const openGraphDescription =
    routeOverride?.description ??
    sanitizeMetadataDescription(
      document.meta["og:description"] ?? document.description,
    );
  const twitterDescription =
    routeOverride?.description ??
    sanitizeMetadataDescription(
      document.meta["twitter:description"] ?? document.description,
    );

  return {
    description,
    openGraph: {
      description: openGraphDescription,
      images: ogImage ? [ogImage] : undefined,
      title: openGraphTitle,
      type:
        document.meta["og:type"] === "website"
          ? "website"
          : undefined,
    },
    title,
    twitter: {
      card:
        document.meta["twitter:card"] === "summary_large_image"
          ? "summary_large_image"
          : undefined,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
      title: twitterTitle,
    },
  };
}

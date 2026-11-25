import type { CreatorResource } from "@/data/resources";

const platforms = ["TikTok", "Instagram Reels", "YouTube Shorts"] as const;

export const nicheResources: CreatorResource[] = [
  {
    category: "checklists",
    slug: "business-tech-ai-workflow-checklist",
    title: "Business, Tech & AI Workflow Checklist",
    description:
      "Review an AI workflow demo for clarity, privacy, verification, and a realistic business takeaway.",
    platforms: [...platforms],
    niches: ["Business, Tech & AI Workflows"],
    items: [
      "Name the business task and the person who benefits from the workflow.",
      "Show the starting input and each important tool setting on screen.",
      "Remove client data, access tokens, private messages, and confidential documents.",
      "Demonstrate the actual steps instead of implying the tool acted autonomously.",
      "Show the output and identify what a person checked or corrected.",
      "State the limits, plan requirements, and human review that affect the result.",
      "Use the same task conditions for any before-and-after comparison.",
      "Verify factual claims and explain how a viewer can test the workflow safely.",
    ],
  },
  {
    category: "checklists",
    slug: "finance-crypto-trading-content-checklist",
    title: "Finance & Crypto / Trading Content Checklist",
    description:
      "Keep market and money content educational, contextual, and clear about uncertainty and risk.",
    platforms: [...platforms],
    niches: ["Finance & Crypto / Trading"],
    items: [
      "State the market, asset, date, and timeframe behind any chart or price reference.",
      "Distinguish personal opinion and education from individualized financial advice.",
      "Verify numbers, calculations, and source links before recording.",
      "Explain downside risk, volatility, fees, and uncertainty alongside possible upside.",
      "Never promise returns, imply a trade is certain, or pressure viewers to act immediately.",
      "Disclose holdings, sponsorships, referral links, or other relevant conflicts.",
      "Use a paper-trading or historical example when demonstrating a strategy.",
      "Do not display wallet addresses, account details, or private customer information.",
      "Explain technical terms and avoid presenting one chart pattern as proof.",
      "Invite viewers to research independently and consult a qualified professional when needed.",
    ],
  },
  {
    category: "checklists",
    slug: "fitness-health-wellness-video-checklist",
    title: "Fitness, Health & Wellness Video Checklist",
    description:
      "Make movement and wellness videos easy to follow without overgeneralizing personal advice.",
    platforms: [...platforms],
    niches: ["Fitness, Health & Wellness"],
    items: [
      "Identify the intended experience level and purpose of the movement or routine.",
      "Show equipment, setup, and the full movement in a clear camera angle.",
      "Demonstrate a controlled version before showing a faster or harder variation.",
      "Offer a modification that reduces impact or load when it fits the exercise.",
      "Check the filming area and equipment for obvious trip or pinch hazards.",
      "Use cues that describe the movement rather than diagnosing a viewer.",
      "Avoid claims that one routine treats, cures, or guarantees a health outcome.",
      "Mention that viewers should stop if they feel pain and seek qualified guidance.",
      "Keep personal data and other people's health details out of the footage.",
      "Review captions and on-screen instructions for accuracy before posting.",
    ],
  },
  {
    category: "checklists",
    slug: "career-education-skill-building-checklist",
    title: "Career, Education & Skill Building Checklist",
    description:
      "Turn a lesson into a practical tutorial with clear steps, accurate examples, and accessible pacing.",
    platforms: [...platforms],
    niches: ["Career, Education & Skill Building"],
    items: [
      "State the learner level and the skill the video will help them practice.",
      "Break the skill into one achievable lesson rather than a full course.",
      "Demonstrate the task with a concrete example from start to finish.",
      "Define unfamiliar terms before relying on them in later steps.",
      "Separate personal experience from formal credential or hiring requirements.",
      "Use current, verifiable information for exams, licensing, or career advice.",
      "Add captions and keep code, slides, or examples readable on a phone.",
      "Point out one common error and show how to correct it.",
      "End with a small practice task the viewer can complete independently.",
      "Check that examples do not expose private student, employee, or client details.",
    ],
  },
  {
    category: "checklists",
    slug: "digital-marketing-creator-growth-checklist",
    title: "Digital Marketing & Creator Growth Checklist",
    description:
      "Publish growth content with a measurable goal, accurate proof, and a platform-native creative.",
    platforms: [...platforms],
    niches: ["Digital Marketing & Creator Growth"],
    items: [
      "Choose one campaign goal and name the audience the content serves.",
      "Match the opening hook to the real offer, lesson, or result in the video.",
      "Use current analytics and state the time period and source for performance claims.",
      "Separate correlation from causation when describing campaign results.",
      "Keep customer names, ad accounts, and campaign data private unless approved.",
      "Adapt framing, captions, and CTA for each platform instead of reposting blindly.",
      "Disclose sponsorships, affiliate links, and paid partnerships clearly.",
      "Use a landing page or destination that works on mobile and matches the CTA.",
      "Make one clear next-step request rather than stacking multiple CTAs.",
      "Record a hypothesis to test and a fair signal to review after publishing.",
    ],
  },
  {
    category: "checklists",
    slug: "beauty-fashion-lifestyle-content-checklist",
    title: "Beauty, Fashion & Lifestyle Content Checklist",
    description:
      "Prepare a polished product, styling, or routine video with transparent claims and accessible details.",
    platforms: [...platforms],
    niches: ["Beauty, Fashion & Lifestyle"],
    items: [
      "Show the product, garment, or routine clearly in natural, accurate lighting.",
      "Disclose sponsorship, gifted products, affiliate links, and filters where relevant.",
      "Describe your own experience instead of promising the same result for every viewer.",
      "Avoid unverified medical, skin-treatment, or body-transformation claims.",
      "Include shade, sizing, material, or care details that viewers need to assess fit.",
      "Use camera angles and edits that do not misrepresent color, texture, or fit.",
      "Check brand permissions and ensure all featured products are identified accurately.",
      "Add readable captions and keep important details on screen long enough to read.",
      "Keep private addresses, order details, and other people's faces out of frame unless approved.",
      "End with a useful comparison, care tip, or clear destination for more information.",
    ],
  },
  {
    category: "checklists",
    slug: "gaming-tech-hardware-review-checklist",
    title: "Gaming & Tech Hardware Review Checklist",
    description:
      "Make hardware reviews useful by showing the test setup, real trade-offs, and reproducible context.",
    platforms: [...platforms],
    niches: ["Gaming & Tech Hardware"],
    items: [
      "Identify the exact product model, configuration, and review sample source.",
      "Disclose loaned hardware, sponsorship, affiliate links, or other material connections.",
      "Show the test setup, game or workload, settings, and relevant environmental conditions.",
      "Use comparable settings when comparing frame rates, temperatures, or battery life.",
      "Distinguish measured results from subjective impressions.",
      "Include drawbacks such as noise, heat, ergonomics, compatibility, or price.",
      "Avoid claiming a benchmark is universal when results depend on hardware and settings.",
      "Blur account names, serial numbers, private chats, and personal files in screen captures.",
      "Check that music, gameplay footage, and logos are permitted for the use shown.",
      "Summarize which user or use case may benefit and who may prefer another option.",
    ],
  },
  {
    category: "swipe-files",
    slug: "business-tech-ai-workflow-swipe-file",
    title: "Business, Tech & AI Workflow Swipe File",
    description:
      "Open an AI workflow story with the real task, the human check, and the useful outcome.",
    platforms: [...platforms],
    niches: ["Business, Tech & AI Workflows"],
    hook: "I used an AI assistant to turn meeting notes into a first-draft project plan, then checked every owner and deadline myself.",
    generatorPrompt:
      "Write 8 concrete opening hooks for an AI workflow video using the task, tool, input, and verified output I provide. Clearly distinguish what the tool drafted from what a person checked. Avoid invented savings, accuracy claims, or client details. If key context is missing, ask me one concise question first.",
  },
  {
    category: "swipe-files",
    slug: "finance-crypto-trading-swipe-file",
    title: "Finance & Crypto / Trading Swipe File",
    description:
      "Frame a trading lesson around uncertainty and risk rather than a sensational market prediction.",
    platforms: [...platforms],
    niches: ["Finance & Crypto / Trading"],
    hook: "A green candle is not a trading plan. Before I look at an entry, I write down what would prove my idea wrong.",
    generatorPrompt:
      "Create 8 educational finance or crypto hook examples about risk management and decision process. Keep them non-promotional, avoid predictions or price targets, and never imply returns are guaranteed. Ask me for the market context if it is necessary to make the examples accurate.",
  },
  {
    category: "swipe-files",
    slug: "fitness-health-wellness-swipe-file",
    title: "Fitness, Health & Wellness Swipe File",
    description:
      "Start with a movement cue or routine adjustment viewers can observe and try at an appropriate level.",
    platforms: [...platforms],
    niches: ["Fitness, Health & Wellness"],
    hook: "I stopped rushing my warm-up and started paying attention to how the first set felt; that changed how I planned the rest of the session.",
    generatorPrompt:
      "Write 8 responsible fitness or wellness hook examples based on my routine or coaching point. Keep advice general, avoid diagnosing or promising a health result, and include a sensible modification where relevant. Ask for audience level and the exercise if either is missing.",
  },
  {
    category: "swipe-files",
    slug: "career-education-skill-building-swipe-file",
    title: "Career, Education & Skill Building Swipe File",
    description:
      "Make a skill lesson feel achievable by naming one common sticking point and showing a practical correction.",
    platforms: [...platforms],
    niches: ["Career, Education & Skill Building"],
    hook: "If your spreadsheet formula keeps returning the wrong total, check the selected range before you rewrite the whole formula.",
    generatorPrompt:
      "Generate 8 specific hooks for teaching a career or education skill. Each should name a learner problem and promise one step that the lesson actually demonstrates. Do not invent hiring rules or credentials; ask me for the learner level and skill when those details are missing.",
  },
  {
    category: "swipe-files",
    slug: "digital-marketing-creator-growth-swipe-file",
    title: "Digital Marketing & Creator Growth Swipe File",
    description:
      "Lead with a testable marketing lesson rather than an unsupported promise of reach or revenue.",
    platforms: [...platforms],
    niches: ["Digital Marketing & Creator Growth"],
    hook: "We changed the first sentence of this campaign, not the budget. Here is the audience signal we checked before deciding what to test next.",
    generatorPrompt:
      "Write 8 marketing and creator-growth hooks from the campaign details I provide. Separate the experiment from the result, ask for timeframe and audience context when missing, and do not claim a tactic caused growth without evidence.",
  },
  {
    category: "swipe-files",
    slug: "beauty-fashion-lifestyle-swipe-file",
    title: "Beauty, Fashion & Lifestyle Swipe File",
    description:
      "Use a practical styling or product detail to help viewers decide what fits their own preferences.",
    platforms: [...platforms],
    niches: ["Beauty, Fashion & Lifestyle"],
    hook: "I compared this jacket in daylight and indoor lighting because the color looked different in the product photos.",
    generatorPrompt:
      "Create 8 honest beauty, fashion, or lifestyle hooks using the exact product and personal experience I provide. Avoid universal appearance claims, unverified health benefits, and false scarcity. Ask for the product detail or audience if the brief is too broad.",
  },
  {
    category: "swipe-files",
    slug: "gaming-tech-hardware-swipe-file",
    title: "Gaming & Tech Hardware Swipe File",
    description:
      "Hook a hardware review with a specific test condition and a trade-off that matters to players.",
    platforms: [...platforms],
    niches: ["Gaming & Tech Hardware"],
    hook: "This compact keyboard saved desk space, but the shorter layout changed how I reached the arrow keys during play.",
    generatorPrompt:
      "Write 8 hardware review hooks based on the exact model, test conditions, and observed trade-offs I provide. Label subjective impressions as opinions, do not invent benchmark results, and ask for the test setup if a performance claim is requested.",
  },
  {
    category: "templates",
    slug: "business-tech-ai-workflow-script-template",
    title: "Business, Tech & AI Workflow Demo Script",
    description:
      "A complete example script showing an AI-assisted business task with an explicit human review step.",
    platforms: [...platforms],
    niches: ["Business, Tech & AI Workflows"],
    content:
      "HOOK: Here is how I turn meeting notes into a first-draft project plan without handing the final decision to AI.\n\nDEMO: I remove client names, paste the approved notes into the assistant, and ask it to group tasks by workstream.\n\nREVIEW: Before sharing the draft, I compare every owner and deadline with the original notes and correct anything the model inferred.\n\nPAYOFF: The tool helps organize a starting point; the team still owns accuracy and priorities.\n\nCTA: Try the same process with non-sensitive notes and verify the draft before sending it.",
  },
  {
    category: "templates",
    slug: "finance-crypto-trading-script-template",
    title: "Finance & Crypto / Trading Education Script",
    description:
      "A risk-aware sample script for explaining a trading decision process without making a recommendation.",
    platforms: [...platforms],
    niches: ["Finance & Crypto / Trading"],
    content:
      "HOOK: A chart setup is only useful if you know what would invalidate it.\n\nCONTEXT: In this example, I am reviewing a historical chart, not calling a live trade.\n\nPROCESS: I mark the level I am watching, the point where my idea would be wrong, and the risk I would accept before considering an entry.\n\nTRADE-OFF: A setup can fail, and fees, volatility, and position size change the outcome.\n\nTAKEAWAY: Write down your risk before you focus on a possible reward.\n\nCTA: Use this as an educational checklist, research independently, and never risk money you cannot afford to lose.",
  },
  {
    category: "templates",
    slug: "fitness-health-wellness-script-template",
    title: "Fitness, Health & Wellness Coaching Script",
    description:
      "A copy-ready movement demo that gives clear cues while encouraging viewers to respect their limits.",
    platforms: [...platforms],
    niches: ["Fitness, Health & Wellness"],
    content:
      "HOOK: Here are three setup checks I use before a controlled bodyweight squat.\n\nSETUP: Place your feet where you can balance comfortably and brace gently before moving.\n\nDEMO: Lower at a pace you can control, keep your whole foot grounded, and stand back up without rushing.\n\nOPTION: Use a chair for support or reduce the range if that is more appropriate for you today.\n\nREMINDER: Bodies and training needs differ; stop if you feel pain and get qualified guidance when needed.\n\nCTA: Save the cues and practice at a comfortable pace.",
  },
  {
    category: "templates",
    slug: "career-education-skill-building-script-template",
    title: "Career, Education & Skill Building Tutorial Script",
    description:
      "A complete spreadsheet mini-lesson that moves from a visible problem to a learner practice step.",
    platforms: [...platforms],
    niches: ["Career, Education & Skill Building"],
    content:
      "HOOK: If your spreadsheet total looks wrong, check the range before rebuilding the formula.\n\nSHOW THE PROBLEM: The formula adds cells B2 through B8, but the new entry is in B9.\n\nTEACH: Select the formula, extend the range to include B9, and press Enter.\n\nVERIFY: Compare the updated total with a quick manual check on this small example.\n\nPRACTICE: Pause and inspect the range in your own sheet before copying the formula down.\n\nCTA: Save this lesson and tell me which spreadsheet skill you want explained next.",
  },
  {
    category: "templates",
    slug: "digital-marketing-creator-growth-script-template",
    title: "Digital Marketing & Creator Growth Experiment Script",
    description:
      "A transparent campaign test story that separates the change made from the result observed.",
    platforms: [...platforms],
    niches: ["Digital Marketing & Creator Growth"],
    content:
      "HOOK: We tested a clearer first sentence on one campaign creative; here is what we checked before changing anything else.\n\nHYPOTHESIS: We thought viewers needed to understand the offer sooner.\n\nTEST: We kept the audience and budget settings consistent while changing the opening line.\n\nOBSERVATION: We reviewed the same reporting window and compared qualified clicks, not views alone.\n\nCAVEAT: One test is a signal, not proof that the wording caused every change.\n\nTAKEAWAY: Change one variable at a time when you can, and record the conditions.\n\nCTA: What campaign element would you test next?",
  },
  {
    category: "templates",
    slug: "beauty-fashion-lifestyle-script-template",
    title: "Beauty, Fashion & Lifestyle Product Review Script",
    description:
      "A transparent try-on example focused on real product details, disclosure, and personal fit.",
    platforms: [...platforms],
    niches: ["Beauty, Fashion & Lifestyle"],
    content:
      "HOOK: I checked this jacket in daylight because indoor lighting made the color look different.\n\nDISCLOSURE: This is my own styling experience; any gifted or paid relationship should be stated clearly here.\n\nDETAIL: In daylight, the fabric reads warmer, and the sleeves sit just above my wrist.\n\nFIT: I am sharing how it fits me, not promising the same fit for every body.\n\nTRADE-OFF: The structured fabric holds its shape, but it feels less flexible than a soft knit.\n\nCTA: Check the material and sizing details before choosing a fit that works for you.",
  },
  {
    category: "templates",
    slug: "gaming-tech-hardware-script-template",
    title: "Gaming & Tech Hardware Review Script",
    description:
      "A concise keyboard review example with test context, clear observations, and a balanced conclusion.",
    platforms: [...platforms],
    niches: ["Gaming & Tech Hardware"],
    content:
      "HOOK: This compact keyboard saves desk space, but the smaller layout changes how I reach the arrow keys.\n\nTEST: I used it for a week of writing and casual play with the same desk setup.\n\nWHAT WORKED: The shorter footprint leaves more room for mouse movement, and the keys feel stable while typing.\n\nTRADE-OFF: The arrow keys are closer to the main key area, so I needed time to adjust.\n\nCONTEXT: That is my experience with this layout, not a universal performance result.\n\nCTA: Check the layout diagram and switch compatibility before deciding if it suits your setup.",
  },
  {
    category: "prompt-packs",
    slug: "business-tech-ai-workflow-prompt-pack",
    title: "Business, Tech & AI Workflow Prompt Pack",
    description:
      "A ready-to-copy prompt for documenting an AI-assisted process with privacy and verification built in.",
    platforms: [...platforms],
    niches: ["Business, Tech & AI Workflows"],
    prompt:
      "Act as a practical business workflow analyst. Help me document one AI-assisted process from input to reviewed output. First ask me for the task, audience, approved tools, privacy constraints, and what success means. Then create a concise workflow with numbered steps, the human decision points, an output quality checklist, and known failure cases. Never assume the AI completed work it did not do, and never recommend entering confidential information into an unapproved tool. If I have not supplied enough detail, ask one focused follow-up instead of inventing facts.",
  },
  {
    category: "prompt-packs",
    slug: "finance-crypto-trading-prompt-pack",
    title: "Finance & Crypto / Trading Prompt Pack",
    description:
      "A research prompt that checks assumptions, identifies risk, and avoids unsupported market predictions.",
    platforms: [...platforms],
    niches: ["Finance & Crypto / Trading"],
    prompt:
      "Act as a cautious financial research assistant, not a trading signal service. Help me analyze the market question I describe. Start by asking for the asset, timeframe, jurisdiction, and sources if they are missing. Separate verified facts from assumptions, list relevant risks and alternative explanations, explain unfamiliar terms, and identify what evidence could change the analysis. Do not predict guaranteed prices or returns, recommend a personalized trade, or treat historical performance as a promise. End with a neutral research checklist and a reminder to verify current information independently.",
  },
  {
    category: "prompt-packs",
    slug: "fitness-health-wellness-prompt-pack",
    title: "Fitness, Health & Wellness Prompt Pack",
    description:
      "A general-audience planning prompt that prioritizes safe modifications and avoids diagnosis or medical claims.",
    platforms: [...platforms],
    niches: ["Fitness, Health & Wellness"],
    prompt:
      "Help me outline a general fitness or wellness explainer for a short-form video. Ask for the activity, intended audience level, equipment, and the specific educational point before drafting. Return a clear hook, safe setup notes, controlled demonstration beats, an easier variation where appropriate, and a concise closing reminder. Do not diagnose, prescribe treatment, promise a health outcome, or assume every viewer has the same abilities. If the topic involves pain, injury, or a medical condition, recommend review by an appropriately qualified professional.",
  },
  {
    category: "prompt-packs",
    slug: "career-education-skill-building-prompt-pack",
    title: "Career, Education & Skill Building Prompt Pack",
    description:
      "A teaching prompt for turning an expert skill into a clear, accurate, beginner-friendly micro-lesson.",
    platforms: [...platforms],
    niches: ["Career, Education & Skill Building"],
    prompt:
      "Act as an instructional designer creating a short practical lesson. Ask me what skill I am teaching, who the learners are, and what they should be able to do afterward. Then create a concise hook, prerequisite note, numbered demonstration, one common error with a correction, a practice task, and a quick self-check. Use plain language and a concrete example. Do not invent certification, hiring, or exam requirements; flag any current rule that needs a reliable source.",
  },
  {
    category: "prompt-packs",
    slug: "digital-marketing-creator-growth-prompt-pack",
    title: "Digital Marketing & Creator Growth Prompt Pack",
    description:
      "A campaign-planning prompt that produces testable content ideas without reach or revenue guarantees.",
    platforms: [...platforms],
    niches: ["Digital Marketing & Creator Growth"],
    prompt:
      "Act as an ethical digital marketing strategist. Ask me about the audience, campaign objective, offer, platform, available evidence, and production capacity. Then propose a small set of short-form content experiments with a distinct hook, creative angle, one CTA, and a measurable signal for each. Separate hypotheses from established results, note disclosure needs, and avoid guaranteed growth, fabricated case studies, or manipulative urgency. Finish with a simple review plan that compares like-for-like time periods.",
  },
  {
    category: "prompt-packs",
    slug: "beauty-fashion-lifestyle-prompt-pack",
    title: "Beauty, Fashion & Lifestyle Prompt Pack",
    description:
      "A product-content prompt for useful styling or routine ideas with transparent and inclusive language.",
    platforms: [...platforms],
    niches: ["Beauty, Fashion & Lifestyle"],
    prompt:
      "Help me create an honest short-form beauty, fashion, or lifestyle product feature. Ask what the item is, how I used it, who the content is for, and whether there is a paid or gifted relationship. Draft a natural opening, a demonstration of real product details, personal observations, limitations or fit considerations, and a clear disclosure line when relevant. Avoid medical or universal appearance claims, fabricated results, body shaming, and false scarcity. Keep the final wording welcoming and specific.",
  },
  {
    category: "prompt-packs",
    slug: "gaming-tech-hardware-prompt-pack",
    title: "Gaming & Tech Hardware Prompt Pack",
    description:
      "A balanced review prompt for hardware that makes test conditions and real trade-offs easy to understand.",
    platforms: [...platforms],
    niches: ["Gaming & Tech Hardware"],
    prompt:
      "Act as a fair gaming hardware reviewer. Ask me for the exact model, configuration, test setup, workload, review sample source, and any sponsorship or affiliate relationship. Build a short review outline with a hook, reproducible test conditions, measured results only when I provide them, subjective impressions clearly labeled, strengths, drawbacks, compatibility notes, and the type of user it may suit. Do not invent benchmarks, universalize one test, or call a product best without criteria. End with a practical buying-check reminder.",
  },
];

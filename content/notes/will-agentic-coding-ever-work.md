---
title: Will Agentic Coding Ever Work?
author: Owen Isenhart
date: 2026-05-14
tags: [coding, philosophy]
readTime: 6 min read
coverImage: /images/notes/agents.webp
---

Short answer: maybe

Please, please, please, actually understand the points I make before going crazy. I feel like I'm incredibly reasonable here.

To answer the question of if agentic coding will ever work, let me first define what I mean by this. I qualify agentic coding as "working" if it meets these three distinct qualifications:

1. **Full Autonomy:** AI agents work entirely independently on complex, enterprise-level codebases without a human supervisor holding their hand.
2. **Deterministic Safety:** The agents operate with absolute system safety. They do not make catastrophic, system-breaking errors, and if a routine bug occurs, they can immediately self-remediate during an automated AI code review.
3. **Economic & Throughput Efficiency:** Agentic coding satisfies the project management triangle (scope, cost, and time) better than human engineers.

Now, let me justify these guidelines. AI labs have been saying for basically the last 3 years that "in 6 months, software engineers will be replaced." So, I've attempted to structure these qualifiers to fit the AI labs' own definition of how agentic coding should work. There should be no need for a human in the middle. This idea covers the first two points: agents are the only ones working in a codebase, and if a defect or outage hits production, there is no need for an on-call human because the AI can diagnose and deploy a fix entirely on its own.

For the third point, I've included this because without it, the basic economics automatically disqualify agentic coding from working. The concept of the project management triangle is that its three legs, scope (quality), cost, and time, are completely interdependent. If you want something good and fast, it won't be cheap. If replacing engineers with agents increases the efficiency of this triangle (e.g., things get cheaper while maintaining quality and speed, or things get faster while keeping costs flat), then agentic coding works. However, if you get the same quality and speed but the compute and API bills end up costing more than the salaries of the human engineers you replaced, it’s a failure.

Finally, I'll explain why all three qualifiers must be true at the same time. For the sake of typing, I'll refer to each qualifier by its number (1, 2, or 3).

### Case 1: 1 && 2 && !3 (Failing Economics)

In this case, agents are capable of working without a human in the loop, and they are completely safe. So what's missing? It's either as good or worse than human engineers when measured on the project management triangle. It could be that the models require so much compute to double-check their own work that the API bill to write a single feature costs more than a senior engineer's weekly salary. The AI is perfectly reliable, but economically irrational to use. You can think of it like a Ferrari. It’s by no means useless; it serves its purpose as a car very well, but is it a good financial decision for a delivery company compared to buying a fleet of Honda Civics? No.

For this case to transition into working agentic coding, we would need a dramatic, unprecedented reduction in the cost of frontier compute. Given that frontier model training and inference costs are still scaling exponentially rather than shrinking, a sudden collapse in API pricing to make this case viable is highly unlikely anytime soon.

### Case 2: 1 && !2 && 3 (Untrustworthy)

In this case, agents can work alone in a codebase and do so at lightning speed and low cost, but they lack deterministic safety. They are still capable of making catastrophic mistakes and cannot reliably fix defects or outages when they occur. Some may disagree, but this still counts as a failure, mainly for two reasons:

1. **It still requires humans:** You would still necessitate human engineers on standby. Probably not as many for daily feature work, but a highly skilled SWAT team is still needed to clean up the mess when things break.
2. **Debugging nightmare:** Fixing these issues could be borderline impossible. Trying to trace and debug a massive enterprise codebase that you've basically never looked at in your life, where every line was written by a black-box AI acting on its own logic, would take an enormous amount of time. It would probably be faster to just scrap it and rebuild the entire codebase from scratch.

For this case to cross the finish line, we would need a fundamental architectural breakthrough in LLMs to completely eliminate hallucinations. Current probabilistic models are inherently prone to logic gaps, with standard task hallucination benchmarks hovering around 19%, making them a massive security and stability liability if left entirely unsupervised.

### Case 3: !1 && 2 && 3 (Just Increased Efficiency)

This case means agents work incredibly fast, are cost-effective, and make basically no safety mistakes because they are tightly bound, but they are still not at the level where they can work alone. They still require high-level human direction, oversight, and validation.

This is actually not a bad outcome at all; it just means the human engineer has become a lot more efficient. But it fundamentally fails to live up to the "engineers will be replaced" promise. If a human still has to manually review every PR, verify every terminal tool call, and map out the architecture, the agent is an assistant, not a replacement.

The bottleneck here is context-window degradation and the "needle in a haystack" problem. As an enterprise codebase grows across multi-layered, distributed repositories, an unsupervised agent begins to lose its semantic memory of the broader architecture, causing task failure rates to spike unless a human is there to spoon-feed it context.

I'm not going into the cases where more than one qualifier is missing because it should be obvious that those would not be seen as agentic coding working.

So, as we can see from my perspective, we are probably a lot further from anybody being replaced than the marketing hype suggests. Currently, I would not say [any](https://www.reddit.com/r/AI_Agents/comments/1t2hb0f/opus_46_just_deleted_pocketoss_entire_production/) [of](https://mrshu.github.io/github-statuses/) [these](https://www.cnbc.com/2026/03/10/amazon-plans-deep-dive-internal-meeting-address-ai-related-outages.html) [qualifications](https://www.tomshardware.com/tech-industry/artificial-intelligence/mystery-company-accidentally-blew-usd500-million-on-claude-in-a-single-month-failed-to-put-usage-limit-on-licenses-for-employees) [have](https://coderlegion.com/12170/ai-generated-code-and-the-1-78m-moonwell-incident-a-deep-dive-into-agentic-security) [been](https://www.kiteworks.com/cybersecurity-risk-management/ai-agent-security-incidents-2026/) met, so to go from zero to all three will be quite the undertaking.

Currently, agents cannot work fully autonomously because we don't trust them without a leash; they lack deterministic safety because excessive agency and prompt-injection vulnerabilities make them a security liability; and they fail the project management triangle because context degradation makes complex enterprise tasks either low-quality or economically unsustainable to generate.

I'm not an AI hater by any means; I use it, and everyone I know uses it. I'm just not a fan of the deception, marketing, and backward economics of the whole thing right now. I could be wrong, but that's alright. Time will tell.
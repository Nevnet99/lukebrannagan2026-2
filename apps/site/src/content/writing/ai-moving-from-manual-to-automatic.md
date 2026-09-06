---
title: 'AI, Moving from Manual to Automatic'
description: 'I was wrong about agents in my own workflow. Vibe coding still fails. With good steering and real review, agentic work is how I ship personal projects now.'
pubDate: '2026-09-06'
tags: ['craft', 'architecture']
series: ai-and-craft
---

In [The Coming Crash of Vibe-Coded Software](/writing/the-coming-crash-of-vibe-coded-software) I was pretty against an agent or AI touching my codebase. Over the past three months that opinion has changed a lot.

Don't get me wrong. I still think vibe coding will fail. Someone who does not know the difference between an environment variable and a doorknob, deploying apps people pay for, blind to what is actually getting built and whether it is maintainable, fragile, testable, safe, or secure, is bound to fail.

On personal projects though, I am mostly agentic now. If I steer it properly, the output can land very close to what I would write myself. The speed helps. The craft is in the steering and the review.

## Before

My old workflow lived in the browser. Gemini or something similar. I would scratch out code files for whatever I was building, get a draft of a function or component I was happy with, then ask the model for an opinion. I would have it rebuild the thing a few times and mob with myself and the agent until we landed somewhere decent.

Anything I did not understand, I asked it to explain. If I still did not get it, I had it point me at the docs. Only once the understanding was there would I open a PR and move on to the next ticket.

## Now

That looks very different. I use Cursor and spin up multiple agents based on the tasks I have. I let the agent commit and open the PR, then I review. If I notice something I do not like, or something I do not understand, the documentation loop is the same: ask for clarification until I can stand behind the change.

I think I was wrong in my last post about keeping agents out of the repo. I read a lot of output and approve it. Review is still the job. Good steering does not mean you skip the diff.

## What “steer correctly” means

“Steer correctly” is a loose phrase. Here is a concrete example: analytics on a website.

Junior prompt: “Add PostHog to the website.”

Senior prompt: “Add PostHog to the website. Use a facade so the analytics library stays behind a seam and we can swap it out later.”

Same feature. Completely different shape of output. The second one encodes a design decision the first one never even names.

## Filling the gaps

Improving my craft has moved away from how fast I can type code and how well I know the weirdness of a language and its edge cases, and more into an architect role. That is also why the reading matters: I need enough foundation to spot when a steered agent still lands the wrong shape.

I spend a lot of time reading to fill the gaps from learning at a bootcamp instead of a traditional CS degree. Right now that means *Grokking Data Structures*, so I have a better foundation for time and space complexity when I build and when I verify agent output. *Software Engineering at Google* (the O’Reilly book) for a mindset shift on how to engineer properly. *Designing Data-Intensive Applications* to bolster how I think about building for scale.

I do not think the craft is dying. The abstraction layer has moved one step above the language. You still need to read and understand the language you are developing in, and the core principles of what you are building. For me the craft now lives in system design, design patterns, and prompting while still understanding the code enough to reach the result you actually want.

There is not much I refuse to go automatic on any more, as long as the steering is good. The constraint is not “never touch this file.” It is “I still have to understand and verify what landed.”

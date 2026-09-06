---
title: 'Next.js: The Hidden Costs Behind the Framework'
description: 'Exploring the trade-offs of Next.js: build times, complexity, hosting, and how they show up in day-to-day development.'
pubDate: '2026-02-02'
tags: ['react']
---

Next.js has become extremely popular in the React world, offering a suite of features that simplify building for the web (Hurray!). However, like any tool, it comes with its own set of hidden costs that developers should be aware of before fully committing to it.

First things first Next.js, is a nightmare to host without a PaaS like Vercel*. While Vercel offers a seamless experience, it can lead to vendor lock-in and unexpected costs as your application scales. Self-hosting Next.js applications can be complex and may require additional infrastructure to handle server-side rendering and static site generation.

It would seem that it is actively discouraged to use Next.js and self host it as it is designed to work best within the Vercel ecosystem. This can limit your options and flexibility when it comes to deployment.

To solve this issue the community has created solutions like OpenNext which attempt to make self hosting easier, but it is yet another layer of complexity to add to your stack.

Just take a look at this architecture diagram from the OpenNext documentation:
[OpenNext Architecture Diagram](https://opennext.js.org/aws/inner_workings/architecture) that's a whole lot of moving parts just to self host a Next.js application!

This is assuming of course you want to use all the features of Next.js. If you only need static site generation, you might be better off with a simpler framework like Astro/11ty (and drop the React dependency) or even just using React with a static site generator like Gatsby.

You'll drastically improve your CWV (Core Web Vitals) scores by avoiding the overhead that comes with Next.js. Less JavaScript means faster load times and a better user experience.

## So what do I use instead? 

For projects that require server-side rendering my default recommendation is changing to Remix.run. Remix offers a more straightforward approach to SSR without the bloat of Next.js. It focuses on web fundamentals and provides a better developer experience.

I've felt over recent years that next is just getting more and more complex with each release. New features are added, but old ones are rarely removed, leading to a bloated framework that can be hard to navigate, understand and maintain.

Remix offers full support for hosting anywhere, whether that's Vercel, Netlify, or your own server. This flexibility allows you to choose the best hosting solution for your needs without being tied to a specific provider.

## Build Adapters

Build adapters are meant to make self-hosting Next.js less painful across platforms. The feature is still early (alpha at the time of writing), so treat it as unfinished rather than a solved problem.

It's currently in alpha.

[Build Adapters Documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath) 

## Before you pick Next.js

Ask yourself:
- Do I need the full Next.js feature set, or would a simpler framework do?
- Am I comfortable with how tightly Next.js fits Vercel’s hosting story?
- Am I prepared for the complexity of self-hosting if I leave that path?
- Do I know what my host actually supports for Next? ([comparison table](https://opennext.js.org/aws/comparison))
- Do I even need React here, or would Astro, 11ty, or HTMX cut the surface area?

### Documentation

Tool | Focus | Documentation Link
-----|-------|-------------------
Next.js | The "Vercel-first" Framework | [Official Docs](https://nextjs.org/docs)
Build Adapters | Portability (Experimental) | [AdapterPath API](https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath)
Remix.run | Web Standards SSR | [Remix Docs](https://remix.run/docs)
OpenNext | Self-hosting Next.js | [OpenNext Project](https://opennext.js.org/)
Astro | Content-driven / Zero JS | [Astro Docs](https://docs.astro.build/)
11ty | Simple Static Site Generator | [Eleventy Docs](https://www.11ty.dev/docs/)
HTMX | Hypermedia & Low-JS | [htmx Docs](https://htmx.org/docs/)

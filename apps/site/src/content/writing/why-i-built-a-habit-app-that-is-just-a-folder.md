---
title: 'Why I built a habit app that is just a folder'
description: 'I read Atomic Habits, wanted something simple I actually owned, and shipped Phantasmal before perfectionism could kill it.'
pubDate: '2026-09-10'
tags: ['craft', 'tooling']
---

I had never really tried to take habits seriously. Then I read *Atomic Habits* and decided to give it a go.

Looking around for an app, most of what I found was subscription-heavy. That alone was enough to put me off. I wanted something plain and simple where I own the data, the same reason I adopted Obsidian. Files on disk. Sync however I want. No account wall between me and my own notes.

So I built [Phantasmal](https://phantasmalhabit.com).

## Yes, another developer todo-shaped app

I know the joke. Almost every developer, at some point, builds a todo app or something adjacent. This is not for awards or a polished portfolio piece.

It is for *my* self-improvement workflow. Track habits. Link them to identities. Invert the four laws when I want to break a bad habit. Journal without leaving the same vault.

## The cycle I am trying to break

I have been a developer for around ten years. I have built plenty. Most of it sits in private repos.

Perfectionism is part of it. The other part is a familiar trap: I convince myself a project could be a SaaS, then I stall. Either it will not make money, or work gets busy, and the thing never ships. I end up with half-finished private experiments and very little in public.

I am trying to break that cycle. Start with things I will genuinely use and like. Ship them even when they are a bit rough. Gradually take on more complex work. Later, pick a few I am proud of for a portfolio. Phantasmal is the first thing I have released in that semi-rough state on purpose.

## How I chose the stack

I also wanted a straight answer to a practical question: how fast can I build something like this with Cursor, compared to hand-coding everything?

Faster. A lot faster. And the result still looks close to code I would write myself.

I picked the stack like this:

- Alpine.js for the app UI, to keep the JavaScript thin.
- Electron so I am not maintaining separate apps for each OS.
- Astro for the marketing site, because a couple of splash pages and download links do not need a heavy JS bundle.
- Lit for a small design system, so if I ever expand this into a web app I can reuse the same components anywhere that returns HTML.

The product follows ideas from *Atomic Habits*: cues, stacking, identity, and inverting the four laws for breaks. That book is why I started. The app is not a brand tie-in. It is me trying those ideas out in software I control.

## A vault, not a database behind a login

Under the hood, the vault is a folder. Habits, identities, breaks, and journal entries are files. Point two machines at the same synced folder if you want. That Obsidian-shaped model is the whole point.

Grab it here if you want to try it:

- Site and downloads: [phantasmalhabit.com](https://phantasmalhabit.com)
- Source: [github.com/Nevnet99/phantasmal](https://github.com/Nevnet99/phantasmal)

Phantasmal is not finished. It does not need to be. It is out, I can use it, and the next projects get to stand on that habit of shipping instead of waiting for perfect.

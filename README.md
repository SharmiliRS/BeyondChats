AI Article Automation System – 3 Phase Architecture
Overview

This project implements a 3-phase automated content pipeline using:

Laravel → Data storage & APIs

Node.js → Automation, scraping & AI rewriting

AI (OpenAI / LLM) → Content rewriting

(Phase 3) → Frontend consumption (React / Blade)

Each phase has clear responsibility and no overlap.

Tech Stack

Backend: Laravel 12

Automation: Node.js

Database: MySQL

AI: OpenAI / LLM API

PHP: 8.2

Node: 18+

Phase 1 – Article Fetching (DONE – DO NOT TOUCH)
Purpose

Fetch articles from external sources (API / scraping)

Store raw articles in Laravel database

No AI, no rewriting

Responsibility Split
Node.js

Fetch articles from source

Send data to Laravel API

Laravel

Accept data

Store articles in articles table

Phase 1 API
POST /api/fetch-articles

Payload (example)
{
  "title": "Original Article Title",
  "slug": "original-article-title",
  "description": "Raw article content"
}

Result

Articles are stored as original content

This phase is stable and frozen

Phase 2 – AI Rewriting & Publishing (CURRENT PHASE)
Purpose

Fetch existing articles from database

Rewrite content using AI

Save rewritten version as a new article

Original articles are never modified.

Phase 2 Flow (ONE CLEAR FLOW)

Node fetches articles from Laravel

Node sends article content to AI

AI rewrites the content

Node sends rewritten content back to Laravel

Laravel stores rewritten article

Phase 2 APIs (Laravel)
GET  /api/phase2/articles
POST /api/phase2/articles

GET – Fetch articles to rewrite

Returns a list of articles to be processed.

POST – Save rewritten article
{
  "title": "Rewritten Title",
  "slug": "rewritten-title-ai",
  "description": "AI rewritten content",
  "parent_id": 1
}

parent_id

Links rewritten article to original article

Optional but recommended

Node.js – Phase 2 Responsibilities

Read Laravel articles

Call AI API

Publish rewritten articles

Handle failures cleanly

Sample Console Output
🚀 Phase 2 started
✍️ Rewriting: Article 1
✅ Saved: Article 1
🎉 Phase 2 completed

Phase 3 – Frontend Consumption (NEXT)
Purpose

Display articles to users

Read-only access

SEO friendly pages

Phase 3 Options
Option A – Laravel Blade

Simple article listing

Faster implementation

Option B – React Frontend

Uses Laravel APIs

Modern UI

Phase 3 APIs (Planned)
GET /api/articles
GET /api/articles/{slug}

Database Design (Core)
articles table (simplified)
Column	Description
id	Primary key
title	Article title
slug	URL slug
description	Content
parent_id	Original article reference
created_at	Timestamp
Environment Variables
Node (node-automation/.env)
OPENAI_API_KEY=your_key
LARAVEL_API=http://127.0.0.1:8000/api

Laravel (.env)
DB_DATABASE=your_db
DB_USERNAME=root
DB_PASSWORD=

#!/usr/bin/env node
// Validates data/content.json so a bad merge or typo can't take the site down.
// Run locally with: node scripts/validate-content.js
'use strict';

const fs = require('fs');
const path = require('path');

// Keep these lists in sync with CATEGORIES / STRATEGIES / EXECUTIVE_FUNCTIONS /
// DEPARTMENTS in js/app.js. CI failing here after adding a new category is
// intentional friction: update both places together.
const CATEGORIES = [
  'essential-reading', 'apple-classroom', 'google-workspace', 'ai-tools',
  'general-tips', 'apps-social-media', 'learning-resource-hub', 'reading',
  'pupil-tech-tips', 'goodnotes'
];
const TYPES = ['video', 'pdf', 'gdoc', 'image', 'link', 'app-info'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const STRATEGIES = [
  'Adaptive Teaching', 'Formative Assessment', 'Retrieval Practice',
  'Extended Thinking', 'Feedback & Marking', 'Scaffolding',
  'Collaborative Learning', 'Dual Coding', 'Metacognition', 'Classroom Management'
];
const EXECUTIVE_FUNCTIONS = ['Sustained Attention', 'Working Memory', 'Cognitive Flexibility'];
const DEPARTMENTS = [
  'All Departments', 'Sciences', 'English', 'Humanities',
  'Creative Arts', 'Mathematics', 'Languages'
];

const file = path.join(__dirname, '..', 'data', 'content.json');
const errors = [];

let data;
try {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (e) {
  console.error(`content.json is not valid JSON: ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(data) || data.length === 0) {
  console.error('content.json must be a non-empty array');
  process.exit(1);
}

const ids = new Set();
data.forEach((item, idx) => {
  const where = `entry ${idx} (${item && item.id ? item.id : 'no id'})`;
  const err = (msg) => errors.push(`${where}: ${msg}`);

  if (!item || typeof item !== 'object') return err('not an object');

  // id
  if (!item.id || typeof item.id !== 'string') err('missing string "id"');
  else {
    if (ids.has(item.id)) err('duplicate id');
    ids.add(item.id);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.id)) err('id must be kebab-case');
  }

  // required strings
  for (const field of ['title', 'description']) {
    if (!item[field] || typeof item[field] !== 'string') err(`missing string "${field}"`);
  }

  // type / category
  if (!TYPES.includes(item.type)) err(`unknown type "${item.type}"`);
  if (!CATEGORIES.includes(item.category)) err(`unknown category "${item.category}"`);

  // a resource must be openable somehow (app-info entries render inline)
  if (item.type !== 'app-info' && !item.driveFileId && !item.externalUrl && !item.youtubeId) {
    err('needs driveFileId, externalUrl or youtubeId');
  }

  // dateAdded
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.dateAdded || '') || isNaN(Date.parse(item.dateAdded))) {
    err(`invalid dateAdded "${item.dateAdded}" (expected YYYY-MM-DD)`);
  }

  // optional enums / shapes
  if (item.difficulty && !DIFFICULTIES.includes(item.difficulty)) {
    err(`unknown difficulty "${item.difficulty}"`);
  }
  if (item.tags && (!Array.isArray(item.tags) || item.tags.some((t) => typeof t !== 'string'))) {
    err('tags must be an array of strings');
  }
  (item.strategies || []).forEach((s) => {
    if (!STRATEGIES.includes(s)) err(`unknown strategy "${s}"`);
  });
  (item.executiveFunctions || []).forEach((ef) => {
    if (!EXECUTIVE_FUNCTIONS.includes(ef)) err(`unknown executive function "${ef}"`);
  });
  (item.departments || []).forEach((d) => {
    if (!DEPARTMENTS.includes(d)) err(`unknown department "${d}"`);
  });
  if (item.series && typeof item.seriesOrder !== 'number') {
    err('series entries need a numeric seriesOrder');
  }
});

if (errors.length) {
  console.error(`content.json validation failed with ${errors.length} error(s):\n`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log(`content.json OK — ${data.length} entries, ${ids.size} unique ids`);

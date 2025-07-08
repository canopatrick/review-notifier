#!/usr/bin/env node

const axios = require('axios');
const notifier = require('node-notifier');
const path = require('path');
const iconPath = path.join(__dirname, 'new-review-icon.png');

const { GITHUB_TOKEN, GITHUB_ORG } = process.env;
const POLL_INTERVAL = 60 * 1000; // 1 minute

if (!GITHUB_TOKEN) {
  console.log('GITHUB_TOKEN missing from environment.');
  process.exit(1);
}

const seenPRs = new Set();

// If you use your Github account with other organizations, you may want to set
// GITHUB_ORG in your environment in order to limit matches.
//
// const url = `https://api.github.com/search/issues?q=org:${GITHUB_ORG}+is:open+is:pr+assignee:@me+archived:false+draft:false+-in:queue+`;
const SEARCH_URL = `https://api.github.com/search/issues?q=is:open+is:pr+assignee:@me+archived:false+draft:false+-in:queue+`;

async function fetchPRs() {
  const res = await axios.get(SEARCH_URL, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'review-notifier'
    }
  });
  return res.data.items || [];
}

async function checkForNewPRs() {
  try {
    const prs = await fetchPRs();
    prs.forEach(pr => {
      if (!seenPRs.has(pr.id)) {
        console.log('Found PR', pr.title, pr.html_url);
        notifier.notify({
          title: 'New PR Assigned to You',
          message: pr.title,
          open: pr.html_url,
          icon: iconPath, // this doesn't seem to work in Sequoia
          contentImage: iconPath,
          wait: true,
          sound: true,
        });
        seenPRs.add(pr.id);
      }
    });
  } catch (err) {
    console.error('Error fetching PRs:', err.response.data);
  }
}

console.log('Watching for assigned pull requests...');

setInterval(checkForNewPRs, POLL_INTERVAL);
checkForNewPRs();

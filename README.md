# Simple Assigned Pull Request Watcher

This uses [node-notifier](https://github.com/mikaelbr/node-notifier) which technically supports multiple platforms; on macOS, there seem to be some issues, and many of its features don't work. Nevertheless, it should notify you within a minute of a PR being assigned to you by way of a platform-specific notification. Not tested on anything but macOS Sequoia 15.5.

Duplicates are not presently persisted between sessions.

## Prerequisites

Ensure `GITHUB_TOKEN` is set in your shell's environment.

## Installation

npm install

## Running
 
npm run watch

> [!NOTE]
> Eventually this will run out of memory and will abort or may abort of other reasons. For now, just restart it.

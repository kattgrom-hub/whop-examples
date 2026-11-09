---
name: pr-review
description: Perform a structured code review on a GitHub pull request and prepare a summary comment. Use when asked to review a specific PR or to list and review open PRs.
---

# PR Review

You are an expert code reviewer. Perform a thorough, constructive, actionable review.

## Step 1: Identify the target PR

- If the user specifies a PR number or URL, inspect that PR.
- If the user asks to review open PRs, list open PRs first and ask the user which one to review.
- Do not guess which PR the user means.

## Step 2: Gather context (read operations)

Before writing feedback, gather as much of this context as the available GitHub integration supports:

- Pull request metadata and full diff / changed-file patches.
- Existing review submissions.
- Existing top-level comments and inline review threads.
- CI status and individual check results for the PR's head commit.

Use the available integration's equivalent operations. If an operation is unavailable or access is denied, say so rather than claiming it was checked.

## Step 3: Analyze the code

Review the changes for:

- **Correctness:** logic errors, edge cases, regressions, error handling.
- **Security:** authorization, secrets, injection, unsafe input handling, webhook signature verification, and exposure of sensitive data.
- **Reliability:** retries, idempotency, concurrency, and failure modes.
- **Performance:** unnecessary work, expensive queries, and avoidable resource use.
- **Readability:** naming, structure, and maintainability.
- **Consistency:** project conventions and tests.
- **Testing:** missing coverage for changed behavior and important edge cases.

Prioritize findings by severity. Explain why each issue matters and give a concrete suggested fix. Distinguish confirmed defects from questions or suggestions. Do not invent findings or claim tests were run unless they actually were.

## Step 4: Prepare one consolidated review

Prepare a single review with these sections:

- **Summary:** one short paragraph describing the change and overall assessment.
- **Critical issues:** actionable bugs or security flaws, or “None found.”
- **Suggestions:** improvements and testing recommendations.
- **Positive notes:** good patterns worth preserving.
- **Checklist:** any specific items to address before merging, when useful.

Avoid duplicating feedback already clearly resolved in existing discussions. Do not post multiple inline comments; consolidate findings into one review body.

## Safety and confirmation (mandatory)

- **Never post a review without explicit user approval.**
- First present the complete proposed review in chat and ask exactly: “I've prepared a review. Would you like me to post it to PR #<number>?”
- Only after an explicit affirmative response to that specific question may you submit the review.
- Use the neutral `COMMENT` event unless the user explicitly asks for `APPROVE` or `REQUEST_CHANGES`.
- Do not approve, request changes, merge, or modify the pull request unless specifically authorized.
- If the user does not approve posting, keep the review as a draft in chat.

---
status: testing
phase: 42-painel-administrativo-de-assinaturas-single-admin
source: [42-SUMMARY.md]
started: 2026-07-15T00:23:00Z
updated: 2026-07-15T00:23:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 3
name: Subscribers Tab - Search & Filter
expected: |
  On the "Assinantes" tab, searching by name/e-mail or filtering by status successfully updates the paginated table of subscribers.
awaiting: user response

## Tests

### 1. Admin Menu Link Visibility
expected: When logged in as an admin, the sidebar/header displays a "Painel Admin" link with a shield icon. This link should NOT be visible to regular users.
result: pass

### 2. Dashboard Metrics Cards
expected: Navigating to the Admin Subscriptions page displays 4 metrics cards at the top (Ativos, Trial, Expirados, Receita PIX). The values should load successfully from the backend.
result: pass

### 3. Subscribers Tab - Search & Filter
expected: On the "Assinantes" tab, searching by name/e-mail or filtering by status successfully updates the paginated table of subscribers.
result: pass

### 4. Subscribers Tab - Manual Access Override
expected: Clicking to edit a user's access opens a modal. Changing the access (e.g., adding days, granting lifetime, forcing expire) requires filling out a mandatory "notes" field and successfully updates the user's status.
result: pass

### 5. PIX Transactions Tab
expected: Switching to the "Transações PIX" tab displays a paginated table of payment history, which can be filtered by PIX status, searched by email/name/txid, and sorted by all columns.
result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0

## Gaps

# Architecture

The repository is `cloak`. Cloak is the consumer application and reference implementation, powered by ProofTrade.

ProofTrade is the independent open protocol/library inside the repo. It must remain usable by other apps without depending on Cloak product code, branding, servers, or UI assumptions.

The repository is organized as:

- `mobile`: Expo consumer app.
- `mobile/lib/prooftrade`: TypeScript ProofTrade product-flow scaffold for the app demo.
- `backend/crates/prooftrade-core`: Rust receipt, signing, verification, disclosure, duplicate detection.
- `backend/crates/prooftrade-nostr`: encrypted Nostr message transport.
- `backend/crates/prooftrade-wasm`: web bindings for offline verification.
- `docs`: architecture, protocol, security, and threat model notes.

This repository contains the mobile app and the first Rust protocol implementation under `backend/crates/`. The Rust crates are the intended cryptographic boundary; Expo bindings remain a separate integration task.

The built WASM package lives in `backend/wasm/prooftrade` and exposes JSON functions for receipt commitments and disclosure verification. Web consumers can load it directly; a mobile build should use the same core through a native Rust bridge rather than reimplementing verification in TypeScript.

## Boundary

- `mobile` may use Cloak product language, screens, and brand.
- `backend/crates/prooftrade-*` must not depend on Cloak servers or UI.
- `prooftrade-core` should expose receipt, commitment, state-machine, signing, disclosure, and verification primitives.
- `prooftrade-nostr` should map ProofTrade messages onto existing Nostr mechanisms without making Cloak the authority.

## Data Flow

1. Alice scans or pastes Bob's Cloak identity.
2. Alice sends an encrypted proof request.
3. Bob chooses which receipts and fields to disclose.
4. Alice verifies the disclosure locally.
5. After their own transaction, Alice proposes a receipt.
6. Bob independently reviews and signs.
7. The fully signed receipt is stored privately.

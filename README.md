# Cloak

**Verify trust. Reveal less.**

> Cloak is a mobile proof-of-trade app powered by the independent ProofTrade protocol.

Repository: `github.com/Alkamal01/Cloak`

## The Problem

Online trust is often reduced to names, photos, ratings, or opaque scores. Those signals are easy to copy and difficult to audit. A person should be able to share evidence of real interactions without publishing their entire transaction history or trusting a central reputation provider.

## The Solution

Cloak lets two parties create private, mutually signed receipts for an interaction. A user can share a selected disclosure package with another person, who verifies the receipt locally.

Cloak does not produce a universal trust score. It presents verifiable evidence and lets people decide what that evidence means.

## Hackathon Demo

The current demo shows the core user journey:

1. Create a local Cloak identity.
2. Display the identity as a QR code.
3. Scan another identity QR code.
4. Create a receipt proposal for that counterparty.
5. Store the proposal through the local Rust API.
6. Verify receipt commitments and signatures locally through ProofTrade primitives.

The app is intentionally privacy-first: names and profile data are discovery hints, not proof of identity or behavior.

## Architecture

```text
cloak/
├── mobile/                         Expo / React Native consumer app
├── backend/
│   ├── crates/cloak-api             Local Axum API for the demo
│   ├── crates/prooftrade-core       Independent receipt protocol primitives
│   ├── crates/prooftrade-nostr      Encrypted Nostr transport primitives
│   ├── crates/prooftrade-wasm       Browser/WASM verification boundary
│   └── wasm/prooftrade              Generated WASM package
└── docs/                            Protocol, architecture, security notes
```

The repository and product are named `cloak`. ProofTrade is deliberately independent and must remain usable by other applications without Cloak branding, UI, or backend assumptions.

## Local Setup

Requirements:

- Node.js 20+
- Rust stable and Cargo
- Expo Go SDK 57 for a physical iOS or Android device

Install dependencies:

```bash
cd mobile
npm install
```

Start the local API in one terminal:

```bash
cd backend
cargo run -p cloak-api
```

The API listens on `http://0.0.0.0:8787` and exposes:

- `GET /health`
- `POST /v1/identities`
- `GET /v1/identities/:id`
- `POST /v1/disclosures`
- `GET /v1/disclosures/:recipient`

Start Expo in a second terminal.

For an iOS or Android simulator:

```bash
cd mobile
EXPO_PUBLIC_API_URL=http://127.0.0.1:8787 npx expo start --go --clear
```

For a physical phone, use the computer's LAN IP and keep both devices on the same Wi-Fi network:

```bash
cd mobile
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:8787 npx expo start --go
```

Find the LAN IP on Debian/Linux with:

```bash
hostname -I
```

## Rust Verification

Run the protocol tests:

```bash
cd backend
cargo test --workspace
```

Build the browser verifier:

```bash
cd mobile
npm run build:wasm
```

The Rust workspace tests receipt commitments, tamper detection, Ed25519 signatures, two-party disclosure verification, duplicate detection, and encrypted message round trips.

## Product Principles

- Private by default. Public by choice.
- Receipts are evidence, not ratings.
- Names, photos, and bios are not identity.
- Verification should happen locally.
- Settlement data can support a receipt but cannot prove delivery or honest behavior by itself.

## Current Scope

This is a hackathon submission with a working local vertical slice. The local API currently uses in-memory storage, so restarting it clears identities and disclosures. The next production-hardening steps are durable encrypted storage, real counterparty signing, authenticated transport, relay integration, native Rust bindings for mobile, and security review.

## License

MIT. ProofTrade remains an independent protocol layer inside the Cloak repository.

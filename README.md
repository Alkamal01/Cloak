# Cloak

Cloak is a mobile app for selectively sharing private ProofTrade receipts.

ProofTrade is the protocol layer. Cloak is the consumer product built on top of it.

## Repository Layout

```text
.
├── mobile/   # Expo / React Native app
├── backend/  # Rust ProofTrade workspace, WASM output, contract artifacts
└── docs/     # Architecture, protocol, security, and threat model notes
```

## Mobile App

The mobile app lives in `mobile/`.

```bash
cd mobile
npm install
npm start
```

Run on a target from the Expo CLI, or directly:

```bash
npm run ios
npm run android
npm run web
```

## Backend

The backend/protocol workspace lives in `backend/`.

```bash
cd backend
cargo test
```

The Rust workspace currently contains:

- `crates/prooftrade-core`: receipt commitments, signing, verification, disclosure, and duplicate detection primitives.
- `crates/prooftrade-nostr`: encrypted Nostr transport primitives.
- `crates/prooftrade-wasm`: web bindings for local verification.

To rebuild the WASM package from the mobile project:

```bash
cd mobile
npm run build:wasm
```

## Product Notes

- Private by default. Public by choice.
- Receipts are evidence, not ratings.
- Names, photos, and bios are not identity.
- Verification should happen locally without trusting a Cloak server.

The current app-layer verifier is an MVP bridge for demonstration. Security-critical verification should stay in the Rust ProofTrade crates before production use.

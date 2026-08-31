<div align="center">

<img src="./docs/brand/logo-icon.png" alt="SaruPol Icon" width="90" /> <img src="./docs/brand/logo-text.png" alt="සරුපොල් (SaruPol)" width="400" />

### 🌴 සරුපොල් (SaruPol) — Unified Web & Research Intelligence Platform
**Enterprise Multi-Tier AI & IoT Decision Support Dashboard for Sri Lankan Coconut Plantations**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.24-black.svg?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebAssembly Edge AI](https://img.shields.io/badge/Edge_AI-TFLite_WASM-FF6F00.svg?logo=tensorflow&logoColor=white)](https://www.tensorflow.org/lite)
[![Status](https://img.shields.io/badge/Status-Production%20Live-brightgreen.svg)](https://saru-pol-web.vercel.app/)

</div>

---

## 📖 Overview

**SaruPol-Web** is the unified web intelligence console for the **සරුපොල් (SaruPol)** Smart Coconut Ecosystem. Built on **Next.js 15 (App Router)**, **React 19**, and **Framer Motion**, it delivers an enterprise-grade dark telemetry interface with client-side WebAssembly INT8 Edge AI inference, georeferenced GIS canopy mapping, agronomic fertilizer calculators, and multi-LLM consensus advisory chat.

### 🌟 Core Modules
1. **🌿 Soil Intelligence (`/soil`)**: Spatial 3-point sensor triangulation calculating 14th frond leaf NPK and differential fertilizer dosages (Urea, ERP, MOP, Dolomite) based on CRI guidelines.
2. **🔬 Pathology Diagnostic Lab (`/pathology`)**: Dual-tier surveillance suite:
   - **System A**: UAV drone spectral pipeline calculating VARI, NDVI, and ExG canopy segmentation with DBSCAN anomaly clustering.
   - **System B**: In-browser client-side WebAssembly Edge AI leaf pathology diagnostics with INT8 quantization (<35ms inference) and Shannon Entropy OOD gating.
3. **📈 SaruPol Yield Forecaster (`/yield`)**: Hybrid Random Forest ($R^2=0.98$) and LSTM ($R^2=0.86$) ensemble model forecasting 45-day harvest cycles.
4. **💬 Agronomist Advisory AI (`/advisory`)**: Multi-LLM consensus RAG engine grounded in official Coconut Research Institute (CRI) literature supporting Sinhala, Tamil, and English.
5. **🗺️ Field Operations & GIS (`/operations`)**: Georeferenced digital twin map interface for tree inventory, canopy stress hotspots, and field inspection scheduling.

---

## 🏛️ System Architecture

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │      සරුපොල් (SaruPol) Web Application Console        │
                                  │             (Next.js 15 / React 19 / WASM)             │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │
                                       ┌──────────────────────┴──────────────────────┐
                                       │ HTTPS REST API                              │ Client-Side Edge AI
                                       ▼                                             ▼
                        ┌──────────────────────────────┐              ┌──────────────────────────────┐
                        │       SaruPol-Gateway        │              │    TFLite WASM Engine        │
                        │   (Google Cloud Run: Asia)   │              │  (MobileNetV2 INT8 Quant)    │
                        └──────────────┬───────────────┘              │  • Sub-35ms In-Browser Run   │
                                       │                              │  • Shannon Entropy OOD Gate  │
              ┌────────────────────────┼────────────────────────┐     │  • Client IndexedDB Offline  │
              │                        │                        │     └──────────────────────────────┘
              ▼                        ▼                        ▼
  ┌───────────────────────┐  ┌───────────────────┐  ┌───────────────────────┐
  │   Pathology Service   │  │   Soil & Yield    │  │   Advisory RAG AI     │
  │ (Google Cloud Run /   │  │ (FastAPI Services)│  │ (Multi-LLM Consensus) │
  │ Firebase Serverless)  │  └───────────────────┘  └───────────────────────┘
  └───────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x`
- **npm** or **pnpm**

### Installation
```bash
git clone https://github.com/R26-SE-016/SaruPol-Web.git
cd SaruPol-Web
npm install
```

### Environment Configuration
Create a `.env.local` file:
```env
NEXT_PUBLIC_GATEWAY_URL=https://sarupol-gateway-636168956069.asia-south1.run.app
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🌴 Brand Assets

The official brand vector and typography marks are stored in [`docs/brand/`](./docs/brand/):
- **Logo Icon**: `docs/brand/logo-icon.png` (Luxury gold linear coconut palm tree icon)
- **Logo Text**: `docs/brand/logo-text.png` (3D embossed gold metallic Sinhala script mark)

---

## 📄 License & Attribution
Developed for the **Sri Lankan Coconut Research Initiative** · 2026.
Grounded in circulars and agronomic standards published by the **Coconut Research Institute (CRI) of Sri Lanka**.

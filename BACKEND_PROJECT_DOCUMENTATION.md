# 🚀 Backend Project Documentation: AirTac / SOS-Game Platform

---

## 📌 Executive Summary
**AirTac (SOS Game Platform)** is a real-time, interactive multi-game platform featuring P2P WebRTC multiplayer, Computer Vision gesture tracking (MediaPipe), and automated cloud integrations via Serverless API routes. 

As a **Backend / Systems Engineer**, the focus was on architecture design, real-time peer communication, secure cloud service integration, serverless API design, state synchronization, and environment security.

---

## 🛠️ Tech Stack & Key Technologies

| Domain | Technology / Tool |
| :--- | :--- |
| **Framework & Server Logic** | Next.js (Node.js API Runtime) |
| **Real-Time P2P Networking** | WebRTC (DataChannel API via PeerJS Signaling) |
| **Cloud Services & APIs** | Google Cloud APIs (`googleapis` SDK, Service Accounts) |
| **Machine Learning / Vision Engine** | MediaPipe Tasks Vision (Client-Side Pipeline Integration) |
| **Security & Auth** | OAuth 2.0 / Service Account JWT, RSA/PEM Key Sanitization |
| **Deployment & Hosting** | Serverless Architecture (Node.js Runtime) |

---

## 🏗️ Backend System Architecture

```
                                +---------------------------+
                                |      Client (Browser)     |
                                +-------------+-------------+
                                              |
                     +------------------------+------------------------+
                     |                                                 |
         [Real-Time P2P Channel]                              [HTTPS REST API]
                     |                                                 |
                     v                                                 v
        +-------------------------+                       +-------------------------+
        |   PeerJS Signaling &    |                       | Next.js API Routes      |
        |   WebRTC DataChannel    |                       | (Node.js Runtime)       |
        +------------+------------+                       +------------+------------+
                     |                                                 |
         State Sync & Move Updates                         Google Cloud OAuth 2.0 / JWT
                     |                                                 |
                     v                                                 v
        +-------------------------+                       +-------------------------+
        | Dual Client State Sync  |                       | Google Sheets API v4    |
        +-------------------------+                       +-------------------------+
```

---

## ⚙️ Core Backend Responsibilities & Features Implemented

### 1. Serverless API Architecture & Cloud Integrations
- **Serverless REST Endpoints**: Built modular Next.js API routes configured explicitly for the `nodejs` runtime environment to support server-side SDK execution.
- **Google Cloud Platform Integration**: Integrated `googleapis` v4 to process user feedback, error logs, and telemetry directly into cloud storage via service accounts.
- **Cryptographic Auth & Key Sanitization**: Implemented robust RSA PEM key parsing and sanitization logic to handle escaped newline characters (`\n`) and quotes in environment configs seamlessly.

### 2. Real-Time Peer-to-Peer Networking (WebRTC)
- **Peer-to-Peer State Synchronization**: Architected low-latency game state synchronization over WebRTC DataChannels using PeerJS signaling servers.
- **Conflict Resolution & Turn Handling**: Designed state validation logic to prevent out-of-order move execution, double-submits, and desynchronization over lossy or latency-prone network connections.
- **Connection Handshake & Reconnection**: Managed peer lifecycle events (`open`, `connection`, `data`, `close`, `error`) to gracefully recover from peer disconnects.

### 3. API Security & Data Integrity
- **Zero-Trust Input Validation**: Enforced strict request body validation on server endpoints to filter out malformed payloads before invoking external SDKs.
- **Granular Exception Handling & Error Boundaries**: Isolated external integration failures (e.g., Google API permission errors, missing credentials) and translated them into clean, structured HTTP responses (`400`, `500`).
- **Environment Confidentiality**: Ensured complete isolation of service account credentials (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`).

---

## 📡 API Reference & Specifications

### `POST /api/feedback`
Submits user feedback securely to backend cloud infrastructure.

- **Runtime**: `nodejs`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "feedback": "Great real-time game experience!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Feedback saved to Google Sheets!"
  }
  ```
- **Response (400 / 500 Error)**:
  ```json
  {
    "success": false,
    "message": "Authentication failed. Please check server configuration."
  }
  ```

---

## 🎯 Technical Challenges & Solutions Overcome

| Challenge | Solution Implemented |
| :--- | :--- |
| **Serverless Key Formatting Bottleneck**: Multiline PEM RSA keys breaking in environment variables (`.env`). | Engineered a string sanitization routine using REGEX to replace escaped `\n` characters dynamically at runtime before Google JWT signing. |
| **High Latency in Multiplayer Games**: Centralized server polling introduces lag and server cost. | Switched to a WebRTC P2P DataChannel architecture, bypassing server hops entirely for zero-latency move sync. |
| **Edge vs Node.js Compatibility**: Next.js Edge runtime failing on native Node libraries like `googleapis`. | Explicitly declared `export const runtime = "nodejs"` on serverless handlers requiring full Node.js API support. |

---

# 🎤 Interview Cheat-Sheet & Pitch Guide

## ⏱️ 45-Second Elevator Pitch (What to Say in an Interview)

> *"In my latest project, **AirTac**, I worked as a Backend Developer building a real-time interactive game platform. My core focus was architecting **low-latency P2P multiplayer networking** and **serverless backend services**.*
> 
> *To eliminate server infrastructure costs and latency, I integrated **WebRTC DataChannels with PeerJS** for direct peer-to-peer state synchronization and turn validation. On the backend, I built **Next.js Node.js serverless API routes** that securely interface with **Google Cloud Services** using OAuth 2.0 Service Account JWT authentication for telemetry and feedback logging.*
> 
> *I also handled key backend challenges like runtime key sanitization, input validation, and graceful fallback handling under unstable network conditions."*

---

## ❓ Frequently Asked Interview Questions & Responses

### Q1: Why did you choose WebRTC / P2P over WebSockets for multiplayer?
> **Answer**: *"WebSockets require all game state traffic to bounce through a central server, which increases latency, bandwidth costs, and server load. Since our game is turn-based/real-time 1v1, WebRTC DataChannels allow peers to send binary/JSON messages directly to each other (Peer-to-Peer) with virtually zero server latency once the initial signaling handshake is complete."*

### Q2: How did you secure your API routes and cloud credentials?
> **Answer**: *"I used Google Cloud Service Accounts with scoped IAM permissions rather than user credentials. Environment secrets like the RSA private key were injected safely into serverless environment variables. On the API level, I implemented zero-trust request payload validation and wrapped all external SDK interactions in try-catch blocks with explicit HTTP status reporting."*

### Q3: How did you handle edge cases like player disconnects in WebRTC?
> **Answer**: *"PeerJS fires native lifecycle events (`close`, `error`, `disconnected`). I created state handlers on the backend logic layer that detect connection loss, freeze game input, attempt an automatic ICE restart or handshake re-connection, and if unrecoverable, clean up session memory and announce the winner/draw."*

---

## 💡 Key Takeaways to Emphasize in Interviews
1. **Systems Thinking**: Choosing P2P (WebRTC) vs WebSockets based on cost & latency requirements.
2. **Cloud Security**: Experience with OAuth 2.0, Service Account authentication, and environment key management.
3. **Serverless Architecture**: Understanding Node.js vs Edge runtimes in modern full-stack backend frameworks (Next.js).

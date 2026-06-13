# 🚨 Lifeline: Autonomous Disaster Response & Community Alert Network

## Problem Statement

During disasters, roads become inaccessible, communication channels fail, emergency resources are delayed, and affected communities often receive critical information too late.

Most disaster management systems focus on monitoring events.

**Lifeline focuses on autonomous response.**

Instead of only identifying problems, Lifeline automatically determines what actions should be taken, how resources should be allocated, how routes should be recalculated, and how communities should be alerted.

---

# 🌍 What is Lifeline?

Lifeline is an AI-driven disaster response network that autonomously:

* Detects disaster scenarios
* Recalculates logistics routes
* Prioritizes affected locations
* Dispatches emergency resources
* Generates operational decisions
* Alerts affected communities through physical alert nodes

The system combines software intelligence with hardware-based community alerting to create an end-to-end disaster response ecosystem.

---

# ✨ Key Innovation

Traditional systems answer:

> "What is happening?"

Lifeline answers:

> "What should we do next?"

By integrating autonomous decision-making, route optimization, resource allocation, and last-mile public alerting, Lifeline transforms disaster intelligence into disaster action.

---

# 🏗 System Architecture

```text
Disaster Event
       ↓
Autonomous Decision Engine
       ↓
Route Recalculation
       ↓
Resource Allocation
       ↓
Agent Dispatch
       ↓
Command Dashboard
       ↓
ESP32 Alert Node
       ↓
LED + Voice Alerts
```

---

# 🚀 Core Features

## 🛣 Dynamic Route Recalculation

Road blockages caused by floods, infrastructure failures, or disasters trigger automatic route recalculation.

Alternative paths are generated without manual intervention.

---

## 🚑 Autonomous Resource Allocation

Lifeline prioritizes camps and affected regions based on:

* Demand
* Accessibility
* Resource availability

This enables more effective deployment of limited emergency resources.

---

## 🤖 Agent-Based Decision Engine

Emergency resources are modeled as autonomous agents:

* Vehicles
* Ambulances
* Supply Trucks

Each agent receives dynamically generated actions based on operational priorities.

---

## 📊 Real-Time Command Dashboard

The dashboard provides:

* Live disaster visualization
* Route monitoring
* Resource tracking
* Fleet management
* Event logging
* Hardware node monitoring

---

## 📢 Last-Mile Community Alert Node

Internet connectivity and dashboard access cannot be assumed in disaster-hit regions.

Lifeline therefore includes an ESP32-powered alert node that acts as the final communication layer between the autonomous response engine and affected communities.

The node provides:

* Visual LED alerts
* Voice-based emergency announcements
* Local warning notifications

This enables critical alerts to reach affected populations even during communication failures.

---

# 🔌 Hardware Prototype

## Components

* ESP32 Development Board
* ISD1820 Voice Playback Module
* Status LEDs
* Breadboard Prototype
* Community Alert Node

## Alert States

| LED       | Meaning               |
| --------- | --------------------- |
| 🟢 Green  | System Operational    |
| 🟡 Yellow | Disaster Alert Active |
| 🔴 Red    | Critical Emergency    |
| 🔵 Blue   | Network Connected     |

---

# 🧠 Technology Stack

## Backend

* Python
* FastAPI
* NetworkX

## Frontend

* Next.js
* React
* TypeScript

## Hardware

* ESP32
* ISD1820 Voice Module

---

# 📂 Repository Structure

```text
lifeline/
│
├── lifeline-backend/
│
├── lifeline-frontend/
│
├── hardware/
│   └── Lifeline_Alert_Node/
│
└── README.md
```

---

# ⚙️ Running the Project

## 1. Clone Repository

```bash
git clone <repository-url>
cd lifeline
```

---

## 2. Run Backend

Navigate to backend:

```bash
cd lifeline-backend
```

Create virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend server:

```bash
uvicorn main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Run Frontend

Open a new terminal:

```bash
cd lifeline-frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

## 4. Test Disaster Response Simulation

1. Launch backend
2. Launch frontend
3. Open dashboard
4. Trigger disaster scenarios:

   * Flood
   * Bridge Collapse
   * Supply Failure
5. Observe:

   * Route recalculation
   * Agent reassignment
   * Resource allocation updates
   * Event log generation
   * Hardware status updates

---

# 📑 Hardware Documentation

Hardware files are available in:

```text
hardware/Lifeline_Alert_Node/
```

Contents:

* KiCad Project
* Schematic Files
* PCB Files
* Hardware PDF Documentation

---

# 🔮 Future Roadmap

## LoRa Mesh Communication

Enable resilient node-to-node communication during internet outages.

## Autonomous Field Vehicles

Support autonomous emergency vehicles capable of executing dispatch instructions in real-world deployments.

## Multi-Node Alert Infrastructure

Deploy interconnected alert nodes across affected regions for wider coverage.

## Predictive Disaster Analytics

Use historical and real-time data to anticipate disruptions before they occur.

---

# 🌟 Impact

Lifeline bridges the gap between disaster intelligence and disaster action.

By combining autonomous decision-making, resource optimization, route adaptation, and last-mile community alerting, Lifeline helps ensure that critical assistance and life-saving information reach affected populations as quickly as possible.

---

## Team Lifeline

Building resilient, adaptive, and community-centric disaster response systems.
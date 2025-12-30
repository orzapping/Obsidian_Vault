
# AnthroSynth – SDK & API Concept
*Version: 0.1 | Date: 2025-07-01*

---

## 🔹 Overview

The AnthroSynth SDK/API layer provides a bridge between the AnthroSynth Runtime Engine and external applications, enabling developers to:

- Embed behavioural capture prompts in their own systems.
- Extend AnthroSynth’s runtime via new plug-in modules.
- Query and interact with the VANTAGE dataset.
- Build adaptive UIs driven by emotional/contextual signals.

---

## 🔹 SDK Goals

| Goal                          | Description                                                       |
|------------------------------|-------------------------------------------------------------------|
| **Plug-in Simplicity**       | Simplify schema creation & validation for plug-in modules.        |
| **Front-End Interactivity**  | Allow injection of prompts/trackers via React/Vanilla hooks.      |
| **Back-End Utility**         | Provide programmatic access to VANTAGE dataset.                   |
| **Modular Deployment**       | Support web SDK, CLI tools, and serverless endpoint variants.     |

---

## 🔹 SDK Modules

### 1. `SchemaBuilder`
- Helper functions for building and validating schema objects.
- Converts YAML/JSON to runtime-compatible format.
- Auto-generates UUIDs and default config stubs.

### 2. `PromptHooks`
- Frontend UI components (React/Vue/HTML5) for:
  - Sliders
  - Text inputs
  - Rating selectors
  - Alert modals

### 3. `EventLogger`
- Captures timestamped decisions + signal metadata.
- Local caching and queued upload when offline.

### 4. `ContextManager`
- Reads app state and user roles from host.
- Allows context injection from host environment.

---

## 🔹 API Endpoints

### ✅ Core RESTful API

| Method | Endpoint                            | Description                                |
|--------|-------------------------------------|--------------------------------------------|
| `GET`  | `/schemas/list`                     | List available schemas                     |
| `POST` | `/schemas/register`                 | Upload and register new schema             |
| `POST` | `/vantage/record`                   | Submit behavioural event                   |
| `GET`  | `/vantage/query?tags=risk+emotion`  | Retrieve filtered behavioural records      |
| `GET`  | `/vantage/user-history/:user_id`    | Query user-specific history                |

---

## 🔹 Security

- JWT-based auth for secure data interaction
- Schema upload permission system
- Anonymised user IDs enforced at SDK level

---

## 🔹 Deployment Options

| SDK Package        | Use Case                        |
|--------------------|----------------------------------|
| `npm`              | Web apps, React/Vue integrations |
| `Python` SDK       | Data pipelines, research use     |
| `CLI` Binary       | Scripting, headless capture      |
| `Docker Image`     | API server deployment            |

---

## 🔹 Future Tools

- [ ] Schema Visual Builder (drag-and-drop prompt composer)
- [ ] WebSocket feed for live capture
- [ ] Browser extension for lightweight plug-and-play mode

---

## 📦 Sample Code Snippet

```js
import { usePromptSlider } from 'anthrosynth-sdk';

const ConfidencePrompt = () => {
  const { value, onChange } = usePromptSlider({
    id: 'confidence_rating',
    label: 'How confident are you?',
    range: [0, 10],
    default: 5
  });

  return <Slider value={value} onChange={onChange} />;
};
```

---

## 🚀 Roadmap

- `v0.1`: Basic REST + PromptHooks/Logger
- `v0.2`: Full SDK with plug-in validator
- `v0.3`: CLI tools + schema visual builder

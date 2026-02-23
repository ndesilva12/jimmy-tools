# The Complete OpenClaw Setup Guide
## From Zero to Your Own AI Assistant

**By Jimmy Tools**  
**Version 1.0 | February 2026**

---

## Table of Contents

1. [What is OpenClaw?](#what-is-openclaw)
2. [System Requirements](#system-requirements)
3. [Installation](#installation)
4. [The Onboarding Wizard](#the-onboarding-wizard)
5. [Setting Up Channels](#setting-up-channels)
6. [Verification & Testing](#verification--testing)
7. [Common Issues & Solutions](#common-issues--solutions)
8. [Advanced Configuration](#advanced-configuration)
9. [Next Steps](#next-steps)

---

## What is OpenClaw?

OpenClaw is an open-source platform that lets you run your own AI assistant. Unlike ChatGPT or Claude.ai, OpenClaw runs locally on your machine and can:

- **Connect to messaging apps** — Telegram, WhatsApp, Discord, Signal, iMessage, and more
- **Execute code and scripts** — Run Python, access files, automate tasks
- **Browse the web** — Search, fetch pages, control browsers
- **Access your tools** — Calendar, email, databases, APIs
- **Work autonomously** — Background tasks, scheduled jobs, proactive notifications

Think of it as giving Claude or GPT "hands and feet" to actually do things, not just answer questions.

### Why Use OpenClaw?

| Feature | ChatGPT/Claude.ai | OpenClaw |
|---------|-------------------|----------|
| Runs locally | ❌ | ✅ |
| Persistent memory | Limited | ✅ Full file-based |
| Executes code | ❌ | ✅ |
| Messaging integration | ❌ | ✅ |
| Custom tools/skills | ❌ | ✅ |
| Works offline | ❌ | Partial |
| Data stays private | ❌ | ✅ |

---

## System Requirements

### Hardware
- **RAM:** 4GB minimum, 8GB+ recommended
- **Storage:** 2GB free space for OpenClaw + dependencies
- **Network:** Internet connection for AI API calls

### Software

| Platform | Requirements |
|----------|-------------|
| **macOS** | macOS 12+ (Monterey or later) |
| **Linux** | Ubuntu 20.04+, Debian 11+, or equivalent |
| **Windows** | Windows 10/11 with WSL2 (strongly recommended) |

### Node.js Requirement

OpenClaw requires **Node.js 22 or newer**.

Check your current version:
```bash
node --version
```

If you don't have Node.js or have an older version, the installer will handle it.

---

## Installation

### Method 1: Installer Script (Recommended)

The easiest way to install OpenClaw. One command handles everything.

#### macOS / Linux / WSL2

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

#### Windows (PowerShell as Administrator)

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

**What the installer does:**
1. Checks for Node.js 22+ (installs if missing)
2. Installs OpenClaw globally via npm
3. Launches the onboarding wizard

---

### Method 2: Manual npm Install

If you already have Node.js 22+ and prefer manual control:

```bash
# Install OpenClaw
npm install -g openclaw@latest

# Run onboarding
openclaw onboard --install-daemon
```

#### Troubleshooting: sharp build errors

If you see errors about `sharp` or `node-gyp`:

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

---

### Method 3: Using pnpm

```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g    # Approve build scripts when prompted
openclaw onboard --install-daemon
```

---

### Windows-Specific Instructions

**We strongly recommend using WSL2 on Windows.**

#### Installing WSL2

1. Open PowerShell as Administrator
2. Run:
   ```powershell
   wsl --install
   ```
3. Restart your computer
4. Open "Ubuntu" from the Start menu
5. Create a username and password when prompted
6. Now run the Linux installer:
   ```bash
   curl -fsSL https://openclaw.ai/install.sh | bash
   ```

#### Why WSL2?
- Full Linux compatibility
- Better performance
- Fewer permission issues
- Easier troubleshooting

---

## The Onboarding Wizard

After installation, the onboarding wizard guides you through setup.

```bash
openclaw onboard --install-daemon
```

### Step 1: Choose Setup Mode

```
? Setup mode
  ❯ QuickStart (recommended defaults)
    Advanced (full control)
```

**QuickStart** is recommended for most users. It uses sensible defaults.

### Step 2: Authentication

The wizard asks how to authenticate with AI providers.

```
? Primary model provider
  ❯ Anthropic (Claude)
    OpenAI (GPT-4)
    Other
```

#### Anthropic (Recommended)

You'll need an Anthropic API key:

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy and paste it into the wizard

```
? Anthropic API key: sk-ant-api03-xxxxx...
```

#### OAuth Option

If you have a Claude Pro subscription, you can use OAuth instead of an API key:

```
? Auth method
  ❯ API Key
    OAuth (Claude subscription)
```

### Step 3: Workspace

The workspace is where OpenClaw stores agent files, memory, and sessions.

```
? Workspace location
  ❯ ~/.openclaw/workspace (default)
    Custom path
```

The default location works for most users.

### Step 4: Gateway Settings

The Gateway is the background service that runs OpenClaw.

```
? Gateway port: 18789
? Bind address: loopback (localhost only)
? Auth mode: Token (auto-generated)
```

Default settings are secure and work well locally.

### Step 5: Channels (Optional)

Channels let you message your AI through existing apps.

```
? Set up a channel?
  ❯ Skip for now
    Telegram
    WhatsApp
    Discord
    Signal
```

You can add channels later with `openclaw configure`.

### Step 6: Install Daemon

```
? Install as background service? Yes
```

This installs OpenClaw as a system service that starts automatically.

- **macOS:** LaunchAgent
- **Linux:** systemd user unit
- **Windows (WSL2):** systemd

### Step 7: Health Check

The wizard verifies everything works:

```
✓ Gateway started
✓ Config valid
✓ Model connection OK

OpenClaw is ready! Run: openclaw dashboard
```

---

## Setting Up Channels

Channels connect OpenClaw to messaging apps so you can chat with your AI from anywhere.

### Telegram Setup

Telegram is the easiest channel to set up.

#### Step 1: Create a Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Choose a name (e.g., "My Assistant")
4. Choose a username (must end in "bot", e.g., "myassistant_bot")
5. Copy the **API token** BotFather gives you

#### Step 2: Configure OpenClaw

```bash
openclaw configure --section telegram
```

Or edit your config directly:

```bash
nano ~/.openclaw/openclaw.json
```

Add under `channels`:

```json
"telegram": {
  "enabled": true,
  "botToken": "YOUR_BOT_TOKEN_HERE",
  "dmPolicy": "pairing"
}
```

#### Step 3: Restart Gateway

```bash
openclaw gateway restart
```

#### Step 4: Start Chatting

1. Find your bot on Telegram by its username
2. Send `/start`
3. The bot will ask you to pair (security feature)
4. Once paired, you can chat freely!

---

### WhatsApp Setup

WhatsApp requires more setup but works great once configured.

#### Step 1: Enable WhatsApp Channel

```bash
openclaw configure --section whatsapp
```

#### Step 2: Scan QR Code

OpenClaw uses WhatsApp Web protocol. You'll need to scan a QR code:

```bash
openclaw gateway restart
```

A QR code appears in the terminal. Scan it with WhatsApp:
1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Tap "Link a Device"
4. Scan the QR code

#### Step 3: Configure DM Policy

By default, WhatsApp uses allowlist mode (you must approve contacts):

```json
"whatsapp": {
  "enabled": true,
  "dmPolicy": "pairing"
}
```

---

### Discord Setup

#### Step 1: Create a Discord Application

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it and create
4. Go to "Bot" section
5. Click "Add Bot"
6. Under "Token", click "Copy"

#### Step 2: Enable Intents

In the Bot settings, enable:
- Presence Intent
- Server Members Intent
- Message Content Intent

#### Step 3: Configure OpenClaw

```json
"discord": {
  "enabled": true,
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "groupPolicy": "allowlist"
}
```

#### Step 4: Invite Bot to Server

1. Go to OAuth2 → URL Generator
2. Select "bot" scope
3. Select permissions (Send Messages, Read Messages, etc.)
4. Copy the URL and open it
5. Select your server and authorize

---

## Verification & Testing

### Check Gateway Status

```bash
openclaw gateway status
```

Expected output:
```
Service: running
Gateway: ws://127.0.0.1:18789
Probe: ok
```

### Run Health Check

```bash
openclaw doctor
```

This checks for common configuration issues.

### Open the Dashboard

```bash
openclaw dashboard
```

This opens the Control UI in your browser. You can chat directly here without any channel setup.

### Send a Test Message

If you have a channel configured:

```bash
openclaw message send --target YOUR_PHONE_NUMBER --message "Hello from OpenClaw!"
```

---

## Common Issues & Solutions

### Issue: "openclaw: command not found"

**Cause:** The npm global bin directory isn't in your PATH.

**Solution:**

1. Find your npm prefix:
   ```bash
   npm prefix -g
   ```

2. Add to your shell config (~/.zshrc or ~/.bashrc):
   ```bash
   export PATH="$(npm prefix -g)/bin:$PATH"
   ```

3. Reload your shell:
   ```bash
   source ~/.zshrc
   ```

---

### Issue: Gateway won't start

**Check logs:**
```bash
cat /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log
```

**Common fixes:**

1. **Port in use:**
   ```bash
   openclaw gateway --port 18790
   ```

2. **Permission issues:**
   ```bash
   sudo chown -R $(whoami) ~/.openclaw
   ```

3. **Restart the service:**
   ```bash
   openclaw gateway stop
   openclaw gateway start
   ```

---

### Issue: "Model connection failed"

**Cause:** API key invalid or expired.

**Solution:**
1. Verify your API key at the provider's console
2. Update the key:
   ```bash
   openclaw configure --section auth
   ```

---

### Issue: Telegram bot not responding

**Check:**
1. Is the gateway running? `openclaw gateway status`
2. Did you pair? Check for a pairing request in Telegram
3. Check bot token is correct in config

**Reset pairing:**
```bash
openclaw gateway restart
```
Send `/start` to the bot again.

---

### Issue: WhatsApp QR code not appearing

**Solution:**
1. Clear WhatsApp session:
   ```bash
   rm -rf ~/.openclaw/whatsapp
   ```
2. Restart gateway:
   ```bash
   openclaw gateway restart
   ```

---

### Issue: High memory usage

**Solution:** Enable context pruning in config:

```json
"agents": {
  "defaults": {
    "contextPruning": {
      "mode": "cache-ttl",
      "ttl": "1h"
    }
  }
}
```

---

### Issue: npm install errors on macOS

**For sharp/libvips errors:**
```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

**For permission errors:**
```bash
sudo chown -R $(whoami) $(npm prefix -g)/{lib/node_modules,bin,share}
```

---

## Advanced Configuration

### Config File Location

```
~/.openclaw/openclaw.json
```

Edit directly with:
```bash
nano ~/.openclaw/openclaw.json
```

Or use the CLI:
```bash
openclaw configure
```

### Multiple Agents

Create additional agents with separate workspaces:

```bash
openclaw agents add work-assistant
openclaw agents add personal-assistant
```

### Custom Workspace Location

```json
"agents": {
  "defaults": {
    "workspace": "/path/to/custom/workspace"
  }
}
```

### Remote Gateway Access

To access OpenClaw from other devices:

1. Change bind mode:
   ```json
   "gateway": {
     "bind": "lan"
   }
   ```

2. Or use Tailscale:
   ```json
   "gateway": {
     "tailscale": {
       "mode": "serve"
     }
   }
   ```

### Web Search Setup

For the agent to search the web:

1. Get a Brave Search API key from [brave.com/search/api](https://brave.com/search/api/)
2. Add to config:
   ```json
   "tools": {
     "web": {
       "search": {
         "enabled": true,
         "apiKey": "YOUR_BRAVE_API_KEY"
       }
     }
   }
   ```

---

## Next Steps

### Explore Skills

Skills extend what OpenClaw can do:

```bash
openclaw skills list
openclaw skills install weather
```

### Customize Your Agent

Edit the workspace files:
- `SOUL.md` — Agent personality
- `AGENTS.md` — Behavioral instructions
- `TOOLS.md` — Tool configuration notes
- `MEMORY.md` — Long-term memory

### Join the Community

- **Discord:** [discord.com/invite/clawd](https://discord.com/invite/clawd)
- **GitHub:** [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw)
- **Docs:** [docs.openclaw.ai](https://docs.openclaw.ai)

### Get Help

- Run `openclaw doctor` for diagnostics
- Check logs: `/tmp/openclaw/`
- Ask in Discord

---

## Summary

1. **Install:** `curl -fsSL https://openclaw.ai/install.sh | bash`
2. **Onboard:** `openclaw onboard --install-daemon`
3. **Verify:** `openclaw gateway status`
4. **Chat:** `openclaw dashboard`

You now have your own AI assistant running locally. Customize it, connect channels, and make it yours.

---

**Questions? Issues?**

This guide is maintained by Jimmy Tools. For updates and more tools, visit [jimmytools.net](https://jimmytools.net).

*© 2026 Jimmy Tools. All rights reserved.*

# Discord MCP Server

A Model Context Protocol (MCP) server for Discord, enabling Claude to manage Discord servers.

## Quick Setup

### 1. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it
3. Go to "Bot" section and click "Add Bot"
4. Copy the **Bot Token**
5. Enable these Privileged Gateway Intents:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent

### 2. Add Bot to Server

1. Go to "OAuth2" → "URL Generator"
2. Select scopes: `bot`, `applications.commands`
3. Select permissions: `Administrator` (or specific permissions you need)
4. Copy the generated URL and open it to add the bot to your server

### 3. Get Server ID

Right-click your server name → "Copy Server ID"
(Enable Developer Mode in Settings → Advanced if you don't see this option)

### 4. Configure Claude

Add to your `.mcp.json` or Claude settings:

```json
{
  "mcpServers": {
    "discord": {
      "command": "npx",
      "args": ["-y", "discord-mcp"],
      "env": {
        "DISCORD_TOKEN": "your-bot-token",
        "DISCORD_GUILD_ID": "your-server-id"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | Yes | Your Discord bot token |
| `DISCORD_GUILD_ID` | No | Default server ID (can be overridden per-command) |

## Available Tools

### Server
- `get_server_info` - Get detailed server information

### User
- `get_user_id_by_name` - Find user ID by username
- `send_private_message` - Send DM to user
- `edit_private_message` - Edit a DM
- `delete_private_message` - Delete a DM
- `read_private_messages` - Read DM history

### Messages
- `send_message` - Send message to channel
- `edit_message` - Edit a message
- `delete_message` - Delete a message
- `read_messages` - Read channel history
- `add_reaction` - Add emoji reaction
- `remove_reaction` - Remove emoji reaction

### Channels
- `create_text_channel` - Create new text channel
- `delete_channel` - Delete a channel
- `find_channel` - Find channel by name
- `list_channels` - List all channels

### Categories
- `create_category` - Create new category
- `delete_category` - Delete a category
- `find_category` - Find category by name
- `list_channels_in_category` - List channels in category

### Webhooks
- `create_webhook` - Create webhook
- `delete_webhook` - Delete webhook
- `list_webhooks` - List webhooks on channel
- `send_webhook_message` - Send message via webhook

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run built version
npm start
```

## License

MIT

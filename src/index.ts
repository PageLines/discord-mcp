#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { DiscordClient } from './discord-client.js';
import { tools } from './tools.js';

// Get configuration from environment
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!DISCORD_TOKEN) {
  console.error('Error: DISCORD_TOKEN environment variable is required');
  process.exit(1);
}

// Initialize Discord client
const discord = new DiscordClient(DISCORD_TOKEN, DISCORD_GUILD_ID);

// Create MCP server
const server = new Server(
  {
    name: 'discord-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      // Server
      case 'get_server_info':
        result = await discord.getServerInfo(args?.guildId as string);
        break;

      // User
      case 'get_user_id_by_name':
        result = await discord.getUserIdByName(args?.username as string, args?.guildId as string);
        break;
      case 'send_private_message':
        result = await discord.sendPrivateMessage(args?.userId as string, args?.message as string);
        break;
      case 'edit_private_message':
        result = await discord.editPrivateMessage(
          args?.userId as string,
          args?.messageId as string,
          args?.newMessage as string
        );
        break;
      case 'delete_private_message':
        await discord.deletePrivateMessage(args?.userId as string, args?.messageId as string);
        result = { success: true };
        break;
      case 'read_private_messages':
        result = await discord.readPrivateMessages(
          args?.userId as string,
          args?.count ? parseInt(args.count as string, 10) : undefined
        );
        break;

      // Message
      case 'send_message':
        result = await discord.sendMessage(args?.channelId as string, args?.message as string);
        break;
      case 'edit_message':
        result = await discord.editMessage(
          args?.channelId as string,
          args?.messageId as string,
          args?.newMessage as string
        );
        break;
      case 'delete_message':
        await discord.deleteMessage(args?.channelId as string, args?.messageId as string);
        result = { success: true };
        break;
      case 'read_messages':
        result = await discord.readMessages(
          args?.channelId as string,
          args?.count ? parseInt(args.count as string, 10) : undefined
        );
        break;
      case 'add_reaction':
        await discord.addReaction(
          args?.channelId as string,
          args?.messageId as string,
          args?.emoji as string
        );
        result = { success: true };
        break;
      case 'remove_reaction':
        await discord.removeReaction(
          args?.channelId as string,
          args?.messageId as string,
          args?.emoji as string
        );
        result = { success: true };
        break;

      // Channel
      case 'create_text_channel':
        result = await discord.createTextChannel(
          args?.name as string,
          args?.categoryId as string,
          args?.guildId as string
        );
        break;
      case 'delete_channel':
        await discord.deleteChannel(args?.channelId as string, args?.guildId as string);
        result = { success: true };
        break;
      case 'find_channel':
        result = await discord.findChannel(args?.channelName as string, args?.guildId as string);
        break;
      case 'list_channels':
        result = await discord.listChannels(args?.guildId as string);
        break;

      // Category
      case 'create_category':
        result = await discord.createCategory(args?.name as string, args?.guildId as string);
        break;
      case 'delete_category':
        await discord.deleteCategory(args?.categoryId as string, args?.guildId as string);
        result = { success: true };
        break;
      case 'find_category':
        result = await discord.findCategory(args?.categoryName as string, args?.guildId as string);
        break;
      case 'list_channels_in_category':
        result = await discord.listChannelsInCategory(args?.categoryId as string, args?.guildId as string);
        break;

      // Webhook
      case 'create_webhook':
        result = await discord.createWebhook(args?.channelId as string, args?.name as string);
        break;
      case 'delete_webhook':
        await discord.deleteWebhook(args?.webhookId as string);
        result = { success: true };
        break;
      case 'list_webhooks':
        result = await discord.listWebhooks(args?.channelId as string);
        break;
      case 'send_webhook_message':
        await discord.sendWebhookMessage(args?.webhookUrl as string, args?.message as string);
        result = { success: true };
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Discord MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Cleanup on exit
process.on('SIGINT', async () => {
  await discord.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await discord.destroy();
  process.exit(0);
});

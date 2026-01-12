import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Define all tools as a separate module for better testability
export const tools: Tool[] = [
  // Server
  {
    name: 'get_server_info',
    description: 'Get detailed discord server information',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Discord server ID' },
      },
      required: [],
    },
  },

  // User
  {
    name: 'get_user_id_by_name',
    description: "Get a Discord user's ID by username in a guild for ping usage <@id>.",
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'Discord username (optionally username#discriminator)' },
        guildId: { type: 'string', description: 'Discord server ID' },
      },
      required: ['username'],
    },
  },
  {
    name: 'send_private_message',
    description: 'Send a private message to a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Discord user ID' },
        message: { type: 'string', description: 'Message content' },
      },
      required: ['userId', 'message'],
    },
  },
  {
    name: 'edit_private_message',
    description: 'Edit a private message from a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Discord user ID' },
        messageId: { type: 'string', description: 'Specific message ID' },
        newMessage: { type: 'string', description: 'New message content' },
      },
      required: ['userId', 'messageId', 'newMessage'],
    },
  },
  {
    name: 'delete_private_message',
    description: 'Delete a private message from a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Discord user ID' },
        messageId: { type: 'string', description: 'Specific message ID' },
      },
      required: ['userId', 'messageId'],
    },
  },
  {
    name: 'read_private_messages',
    description: 'Read recent message history from a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Discord user ID' },
        count: { type: 'string', description: 'Number of messages to retrieve' },
      },
      required: ['userId'],
    },
  },

  // Message
  {
    name: 'send_message',
    description: 'Send a message to a specific channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Discord channel ID' },
        message: { type: 'string', description: 'Message content' },
      },
      required: ['channelId', 'message'],
    },
  },
  {
    name: 'edit_message',
    description: 'Edit a message from a specific channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Discord channel ID' },
        messageId: { type: 'string', description: 'Specific message ID' },
        newMessage: { type: 'string', description: 'New message content' },
      },
      required: ['channelId', 'messageId', 'newMessage'],
    },
  },
  {
    name: 'delete_message',
    description: 'Delete a message from a specific channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Discord channel ID' },
        messageId: { type: 'string', description: 'Specific message ID' },
      },
      required: ['channelId', 'messageId'],
    },
  },
  {
    name: 'read_messages',
    description: 'Read recent message history from a specific channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Discord channel ID' },
        count: { type: 'string', description: 'Number of messages to retrieve' },
      },
      required: ['channelId'],
    },
  },
  {
    name: 'add_reaction',
    description: 'Add a reaction (emoji) to a specific message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Discord channel ID' },
        messageId: { type: 'string', description: 'Discord message ID' },
        emoji: { type: 'string', description: 'Emoji (Unicode or string)' },
      },
      required: ['channelId', 'messageId', 'emoji'],
    },
  },
  {
    name: 'remove_reaction',
    description: 'Remove a specified reaction (emoji) from a message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Discord channel ID' },
        messageId: { type: 'string', description: 'Discord message ID' },
        emoji: { type: 'string', description: 'Emoji (Unicode or string)' },
      },
      required: ['channelId', 'messageId', 'emoji'],
    },
  },

  // Channel
  {
    name: 'create_text_channel',
    description: 'Create a new text channel',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Channel name' },
        categoryId: { type: 'string', description: 'Category ID (optional)' },
        guildId: { type: 'string', description: 'Discord server ID' },
      },
      required: ['name'],
    },
  },
  {
    name: 'delete_channel',
    description: 'Delete a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Discord channel ID' },
        guildId: { type: 'string', description: 'Discord server ID' },
      },
      required: ['channelId'],
    },
  },
  {
    name: 'find_channel',
    description: 'Find a channel type and ID using name and server ID',
    inputSchema: {
      type: 'object',
      properties: {
        channelName: { type: 'string', description: 'Discord channel name' },
        guildId: { type: 'string', description: 'Discord server ID' },
      },
      required: ['channelName'],
    },
  },
  {
    name: 'list_channels',
    description: 'List of all channels',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Discord server ID' },
      },
      required: [],
    },
  },

  // Category
  {
    name: 'create_category',
    description: 'Create a new category for channels',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Discord category name' },
        guildId: { type: 'string', description: 'Discord server ID' },
      },
      required: ['name'],
    },
  },
  {
    name: 'delete_category',
    description: 'Delete a category',
    inputSchema: {
      type: 'object',
      properties: {
        categoryId: { type: 'string', description: 'Discord category ID' },
        guildId: { type: 'string', description: 'Discord server ID' },
      },
      required: ['categoryId'],
    },
  },
  {
    name: 'find_category',
    description: 'Find a category ID using name and server ID',
    inputSchema: {
      type: 'object',
      properties: {
        categoryName: { type: 'string', description: 'Discord category name' },
        guildId: { type: 'string', description: 'Discord server ID' },
      },
      required: ['categoryName'],
    },
  },
  {
    name: 'list_channels_in_category',
    description: 'List of channels in a specific category',
    inputSchema: {
      type: 'object',
      properties: {
        categoryId: { type: 'string', description: 'Discord category ID' },
        guildId: { type: 'string', description: 'Discord server ID' },
      },
      required: ['categoryId'],
    },
  },

  // Webhook
  {
    name: 'create_webhook',
    description: 'Create a new webhook on a specific channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Discord channel ID' },
        name: { type: 'string', description: 'Webhook name' },
      },
      required: ['channelId', 'name'],
    },
  },
  {
    name: 'delete_webhook',
    description: 'Delete a webhook',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Discord webhook ID' },
      },
      required: ['webhookId'],
    },
  },
  {
    name: 'list_webhooks',
    description: 'List of webhooks on a specific channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Discord channel ID' },
      },
      required: ['channelId'],
    },
  },
  {
    name: 'send_webhook_message',
    description: 'Send a message via webhook',
    inputSchema: {
      type: 'object',
      properties: {
        webhookUrl: { type: 'string', description: 'Discord webhook link' },
        message: { type: 'string', description: 'Message content' },
      },
      required: ['webhookUrl', 'message'],
    },
  },
];

// Tool names for validation
export const toolNames = tools.map((t) => t.name);

// Get tool by name
export function getTool(name: string): Tool | undefined {
  return tools.find((t) => t.name === name);
}

// Validate required parameters
export function validateToolInput(toolName: string, args: Record<string, unknown>): string[] {
  const tool = getTool(toolName);
  if (!tool) return [`Unknown tool: ${toolName}`];

  const errors: string[] = [];
  const schema = tool.inputSchema as { required?: string[]; properties?: Record<string, unknown> };
  const required = schema.required || [];

  for (const param of required) {
    if (args[param] === undefined || args[param] === null || args[param] === '') {
      errors.push(`Missing required parameter: ${param}`);
    }
  }

  return errors;
}

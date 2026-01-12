import { describe, it, expect } from 'vitest';
import { tools, toolNames, getTool, validateToolInput } from './tools.js';

describe('tools', () => {
  describe('tool definitions', () => {
    it('should have 24 tools defined', () => {
      expect(tools).toHaveLength(24);
    });

    it('should have unique tool names', () => {
      const uniqueNames = new Set(toolNames);
      expect(uniqueNames.size).toBe(toolNames.length);
    });

    it('should have all required tool properties', () => {
      for (const tool of tools) {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('inputSchema');
        expect(tool.name).toBeTruthy();
        expect(tool.description).toBeTruthy();
      }
    });

    it('should have valid input schemas', () => {
      for (const tool of tools) {
        const schema = tool.inputSchema as Record<string, unknown>;
        expect(schema.type).toBe('object');
        expect(schema.properties).toBeDefined();
      }
    });
  });

  describe('getTool', () => {
    it('should return tool by name', () => {
      const tool = getTool('send_message');
      expect(tool).toBeDefined();
      expect(tool?.name).toBe('send_message');
    });

    it('should return undefined for unknown tool', () => {
      const tool = getTool('unknown_tool');
      expect(tool).toBeUndefined();
    });
  });

  describe('validateToolInput', () => {
    it('should return error for unknown tool', () => {
      const errors = validateToolInput('unknown_tool', {});
      expect(errors).toContain('Unknown tool: unknown_tool');
    });

    it('should validate required parameters', () => {
      const errors = validateToolInput('send_message', {});
      expect(errors).toContain('Missing required parameter: channelId');
      expect(errors).toContain('Missing required parameter: message');
    });

    it('should pass when required parameters are provided', () => {
      const errors = validateToolInput('send_message', {
        channelId: '123456',
        message: 'Hello',
      });
      expect(errors).toHaveLength(0);
    });

    it('should accept optional parameters', () => {
      const errors = validateToolInput('list_channels', {});
      expect(errors).toHaveLength(0);
    });

    it('should validate get_server_info (no required params)', () => {
      const errors = validateToolInput('get_server_info', {});
      expect(errors).toHaveLength(0);
    });

    it('should validate get_user_id_by_name', () => {
      const errors = validateToolInput('get_user_id_by_name', {});
      expect(errors).toContain('Missing required parameter: username');

      const noErrors = validateToolInput('get_user_id_by_name', { username: 'test' });
      expect(noErrors).toHaveLength(0);
    });
  });

  describe('tool categories', () => {
    const serverTools = ['get_server_info'];
    const userTools = [
      'get_user_id_by_name',
      'send_private_message',
      'edit_private_message',
      'delete_private_message',
      'read_private_messages',
    ];
    const messageTools = [
      'send_message',
      'edit_message',
      'delete_message',
      'read_messages',
      'add_reaction',
      'remove_reaction',
    ];
    const channelTools = ['create_text_channel', 'delete_channel', 'find_channel', 'list_channels'];
    const categoryTools = [
      'create_category',
      'delete_category',
      'find_category',
      'list_channels_in_category',
    ];
    const webhookTools = ['create_webhook', 'delete_webhook', 'list_webhooks', 'send_webhook_message'];

    it('should have all server tools', () => {
      for (const name of serverTools) {
        expect(toolNames).toContain(name);
      }
    });

    it('should have all user tools', () => {
      for (const name of userTools) {
        expect(toolNames).toContain(name);
      }
    });

    it('should have all message tools', () => {
      for (const name of messageTools) {
        expect(toolNames).toContain(name);
      }
    });

    it('should have all channel tools', () => {
      for (const name of channelTools) {
        expect(toolNames).toContain(name);
      }
    });

    it('should have all category tools', () => {
      for (const name of categoryTools) {
        expect(toolNames).toContain(name);
      }
    });

    it('should have all webhook tools', () => {
      for (const name of webhookTools) {
        expect(toolNames).toContain(name);
      }
    });
  });
});

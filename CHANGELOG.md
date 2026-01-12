# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-01-12

### Added
- Initial release of Discord MCP server
- 24 MCP tools for Discord management:
  - **Server:** `get_server_info`
  - **User/DM:** `get_user_id_by_name`, `send_private_message`, `edit_private_message`, `delete_private_message`, `read_private_messages`
  - **Messages:** `send_message`, `edit_message`, `delete_message`, `read_messages`, `add_reaction`, `remove_reaction`
  - **Channels:** `create_text_channel`, `delete_channel`, `find_channel`, `list_channels`
  - **Categories:** `create_category`, `delete_category`, `find_category`, `list_channels_in_category`
  - **Webhooks:** `create_webhook`, `delete_webhook`, `list_webhooks`, `send_webhook_message`
- TypeScript implementation with full type safety
- Vitest unit tests with 18 test cases
- GitHub Actions CI workflow (Node 20/22 matrix)
- Automatic publishing to npm (`@pagelines/discord-mcp`)
- Automatic publishing to MCP Registry via OIDC
- Connection test script (`npm run test:connection`)
- Promise-based Discord client ready handling (fixes race condition)

### Technical
- Built with `@modelcontextprotocol/sdk` v1.0.0
- Uses `discord.js` v14.16.3
- Requires Node.js >= 20.0.0
- Stdio transport for MCP communication

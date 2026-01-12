#!/usr/bin/env npx tsx
/**
 * Quick test to verify Discord connection works
 */
import { DiscordClient } from '../src/discord-client.js';
import 'dotenv/config';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!DISCORD_TOKEN) {
  console.error('Error: DISCORD_TOKEN not set in .env');
  process.exit(1);
}

console.log('Testing Discord connection...');
console.log(`Guild ID: ${DISCORD_GUILD_ID || 'not set (will use first available)'}`);

const discord = new DiscordClient(DISCORD_TOKEN, DISCORD_GUILD_ID);

async function test() {
  try {
    // Test 1: Get server info
    console.log('\n1. Getting server info...');
    const serverInfo = await discord.getServerInfo();
    console.log(`   Server: ${serverInfo.name}`);
    console.log(`   Members: ${serverInfo.memberCount}`);
    console.log(`   Owner: ${serverInfo.ownerId}`);

    // Test 2: List channels
    console.log('\n2. Listing channels...');
    const channels = await discord.listChannels();
    console.log(`   Found ${channels.length} channels:`);
    for (const ch of channels.slice(0, 5)) {
      console.log(`   - #${ch.name} (${ch.type})`);
    }
    if (channels.length > 5) {
      console.log(`   ... and ${channels.length - 5} more`);
    }

    console.log('\n✓ All tests passed! Discord connection is working.');
  } catch (error) {
    console.error('\n✗ Test failed:', error);
    process.exit(1);
  } finally {
    await discord.destroy();
  }
}

test();

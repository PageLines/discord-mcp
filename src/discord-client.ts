import { Client, GatewayIntentBits, Guild, TextChannel, CategoryChannel, GuildMember, Message, Webhook } from 'discord.js';

export class DiscordClient {
  private client: Client;
  private defaultGuildId: string | undefined;
  private readyPromise: Promise<void>;

  constructor(token: string, defaultGuildId?: string) {
    this.defaultGuildId = defaultGuildId;

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
    });

    // Create a promise that resolves when the client is ready
    // This is the FIX for the race condition bug in the Java version
    this.readyPromise = new Promise((resolve, reject) => {
      this.client.once('ready', () => {
        console.error(`Discord bot logged in as ${this.client.user?.tag}`);
        resolve();
      });
      this.client.once('error', reject);
    });

    // Login and wait for ready
    this.client.login(token).catch((err) => {
      console.error('Failed to login to Discord:', err);
      throw err;
    });
  }

  // Ensure the client is ready before any operation
  private async ensureReady(): Promise<void> {
    await this.readyPromise;
  }

  private getGuildId(providedGuildId?: string): string {
    const guildId = providedGuildId || this.defaultGuildId;
    if (!guildId) {
      throw new Error('No guild ID provided and no default guild ID configured');
    }
    return guildId;
  }

  private async getGuild(guildId?: string): Promise<Guild> {
    await this.ensureReady();
    const id = this.getGuildId(guildId);
    const guild = this.client.guilds.cache.get(id);
    if (!guild) {
      throw new Error(`Guild not found: ${id}. Make sure the bot is added to this server.`);
    }
    return guild;
  }

  // Server info
  async getServerInfo(guildId?: string): Promise<object> {
    const guild = await this.getGuild(guildId);
    return {
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL(),
      memberCount: guild.memberCount,
      ownerId: guild.ownerId,
      createdAt: guild.createdAt.toISOString(),
      description: guild.description,
      features: guild.features,
    };
  }

  // Channel operations
  async listChannels(guildId?: string): Promise<object[]> {
    const guild = await this.getGuild(guildId);
    return guild.channels.cache.map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
      parentId: channel.parentId,
    }));
  }

  async findChannel(channelName: string, guildId?: string): Promise<object | null> {
    const guild = await this.getGuild(guildId);
    const channel = guild.channels.cache.find(
      (c) => c.name.toLowerCase() === channelName.toLowerCase()
    );
    if (!channel) return null;
    return {
      id: channel.id,
      name: channel.name,
      type: channel.type,
      parentId: channel.parentId,
    };
  }

  async createTextChannel(name: string, categoryId?: string, guildId?: string): Promise<object> {
    const guild = await this.getGuild(guildId);
    const channel = await guild.channels.create({
      name,
      parent: categoryId,
    });
    return {
      id: channel.id,
      name: channel.name,
      type: channel.type,
    };
  }

  async deleteChannel(channelId: string, guildId?: string): Promise<void> {
    const guild = await this.getGuild(guildId);
    const channel = guild.channels.cache.get(channelId);
    if (!channel) throw new Error(`Channel not found: ${channelId}`);
    await channel.delete();
  }

  // Category operations
  async findCategory(categoryName: string, guildId?: string): Promise<object | null> {
    const guild = await this.getGuild(guildId);
    const category = guild.channels.cache.find(
      (c) => c.type === 4 && c.name.toLowerCase() === categoryName.toLowerCase()
    ) as CategoryChannel | undefined;
    if (!category) return null;
    return {
      id: category.id,
      name: category.name,
      type: category.type,
    };
  }

  async createCategory(name: string, guildId?: string): Promise<object> {
    const guild = await this.getGuild(guildId);
    const category = await guild.channels.create({
      name,
      type: 4, // CategoryChannel
    });
    return {
      id: category.id,
      name: category.name,
      type: category.type,
    };
  }

  async deleteCategory(categoryId: string, guildId?: string): Promise<void> {
    const guild = await this.getGuild(guildId);
    const category = guild.channels.cache.get(categoryId);
    if (!category) throw new Error(`Category not found: ${categoryId}`);
    await category.delete();
  }

  async listChannelsInCategory(categoryId: string, guildId?: string): Promise<object[]> {
    const guild = await this.getGuild(guildId);
    return guild.channels.cache
      .filter((c) => c.parentId === categoryId)
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
      }));
  }

  // Message operations
  async sendMessage(channelId: string, message: string): Promise<object> {
    await this.ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      throw new Error(`Text channel not found: ${channelId}`);
    }
    const sent = await (channel as TextChannel).send(message);
    return {
      id: sent.id,
      content: sent.content,
      channelId: sent.channelId,
      createdAt: sent.createdAt.toISOString(),
    };
  }

  async editMessage(channelId: string, messageId: string, newMessage: string): Promise<object> {
    await this.ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      throw new Error(`Text channel not found: ${channelId}`);
    }
    const message = await (channel as TextChannel).messages.fetch(messageId);
    const edited = await message.edit(newMessage);
    return {
      id: edited.id,
      content: edited.content,
      channelId: edited.channelId,
      editedAt: edited.editedAt?.toISOString(),
    };
  }

  async deleteMessage(channelId: string, messageId: string): Promise<void> {
    await this.ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      throw new Error(`Text channel not found: ${channelId}`);
    }
    const message = await (channel as TextChannel).messages.fetch(messageId);
    await message.delete();
  }

  async readMessages(channelId: string, count: number = 50): Promise<object[]> {
    await this.ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      throw new Error(`Text channel not found: ${channelId}`);
    }
    const messages = await (channel as TextChannel).messages.fetch({ limit: Math.min(count, 100) });
    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      authorId: msg.author.id,
      authorName: msg.author.username,
      createdAt: msg.createdAt.toISOString(),
      attachments: msg.attachments.map((a) => a.url),
    }));
  }

  // Reaction operations
  async addReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
    await this.ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      throw new Error(`Text channel not found: ${channelId}`);
    }
    const message = await (channel as TextChannel).messages.fetch(messageId);
    await message.react(emoji);
  }

  async removeReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
    await this.ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      throw new Error(`Text channel not found: ${channelId}`);
    }
    const message = await (channel as TextChannel).messages.fetch(messageId);
    const reaction = message.reactions.cache.find((r) => r.emoji.name === emoji || r.emoji.toString() === emoji);
    if (reaction && this.client.user) {
      await reaction.users.remove(this.client.user.id);
    }
  }

  // User operations
  async getUserIdByName(username: string, guildId?: string): Promise<object | null> {
    const guild = await this.getGuild(guildId);
    await guild.members.fetch();

    // Handle username#discriminator format
    const [name, discriminator] = username.split('#');

    const member = guild.members.cache.find((m) => {
      if (discriminator) {
        return m.user.username.toLowerCase() === name.toLowerCase() &&
               m.user.discriminator === discriminator;
      }
      return m.user.username.toLowerCase() === name.toLowerCase() ||
             m.displayName.toLowerCase() === name.toLowerCase();
    });

    if (!member) return null;
    return {
      id: member.id,
      username: member.user.username,
      displayName: member.displayName,
      discriminator: member.user.discriminator,
    };
  }

  // Private message operations
  async sendPrivateMessage(userId: string, message: string): Promise<object> {
    await this.ensureReady();
    const user = await this.client.users.fetch(userId);
    const dm = await user.createDM();
    const sent = await dm.send(message);
    return {
      id: sent.id,
      content: sent.content,
      channelId: sent.channelId,
      createdAt: sent.createdAt.toISOString(),
    };
  }

  async editPrivateMessage(userId: string, messageId: string, newMessage: string): Promise<object> {
    await this.ensureReady();
    const user = await this.client.users.fetch(userId);
    const dm = await user.createDM();
    const message = await dm.messages.fetch(messageId);
    const edited = await message.edit(newMessage);
    return {
      id: edited.id,
      content: edited.content,
      editedAt: edited.editedAt?.toISOString(),
    };
  }

  async deletePrivateMessage(userId: string, messageId: string): Promise<void> {
    await this.ensureReady();
    const user = await this.client.users.fetch(userId);
    const dm = await user.createDM();
    const message = await dm.messages.fetch(messageId);
    await message.delete();
  }

  async readPrivateMessages(userId: string, count: number = 50): Promise<object[]> {
    await this.ensureReady();
    const user = await this.client.users.fetch(userId);
    const dm = await user.createDM();
    const messages = await dm.messages.fetch({ limit: Math.min(count, 100) });
    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      authorId: msg.author.id,
      authorName: msg.author.username,
      createdAt: msg.createdAt.toISOString(),
    }));
  }

  // Webhook operations
  async listWebhooks(channelId: string): Promise<object[]> {
    await this.ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || channel.type !== 0) {
      throw new Error(`Text channel not found: ${channelId}`);
    }
    const webhooks = await (channel as TextChannel).fetchWebhooks();
    return webhooks.map((wh) => ({
      id: wh.id,
      name: wh.name,
      url: wh.url,
      channelId: wh.channelId,
    }));
  }

  async createWebhook(channelId: string, name: string): Promise<object> {
    await this.ensureReady();
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || channel.type !== 0) {
      throw new Error(`Text channel not found: ${channelId}`);
    }
    const webhook = await (channel as TextChannel).createWebhook({ name });
    return {
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      channelId: webhook.channelId,
    };
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    await this.ensureReady();
    const webhook = await this.client.fetchWebhook(webhookId);
    await webhook.delete();
  }

  async sendWebhookMessage(webhookUrl: string, message: string): Promise<void> {
    // Parse webhook URL to get id and token
    const match = webhookUrl.match(/\/webhooks\/(\d+)\/([^/]+)/);
    if (!match) throw new Error('Invalid webhook URL');

    await this.ensureReady();
    const webhook = await this.client.fetchWebhook(match[1], match[2]);
    await webhook.send(message);
  }

  async destroy(): Promise<void> {
    await this.client.destroy();
  }
}

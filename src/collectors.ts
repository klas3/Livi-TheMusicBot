// eslint-disable-next-line no-unused-vars
import { Message, MessageReaction, User } from 'discord.js';
// eslint-disable-next-line no-unused-vars
import guilds, { IGuildInfo } from './guildsInfo';
import { startPlaying, displayPlayer, endPlaying } from './player';
import * as botConfig from './configurations/botConfig.json';

export const searchEmojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];
export const playerEmojis = ['🔄', '⏪', '⏸', '▶', '⏩', '🔁', '❌'];

async function reactMessage(message: Message, emojis: string[], maxCount?: number): Promise<void> {
  await Promise.all([
    emojis.map((emoji, index) => {
      if (maxCount && index > maxCount) {
        return;
      }
      // eslint-disable-next-line consistent-return
      return message.react(emoji);
    }),
  ]);
}

async function playerCollectorHandler(
  reaction: MessageReaction,
  userId: string,
  guildId: string,
): Promise<void> {
  const setState = (newState: IGuildInfo) => guilds.set(guildId, newState);
  // prettier-ignore
  const {
    dispatcher, loop, queueIndex, queue, playerMessageId, collectorIdArr,
  } = guilds.get(guildId);
  // prettier-ignore
  if (!dispatcher
    || queueIndex === undefined
    || !queue
    || !reaction.message.guild
    || !collectorIdArr
  ) {
    return;
  }
  const reserver = reaction.message.guild.members.cache.get(collectorIdArr[queueIndex]);
  // prettier-ignore
  const updatePlayer = () => displayPlayer(
    reaction.message,
    queue[queueIndex],
    guildId,
    playerMessageId,
    reserver?.user.displayAvatarURL(),
    reserver?.nickname ?? reserver?.user.username,
  );
  reaction.users.remove(userId);
  switch (reaction.emoji.name) {
    case '🔄':
      setState({ loop: !loop });
      updatePlayer();
      break;
    case '⏪':
      if (queueIndex > 0) {
        setState({ previous: true });
        endPlaying(guildId);
      }
      break;
    case '⏸':
      dispatcher.pause();
      updatePlayer();
      break;
    case '▶':
      dispatcher.resume();
      updatePlayer();
      break;
    case '⏩':
      if (queueIndex + 1 < queue.length) {
        endPlaying(guildId);
      }
      break;
    case '🔁':
      setState({ replay: true });
      endPlaying(guildId);
      break;
    case '❌':
      setState({ isDisconnectionRequired: true });
      endPlaying(guildId);
      break;
    default:
      dispatcher.end();
  }
}

export async function initializePlayerCollector(message: Message, botId: string): Promise<void> {
  if (!message.guild) {
    return;
  }
  const guildId = message.guild.id;
  const { collectorIdArr, queueIndex, playerFlag } = guilds.get(guildId);
  if (message.author.id !== botId || !playerFlag || !collectorIdArr || queueIndex === undefined) {
    return;
  }
  await reactMessage(message, playerEmojis);
  // prettier-ignore
  const panelFilter = (reaction: MessageReaction, user: User, emoji: string) => !user.bot
    && collectorIdArr[queueIndex] === user.id
    && reaction.emoji.name === emoji;
  // prettier-ignore
  const collectors = playerEmojis.map((emoji) => message.createReactionCollector(
    (reaction, user) => panelFilter(reaction, user, emoji),
    { time: botConfig.searchTimer },
  ));
  // prettier-ignore
  collectors.forEach((collector) => {
    collector.on('collect', (reaction, user) => playerCollectorHandler(reaction, user.id, guildId).catch(() => {}));
  });
  guilds.set(guildId, {
    clearPlayerCollectors: () => {
      collectors.forEach((collector) => {
        collector.stop();
      });
    },
    playerMessageId: message.id,
    playerFlag: false,
  });
}

export async function initializeSearchCollector(message: Message, botId: string): Promise<void> {
  if (!message.guild) {
    return;
  }
  // prettier-ignore
  const {
    searchFlag, searcherId, searchMessage, searchResults,
  } = guilds.get(message.guild.id);
  if (message.author.id !== botId || !searchFlag || !searchMessage || !searchResults) {
    return;
  }
  guilds.set(message.guild.id, { searchFlag: false });
  reactMessage(message, searchEmojis, searchResults.length);
  searchResults.forEach((video, index) => {
    // prettier-ignore
    // eslint-disable-next-line consistent-return
    const searchFilter = (reaction: MessageReaction, user: User) => !user.bot
      && user.id === searcherId
      && reaction.emoji.name === searchEmojis[index];
    const searchCollector = message.createReactionCollector(searchFilter);
    searchCollector.on('collect', (reaction, user) => {
      if (!reaction.message.guild) {
        return;
      }
      reaction.users.remove(user.id);
      startPlaying(searchMessage, video, reaction.message.guild.id);
      searchCollector.stop();
    });
    searchCollector.on('end', () => {
      searchCollector.stop();
    });
  });
}

// eslint-disable-next-line no-unused-vars
import { Message } from 'discord.js';
// eslint-disable-next-line no-unused-vars
import guilds, { IGuildInfo } from './guildsInfo';
import { getPlayerMessage } from './messages';
import { fetchYoutubeVideo, getYoutubeVideoForPlay } from './googleApi';
import client from './bot';
import * as botConfig from './configurations/botConfig.json';
import { playerEmojis } from './collectors';

const parsingNumberSystem = 10;
const firstTwoDigitsNumber = 10;
const secondsInMinute = 60;

export function getDurationString(length: string): string {
  const videoLength = Number.parseInt(length, parsingNumberSystem);
  if (Number.isNaN(videoLength)) {
    return '';
  }
  const minutes = Math.floor(videoLength / secondsInMinute);
  const seconds = videoLength - (minutes * secondsInMinute);
  return `${minutes < firstTwoDigitsNumber ? '0' : ''}${minutes}:${seconds < firstTwoDigitsNumber ? '0' : ''}${seconds}`;
}

export function getCompositionInfoString(index: number, title: string, length?: string): string {
  return `\n${index}) ${title}${length ? ` - ${getDurationString(length)}` : ''}`;
}

export async function displayPlayer(
  message: Message,
  compositionUrl: string,
  guildId: string,
  previousPlayerId?: string,
  avatar?: string,
  username?: string,
): Promise<void> {
  const { compositionsInfo, loop, dispatcher } = guilds.get(guildId);
  if (!compositionsInfo || loop === undefined) {
    return;
  }
  const info = compositionsInfo.get(compositionUrl);
  if (!info) {
    return;
  }
  const messageContent = getPlayerMessage(
    avatar ?? message.author.displayAvatarURL(),
    username ?? message.member?.nickname ?? message.author.username,
    info.title,
    compositionUrl,
    getDurationString(info.length_seconds),
    !dispatcher ? false : dispatcher.paused,
    loop,
  );
  if (previousPlayerId) {
    const playerMessage = message.channel.messages.cache.find(
      (channelMessage) => channelMessage.id === previousPlayerId,
    );
    if (playerMessage) {
      playerMessage.edit(messageContent);
      return;
    }
  }
  message.channel.send(messageContent);
  guilds.set(guildId, { playerFlag: true });
}

export async function tryDeletePlayer(message: Message, guildId: string): Promise<void> {
  const { playerMessageId } = guilds.get(guildId);
  if (!playerMessageId) {
    return;
  }
  const playerMessage = message.channel.messages.cache.find(
    (channelMessage) => channelMessage.id === playerMessageId,
  );
  if (!playerMessage || !client.user) {
    return;
  }
  const botId = client.user.id;
  const playerReactions = playerMessage.reactions.cache.filter(
    (reaction) => reaction.users.cache.has(botId),
  );
  if (playerReactions.array().length === playerEmojis.length) {
    await playerMessage.reactions.removeAll();
    playerMessage.delete({ timeout: botConfig.deleteMessageTimer });
  }
}

export function endPlaying(guildId: string): void {
  const { dispatcher } = guilds.get(guildId);
  if (!dispatcher) {
    return;
  }
  dispatcher.resume();
  client.setTimeout(() => dispatcher.end(), botConfig.compositionEndTimeout);
}

async function playCurrentComposition(message: Message, guildId: string): Promise<void> {
  const { queue, queueIndex } = guilds.get(guildId);
  if (!queue || queueIndex === undefined || !client.voice) {
    return;
  }
  const voiceConnection = client.voice.connections.get(guildId);
  if (!voiceConnection) {
    return;
  }
  const setState = (newState: IGuildInfo) => guilds.set(guildId, newState);
  const dispatcher = voiceConnection
    .play(await getYoutubeVideoForPlay(queue[queueIndex]), { ...botConfig.streamOptions, type: 'opus' });
  // eslint-disable-next-line no-use-before-define
  dispatcher.on('finish', () => handleCompositiionEnd(message, guildId).catch(() => {}));
  setState({ dispatcher });
}

async function handleCompositiionEnd(message: Message, guildId: string): Promise<void> {
  const setState = (newState: IGuildInfo) => guilds.set(guildId, newState);
  const {
    queue, previous, loop, replay, isDisconnectionRequired, clearPlayerCollectors, playerMessageId,
  } = guilds.get(guildId);
  let { queueIndex } = guilds.get(guildId);
  // eslint-disable-next-line max-len
  if (!queue || queueIndex === undefined || !client.voice || !clearPlayerCollectors || !message.member) {
    return;
  }
  queueIndex += 1;
  setState({ queueIndex });
  clearPlayerCollectors();
  if ((queueIndex >= queue.length && !previous && !loop && !replay) || isDisconnectionRequired) {
    tryDeletePlayer(message, guildId);
    guilds.reset(guildId);
    const dispatcherVoiceConnection = client.voice.connections.get(guildId);
    if (dispatcherVoiceConnection) {
      dispatcherVoiceConnection.channel.leave();
    }
    return;
  }
  if (replay || loop) {
    queueIndex -= 1;
    setState({ queueIndex, replay: false });
  } else if (previous) {
    queueIndex -= 2;
    setState({ queueIndex, previous: false });
  }
  playCurrentComposition(message, guildId);
  displayPlayer(message, queue[queueIndex], guildId, playerMessageId);
}

export async function startPlaying(
  message: Message,
  compositionUrl: string,
  guildId: string,
): Promise<void> {
  if (!message.member || !message.member.voice.channel || !client.voice) {
    message.channel.send('☝ *You need to join a voice channel!*');
    return;
  }
  await message.member.voice.channel.join();
  const compositionInfo = await fetchYoutubeVideo(compositionUrl);
  if (!compositionInfo) {
    message.channel.send('❌ *Invalid url of composition*');
    return;
  }
  const { collectorIdArr, queue, compositionsInfo } = guilds.get(guildId);
  if (!collectorIdArr || !queue || !compositionsInfo) {
    return;
  }
  const currentQueueLength = queue.length;
  compositionsInfo.set(compositionUrl, compositionInfo);
  collectorIdArr.push(message.author.id);
  queue.push(compositionUrl);
  if (currentQueueLength !== 0) {
    message.react('👌');
    return;
  }
  displayPlayer(message, compositionUrl, guildId);
  playCurrentComposition(message, guildId);
}

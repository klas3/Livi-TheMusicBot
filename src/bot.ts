// eslint-disable-next-line no-unused-vars
import { Client, TextChannel } from 'discord.js';
import * as botConfig from './configurations/botConfig.json';
import {
  getHelpMessage, getGreetingsMessage, getQueueMessage, getSearchMessage, getPlayerHelpMessage,
} from './messages';
// eslint-disable-next-line no-unused-vars
import guilds, { IGuildInfo, GuildInfo } from './guildsInfo';
import { initializePlayerCollector, initializeSearchCollector } from './collectors';
import {
  startPlaying, displayPlayer, tryDeletePlayer, getCompositionInfoString, endPlaying,
} from './player';
import { searchForYoutubeVideos } from './googleApi';

const client = new Client();
const { prefix } = botConfig;

client.on('ready', async () => {
  if (!client.user) {
    return;
  }
  client.user.setActivity(botConfig.activity);
  // eslint-disable-next-line no-console
  console.log('I am ready!');
});

client.on('message', async (message) => {
  if (!message.guild || !client.user) {
    return;
  }
  const guildId = message.guild.id;
  const guild: GuildInfo = {
    getState: () => guilds.get(guildId),
    setState: (newState: IGuildInfo) => guilds.set(guildId, newState),
    resetState: () => guilds.reset(guildId),
  };
  if (Object.keys(guild.getState()).length === 0) {
    guild.resetState();
  }
  const { dispatcher, queue } = guild.getState();

  if (message.content.startsWith(`${prefix}queue`)) {
    const { compositionsInfo } = guild.getState();
    if (!queue || queue.length === 0 || !compositionsInfo) {
      message.channel.send('🧐 There is no composition playing now!');
      return;
    }
    const messageText = `\`\`\`Elm${
      queue.map((composition, index) => {
        const info = compositionsInfo.get(composition);
        if (!info) {
          return '';
        }
        return getCompositionInfoString(index + 1, info.title, info.length_seconds);
      }).join('')
    }\n\`\`\``;
    const { username } = client.user;
    message.channel.send(getQueueMessage(client.user.displayAvatarURL(), username, messageText));
  }

  if (message.content.startsWith(`${prefix}disconnect`) && dispatcher) {
    guild.setState({ isDisconnectionRequired: true });
    endPlaying(guildId);
  }

  if (message.content.startsWith(`${prefix}start`)) {
    const splitedMessage = message.content.split(' ');
    splitedMessage.shift();
    const composition = splitedMessage.pop();
    if (!composition) {
      message.channel.send('🌐 Please, send me a link to the video you wanna play');
      return;
    }
    startPlaying(message, composition, guildId);
  }

  if (message.content.startsWith(`${prefix}player`)) {
    if (!queue || queue.length === 0) {
      message.channel.send('🧐 There is no composition playing now!');
      return;
    }
    const { collectorIdArr, queueIndex, clearPlayerCollectors } = guild.getState();
    if (queueIndex === undefined || !clearPlayerCollectors || !collectorIdArr || !message.member) {
      return;
    }
    if (collectorIdArr[queueIndex] !== message.author.id) {
      message.author.send('😕 I\'m sorry, but you\'re not the reserver of the current composition, so you can\'t do that.');
      return;
    }
    clearPlayerCollectors();
    tryDeletePlayer(message, guildId);
    guild.setState({ playerMessageId: '' });
    displayPlayer(message, queue[queueIndex], message.guild.id);
  }

  if (message.content.startsWith(`${prefix}helpPlayer`)) {
    message.channel.send(getPlayerHelpMessage(client.user.displayAvatarURL()));
    return;
  }

  if (message.content.startsWith(`${prefix}help`)) {
    message.channel.send(getHelpMessage(client.user.displayAvatarURL()));
  }

  if (message.content.startsWith(`${prefix}search`)) {
    const { searchResults } = guild.getState();
    if (!searchResults) {
      return;
    }
    guild.setState({ searcherId: message.author.id, searchFlag: true });
    const searchText = message.content.slice(8);
    const videos = await searchForYoutubeVideos(searchText);
    if (videos.results.length === 0) {
      return;
    }
    const compositionsBuilder: string[] = [];
    videos.results.forEach((video, index) => {
      compositionsBuilder.push(getCompositionInfoString(index + 1, video.title));
      guild.setState({ searchFlag: true, searchMessage: message });
      searchResults.push(video.link);
    });
    message.channel.send(getSearchMessage(
      message.author.displayAvatarURL(),
      message.author.username,
      client.user.displayAvatarURL(),
      searchText,
      compositionsBuilder.join(''),
    ));
  }

  if (message.content.startsWith(`${prefix}remove`)) {
    const compositions = message.content.split(' ');
    if (!queue || !dispatcher || !compositions) {
      message.channel.send('🧐 There is no composition playing now!');
      return;
    }
    compositions.shift();
    const newQueue = queue.filter((queueElement) => !compositions.includes(queueElement));
    guild.setState({ queue: newQueue });
    message.channel.send('👍 Queue has been updated');
    if (newQueue.length === 0) {
      guild.setState({ isDisconnectionRequired: true });
      dispatcher.end();
    }
  }

  if (message.content.startsWith(`${prefix}clean`)) {
    if (dispatcher) {
      endPlaying(guildId);
    }
    guild.resetState();
    message.channel.send('🧹 All clear!');
  }

  initializePlayerCollector(message, client.user.id);
  initializeSearchCollector(message, client.user.id);
});

client.on('guildCreate', (guild) => {
  if (!client.user) {
    return;
  }
  const guildChannel = guild.channels.cache.find((channel) => channel.type === 'text') as TextChannel;
  guildChannel.send(getGreetingsMessage(client.user.displayAvatarURL(), client.user.username));
});

client.login(process.env.BOT_TOKEN);

export default client;

import * as botConfig from './configurations/botConfig.json';

export function getHelpMessage(botAvatarUrl: string): {} {
  return {
    embed: {
      color: botConfig.messageDefaultColor,
      title: '*__Full list of commands__*',
      fields: [
        {
          name: '***!start url***',
          value: '*Play new composition or add it to the queue*',
        },
        {
          name: '***!queue***',
          value: '*Show the queue of the current broadcast*',
        },
        {
          name: '***!remove url url...***',
          value: '*Remove composition(s) from the queue*',
        },
        {
          name: '***!player***',
          value: '*Show the player of current broadcast\n(type !helpPlayer for more information)*',
        },
        {
          name: '***!search***',
          value: '*Search for your track in YouTube*',
        },
        {
          name: '***!disconnect***',
          value: '*Bot leaves the channel*',
        },
        {
          name: '***!clean***',
          value: '*Clear current queue*',
        },
      ],
      footer: {
        icon_url: botAvatarUrl,
        text: 'Read this before you start using me!',
      },
    },
  };
}

export function getPlayerHelpMessage(botAvatarUrl: string): {} {
  return {
    embed: {
      color: botConfig.messageDefaultColor,
      title: 'So let\'s discover what these buttons on palyer can do',
      fields: [
        {
          name: '🔄 - ***loop***',
          value: '*Looping the current composition*',
        },
        {
          name: '⏪ - ***previous composition***',
          value: '*Playing the previous composition of the broadcast*',
        },
        {
          name: '⏸ - ***pause***',
          value: '*Pausing the broadcast*',
        },
        {
          name: '▶ - ***resume***',
          value: '*Resuming the broadcast if it was paused*',
        },
        {
          name: '⏩ - ***next composition***',
          value: '*Playing the next composition of the broadcast*',
        },
        {
          name: '🔁 - ***replay***',
          value: '*Replaying the current composition*',
        },
        {
          name: '❌ - ***stop***',
          value: '*Stoping the broadcast*',
        },
      ],
      footer: {
        icon_url: botAvatarUrl,
        text: 'Read this to know how to use the player',
      },
    },
  };
}

export function getGreetingsMessage(botAvatarUrl: string, botUsername: string): {} {
  return {
    embed: {
      color: botConfig.messageDefaultColor,
      description: '**Thank you for adding me to your guild!** \n ```yaml\nType !help to see more commands;\n```',
      author: {
        icon_url: botAvatarUrl,
        name: botUsername,
      },
      footer: {
        text: 'Start your using with this steps!',
      },
    },
  };
}

export function getQueueMessage(
  botAvatarUrl: string,
  botUsername: string,
  messageText: string,
): {} {
  return {
    embed: {
      title: '*Queue of the current broadcast*',
      author: {
        icon_url: botAvatarUrl,
        name: botUsername,
      },
      description: messageText,
      color: botConfig.messageDefaultColor,
    },
  };
}

export function getPlayerMessage(
  userAvatarUrl: string,
  username: string,
  compositionTitle: string,
  compositionUrl: string,
  duration: string,
  isPaused?: boolean,
  isLooped?: boolean,
): {} {
  return {
    embed: {
      color: botConfig.messageDefaultColor,
      author: {
        name: `${username} 🎶`,
        icon_url: userAvatarUrl,
      },
      description: `***[${compositionTitle}](${compositionUrl})***\n`,
      footer: {
        text: `🕑 Duration: ${duration}\n${isPaused ? '⏸️ Paused' : ''}${!isPaused && isLooped ? '🔄 Looped' : ''}`,
      },
    },
  };
}

export function getSearchMessage(
  userAvatar: string,
  username: string,
  botAvatarUrl: string,
  requestMessage: string,
  compositions: string,
): {} {
  return {
    embed: {
      color: botConfig.messageDefaultColor,
      title: `Results for request __${requestMessage}__:\n`,
      author: {
        icon_url: userAvatar,
        name: username,
      },
      description: `\`\`\`Elm\n${compositions}\n\`\`\``,
      footer: {
        icon_url: botAvatarUrl,
        text: 'Choose the number of composition you want to listen',
      },
    },
  };
}

// eslint-disable-next-line no-unused-vars
import { StreamDispatcher, Message } from 'discord.js';
// eslint-disable-next-line no-unused-vars
import { VideoInfo } from './googleApi';

export interface IGuildInfo {
  dispatcher?: StreamDispatcher;
  previous?: boolean;
  loop?: boolean;
  isDisconnectionRequired?: boolean;
  replay?: boolean;
  queue?: string[];
  queueIndex?: number;
  searchResults?: string[];
  searcherId?: string;
  playerFlag?: boolean;
  playerMessageId?: string;
  searchFlag?: boolean;
  collectorIdArr?: string[];
  searchMessage?: Message;
  compositionsInfo?: Map<string, VideoInfo>;
  clearPlayerCollectors?(): void;
}

export interface GuildInfo {
  getState(): IGuildInfo;
  setState(newState: IGuildInfo): void;
  resetState(): void;
}

export class GuildsInfo {
  private state = new Map<string, IGuildInfo>();

  public get(guildId: string): IGuildInfo {
    return this.state.get(guildId) ?? {};
  }

  public set(guildId: string, newState: IGuildInfo): void {
    const currentState = this.state.get(guildId);
    if (!currentState) {
      this.state.set(guildId, newState);
      return;
    }
    this.state.set(guildId, { ...currentState, ...newState });
  }

  public reset(guildId: string): void {
    this.state.set(guildId, {
      previous: false,
      loop: false,
      isDisconnectionRequired: false,
      replay: false,
      queue: [],
      queueIndex: 0,
      searchResults: [],
      searcherId: '',
      playerFlag: false,
      playerMessageId: '',
      searchFlag: false,
      collectorIdArr: [],
      compositionsInfo: new Map<string, VideoInfo>(),
    });
  }
}

const guilds = new GuildsInfo();

export default guilds;

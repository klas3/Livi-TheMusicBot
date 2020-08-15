import youtubeSearch, {
  // eslint-disable-next-line no-unused-vars
  YouTubeSearchResults, YouTubeSearchOptions, YouTubeSearchPageResults,
} from 'youtube-search';
import ytdl from 'ytdl-core-discord';
// eslint-disable-next-line no-unused-vars
import { Readable } from 'stream';
import { config } from 'dotenv';
import * as botConfig from './configurations/botConfig.json';

config();

const youtubeVideoIdRegexp = /^[a-zA-Z0-9-_]{11}$/;

const youtubeSearchConfig: YouTubeSearchOptions = {
  maxResults: botConfig.maxYoutubeSearchResults,
  key: process.env.YOUTUBE_API_KEY,
  type: 'video',
};

interface YoutubeSearchResult {
  results: YouTubeSearchResults[];
  pageInfo: YouTubeSearchPageResults;
}

function getVideoId(url: string): string | undefined {
  return url.split('?').pop()?.split('&').find(
    (parameter) => parameter.startsWith('v='),
  )?.split('=').pop();
}

export interface VideoInfo {
  title: string;
  // eslint-disable-next-line camelcase
  length_seconds: string;
}

export function getYoutubeVideoForPlay(videoUrl: string): Promise<Readable> {
  return ytdl(videoUrl);
}

export function searchForYoutubeVideos(searchRequest: string): Promise<YoutubeSearchResult> {
  return youtubeSearch(searchRequest, youtubeSearchConfig);
}

export function fetchYoutubeVideo(videoUrl: string): Promise<VideoInfo> | undefined {
  try {
    const videoId = getVideoId(videoUrl);
    if (videoId && youtubeVideoIdRegexp.test(videoId)) {
      return ytdl.getInfo(videoUrl);
    }
    return undefined;
  } catch {
    return undefined;
  }
}

// export async function sayAndDo(
//   guildId: string,
//   phrase: string,
//   action: () => void,
// ): Promise<void> {
//   if (!client.voice) {
//     return;
//   }
//   const voiceConnection = client.voice.connections.get(guildId);
//   if (!voiceConnection) {
//     return;
//   }
//   const URL = await googleTTS(phrase, botConfig.speakingLanguage, 1);
//   const phraseDispatcher = voiceConnection.play(URL);
//   phraseDispatcher.on('end', () => {
//     action();
//   });
//   action();
// }
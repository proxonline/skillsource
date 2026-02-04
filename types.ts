export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

export enum SearchState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

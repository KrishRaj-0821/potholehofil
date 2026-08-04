export interface Comment {
  id: string;
  user: string;
  text: string;
  time: string;
  avatar?: string;
}

export interface PotholeMetrics {
  depthCm: number;
  areaSqM: number;
  count: number;
}

export interface PotholeLocation {
  name: string;
  pin: string;
  distance: string;
  verified: boolean;
  lat?: number;
  lng?: number;
}

export interface PotholePost {
  id: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
  location: PotholeLocation;
  imageUrl: string;
  memeCaption: string;
  memeSubtext?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  metrics: PotholeMetrics;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: string;
  tags: string[];
  userVote?: 'up' | 'down' | null;
  isBookmarked?: boolean;
  comments: Comment[];
}

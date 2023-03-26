interface Children {
  data: {
    url: string;
    media_metadata?: any;
    is_gallery?: boolean;
    is_video: boolean;
    post_hint: string;
    media: {
      reddit_video: {
        fallback_url: string;
      };
    };
  };
}

export interface RedditResponse {
  data: {
    children: Children[];
  };
}

/**
 * IMAGE - also involves gifs
 */
export enum ContentType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface Content {
  uri: string;
  type: ContentType;
}

export type ExploreFilter = "most-recent" | "people";

export type ExploreSearchState = "idle" | "loading" | "results" | "empty";

export interface ExploreAuthor {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  imgUrl: string;
}

export interface ExploreTweetResult {
  id: string;
  author: ExploreAuthor;
  content: string;
  createdAt: string;
  likesCount: number;
  likes?: Array<{ id?: string; userId?: string; likeId?: string; _id?: string } | string>;
  repliesCount: number;
  parentId?: string;
}

export interface ExploreUserResult {
  id: string;
  name: string;
  username: string;
  profileImage: string;
}

import { TweetCard } from "../TweetCard/TweetCard";
import { formatTimeAgo } from "../../utils/formatTimeAgo";
import type { ExploreFilter, ExploreSearchState, ExploreTweetResult, ExploreUserResult } from "../../models/explore";
import {
  ExploreRootStyled,
  SearchFormStyled,
  SearchInputStyled,
  StateTextStyled,
  TabButtonStyled,
  TabsRowStyled,
  UserAvatarStyled,
  UserNameStyled,
  UserResultCardStyled,
  UserResultItemStyled,
  UserResultsListStyled,
  UserUsernameStyled,
} from "./ExplorePanel.styles";

interface ExplorePanelProps {
  query: string;
  activeFilter: ExploreFilter;
  searchState: ExploreSearchState;
  peopleResults: ExploreUserResult[];
  tweetResults: ExploreTweetResult[];
  error: string | null;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: ExploreFilter) => void;
  onOpenProfile: (username: string) => void;
}

export const ExplorePanel = ({
  query,
  activeFilter,
  searchState,
  peopleResults,
  tweetResults,
  error,
  onQueryChange,
  onFilterChange,
  onOpenProfile,
}: ExplorePanelProps) => {
  const normalizedQuery = query.trim();
  const effectiveSearchState: ExploreSearchState = normalizedQuery ? searchState : "idle";

  return (
    <ExploreRootStyled>
      <SearchFormStyled onSubmit={(event) => event.preventDefault()} aria-label="Explore search form">
        <SearchInputStyled
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search users or tweets"
          aria-label="Search users by name or username, or tweets by content"
        />
      </SearchFormStyled>

      <TabsRowStyled role="tablist" aria-label="Explore result filters">
        <TabButtonStyled
          type="button"
          role="tab"
          aria-selected={activeFilter === "most-recent"}
          $isActive={activeFilter === "most-recent"}
          onClick={() => onFilterChange("most-recent")}
        >
          Most recent
        </TabButtonStyled>
        <TabButtonStyled
          type="button"
          role="tab"
          aria-selected={activeFilter === "people"}
          $isActive={activeFilter === "people"}
          onClick={() => onFilterChange("people")}
        >
          People
        </TabButtonStyled>
      </TabsRowStyled>

      {effectiveSearchState === "idle" && <StateTextStyled>Start typing to search users or tweets.</StateTextStyled>}

      {effectiveSearchState === "loading" && (
        <StateTextStyled>Searching {activeFilter === "people" ? "people" : "tweets"}...</StateTextStyled>
      )}

      {effectiveSearchState === "empty" && !error && normalizedQuery && (
        <StateTextStyled>
          No {activeFilter === "people" ? "people" : "tweets"} found for "{normalizedQuery}".
        </StateTextStyled>
      )}

      {error && normalizedQuery && <StateTextStyled>{error}</StateTextStyled>}

      {effectiveSearchState === "results" && activeFilter === "people" && (
        <UserResultsListStyled>
          {peopleResults.map((userResult) => (
            <UserResultItemStyled key={userResult.id}>
              <UserResultCardStyled type="button" onClick={() => onOpenProfile(userResult.username)}>
                <UserAvatarStyled src={userResult.profileImage} alt={`Photo of ${userResult.username}`} />
                <div>
                  <UserNameStyled>{userResult.name}</UserNameStyled>
                  <UserUsernameStyled>@{userResult.username}</UserUsernameStyled>
                </div>
              </UserResultCardStyled>
            </UserResultItemStyled>
          ))}
        </UserResultsListStyled>
      )}

      {effectiveSearchState === "results" && activeFilter === "most-recent" && (
        <div>
          {tweetResults.map((tweetResult) => (
            <TweetCard
              key={tweetResult.id}
              tweet={tweetResult}
              timeLabel={formatTimeAgo(tweetResult.createdAt)}
            />
          ))}
        </div>
      )}
    </ExploreRootStyled>
  );
};
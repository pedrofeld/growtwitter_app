import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TweetCard } from "../components/TweetCard/TweetCard";
import exploreService from "../config/services/explore.service";
import type { ExploreFilter, ExploreSearchState, ExploreTweetResult, ExploreUserResult } from "../models/explore";
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
} from "./Explore.styles";

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const seconds = (Date.now() - date.getTime()) / 1000;

    if (seconds < 60) return "now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;

    return `${Math.floor(seconds / 86400)}d`;
}

const SEARCH_DEBOUNCE_MS = 350;

export const ExplorePage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<ExploreFilter>("most-recent");
    const [searchState, setSearchState] = useState<ExploreSearchState>("idle");
    const [peopleResults, setPeopleResults] = useState<ExploreUserResult[]>([]);
    const [tweetResults, setTweetResults] = useState<ExploreTweetResult[]>([]);
    const [error, setError] = useState<string | null>(null);

    const requestIdRef = useRef(0);
    const abortControllerRef = useRef<AbortController | null>(null);

    const normalizedQuery = useMemo(() => query.trim(), [query]);
    const effectiveSearchState: ExploreSearchState = normalizedQuery ? searchState : "idle";

    useEffect(() => {
        if (!normalizedQuery) {
            abortControllerRef.current?.abort();
            return;
        }

        const timeout = window.setTimeout(() => {
            const currentRequestId = requestIdRef.current + 1;
            requestIdRef.current = currentRequestId;

            abortControllerRef.current?.abort();
            const nextController = new AbortController();
            abortControllerRef.current = nextController;

            async function runSearch() {
                setSearchState("loading");
                setError(null);

                const response =
                    activeFilter === "people"
                        ? await exploreService.searchPeople(normalizedQuery, nextController.signal)
                        : await exploreService.searchMostRecent(normalizedQuery, nextController.signal);

                if (requestIdRef.current !== currentRequestId) return;

                if (!response.ok) {
                    if (response.message === "Request canceled") return;

                    setError("Could not load search results.");
                    setSearchState("empty");
                    if (activeFilter === "people") setPeopleResults([]);
                    if (activeFilter === "most-recent") setTweetResults([]);
                    return;
                }

                if (activeFilter === "people") {
                    const users = (response.data ?? []) as ExploreUserResult[];
                    setPeopleResults(users);
                    setSearchState(users.length > 0 ? "results" : "empty");
                    return;
                }

                const tweets = (response.data ?? []) as ExploreTweetResult[];
                setTweetResults(tweets);
                setSearchState(tweets.length > 0 ? "results" : "empty");
            }

            void runSearch();
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [activeFilter, normalizedQuery]);

    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    return (
        <ExploreRootStyled>
            <SearchFormStyled onSubmit={(event) => event.preventDefault()} aria-label="Explore search form">
                <SearchInputStyled
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
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
                    onClick={() => setActiveFilter("most-recent")}
                >
                    Most recent
                </TabButtonStyled>
                <TabButtonStyled
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === "people"}
                    $isActive={activeFilter === "people"}
                    onClick={() => setActiveFilter("people")}
                >
                    People
                </TabButtonStyled>
            </TabsRowStyled>

            {effectiveSearchState === "idle" && (
                <StateTextStyled>Start typing to search users or tweets.</StateTextStyled>
            )}

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
                            <UserResultCardStyled type="button" onClick={() => navigate(`/profile/${userResult.id}`)}>
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
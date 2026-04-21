import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExplorePanel } from "../components/ExplorePanel/ExplorePanel";
import exploreService from "../config/services/explore.service";
import type { ExploreFilter, ExploreSearchState, ExploreTweetResult, ExploreUserResult } from "../models/explore";

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
        <ExplorePanel
            query={query}
            activeFilter={activeFilter}
            searchState={effectiveSearchState}
            peopleResults={peopleResults}
            tweetResults={tweetResults}
            error={error}
            onQueryChange={setQuery}
            onFilterChange={setActiveFilter}
            onOpenProfile={(username) => navigate(`/profile/${username}`)}
        />
    );
};
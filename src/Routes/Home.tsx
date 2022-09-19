import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
import {
    getTopRated,
    getNowPlaying,
    IGetMoviesResult,
    getUpcoming,
} from "../api";
import { Banner } from "../Components/Banner";
import { MovieDetail } from "../Components/MovieDetail";
import { Slider } from "../Components/Slider";

const Wrapper = styled.div`
    background: black;
    overflow-x: hidden;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

function Home() {
    const { data: nowPlaying, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"],
        getNowPlaying
    );
    const { data: topRated, isLoading: isLoadingTopRated } =
        useQuery<IGetMoviesResult>(["movies", "topRated"], getTopRated);

    const { data: upcoming, isLoading: isLoadingUpcoming } =
        useQuery<IGetMoviesResult>(["movies", "upComing"], getUpcoming);

    const bigMovieMatch = useMatch("movies/:link/:movieId");

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading..</Loader>
            ) : (
                <>
                    <Banner movie={nowPlaying?.results[0]}></Banner>
                    <Slider
                        movies={nowPlaying?.results.slice(1)}
                        category="Now Playing"
                        link="now-playing"
                    />
                    <Slider
                        movies={topRated?.results}
                        category="Top Rated"
                        link="top-rated"
                    />
                    <Slider
                        movies={upcoming?.results}
                        category="Upcoming"
                        link="upcoming"
                    />

                    {bigMovieMatch && <MovieDetail />}
                </>
            )}
        </Wrapper>
    );
}

export default Home;

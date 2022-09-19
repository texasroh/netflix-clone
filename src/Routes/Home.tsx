import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
import {
    getTopRated,
    getNowPlaying,
    IGetMoviesResult,
    getUpcoming,
} from "../api";
import { MovieBanner } from "../Components/MovieBanner";
import { MovieDetail } from "../Components/MovieDetail";
import { MovieSlider } from "../Components/MovieSlider";

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
    const { data: topRated } = useQuery<IGetMoviesResult>(
        ["movies", "topRated"],
        getTopRated
    );

    const { data: upcoming } = useQuery<IGetMoviesResult>(
        ["movies", "upComing"],
        getUpcoming
    );

    const bigMovieMatch = useMatch(
        `${process.env.PUBLIC_URL}/movies/:link/:movieId`
    );

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading..</Loader>
            ) : (
                <>
                    <MovieBanner movie={nowPlaying?.results[0]}></MovieBanner>
                    <MovieSlider
                        movies={nowPlaying?.results.slice(1)}
                        category="Now Playing"
                        link="now-playing"
                    />
                    <MovieSlider
                        movies={topRated?.results}
                        category="Top Rated"
                        link="top-rated"
                    />
                    <MovieSlider
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

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getTopRated, getNowPlaying, IGetMoviesResult } from "../api";
import { Banner } from "../Components/Banner";
import { Slider } from "../Components/Slider";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
    background: black;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
`;

const BigMovie = styled(motion.div)`
    position: fixed;
    width: 40vw;
    height: 80vh;
    top: 50px;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div<{ $bgPhoto: string }>`
    width: 100%;
    height: 400px;
    background-image: linear-gradient(
            to top,
            ${(props) => props.theme.black.lighter},
            transparent
        ),
        url(${(props) => props.$bgPhoto});
    background-size: cover;
    background-position: center center;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px;
    /* text-align: center; */
    font-size: 46px;
    position: relative;
    top: -80px;
`;

const BigOverviwe = styled.p`
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
`;

const offset = 6;

function Home() {
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("movies/:movieId");
    const { data: nowPlaying, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"],
        getNowPlaying
    );
    const { data: topRated, isLoading: isLoadingTopRated } =
        useQuery<IGetMoviesResult>(["movies", "lastest"], getTopRated);

    const onOverlayClicked = () => navigate("/");
    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        nowPlaying?.results.find(
            (movie) => String(movie.id) === bigMovieMatch.params.movieId
        );

    if (bigMovieMatch) {
        console.log(clickedMovie);
    }
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
                    />
                    <Slider movies={topRated?.results} category="Lastest" />
                    <AnimatePresence mode="popLayout">
                        {bigMovieMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClicked}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                                <BigMovie
                                    layoutId={bigMovieMatch.params.movieId}
                                >
                                    {clickedMovie && (
                                        <>
                                            <BigCover
                                                $bgPhoto={makeImagePath(
                                                    clickedMovie.backdrop_path,
                                                    "w500"
                                                )}
                                            />
                                            <BigTitle>
                                                {clickedMovie.title}
                                            </BigTitle>
                                            <BigOverviwe>
                                                {clickedMovie.overview}
                                            </BigOverviwe>
                                        </>
                                    )}
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;

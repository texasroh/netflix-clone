import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
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

const Banner = styled.div<{ $bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        url(${(props) => props.$bgPhoto});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 36px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
`;

const Box = styled(motion.div)`
    font-size: 64px;
    cursor: pointer;
    &:first-child {
        transform-origin: center left;
    }
    &:last-child {
        transform-origin: center right;
    }
`;

const BoxCover = styled.div<{ $bgPhoto: string }>`
    width: 100%;
    height: 180px;
    background-image: url(${(props) => props.$bgPhoto});
    background-position: center center;
    background-size: cover;
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    width: 100%;
    h4 {
        text-align: center;
        font-size: 18px;
    }
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

const rowVariants = {
    hidden: {
        x: window.outerWidth + 10,
    },
    visible: { x: 0 },
    exit: { x: -window.outerWidth - 10 },
};

const boxVariants = {
    normal: {
        scale: 1,
    },
    hover: {
        zIndex: 99,
        scale: 1.3,
        y: -50,
        transition: { delay: 0.5, duration: 0.3, type: "tween" },
    },
};

const infoVariants = {
    hover: {
        opacity: 1,
        transition: { delay: 0.5, duration: 0.3, type: "tween" },
    },
};

const offset = 6;

function Home() {
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("movies/:movieId");
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"],
        getMovies
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data?.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => {
        setLeaving((prev) => !prev);
    };
    const onBoxClicked = (movieId: number) => {
        navigate(`movies/${movieId}`);
    };
    const onOverlayClicked = () => navigate("/");
    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        data?.results.find(
            (movie) => String(movie.id) === bigMovieMatch.params.movieId
        );

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading..</Loader>
            ) : (
                <>
                    <Banner
                        onClick={increaseIndex}
                        $bgPhoto={makeImagePath(
                            data?.results[0].backdrop_path || ""
                        )}
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence
                            initial={false}
                            onExitComplete={toggleLeaving}
                        >
                            <Row
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }}
                                key={index}
                            >
                                {data?.results
                                    .slice(1)
                                    .slice(
                                        offset * index,
                                        offset * index + offset
                                    )
                                    .map((movie) => (
                                        <Box
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            variants={boxVariants}
                                            onClick={() =>
                                                onBoxClicked(movie.id)
                                            }
                                            transition={{ type: "tween" }}
                                            layoutId={movie.id + ""}
                                        >
                                            <BoxCover
                                                $bgPhoto={makeImagePath(
                                                    movie.backdrop_path,
                                                    "w300"
                                                )}
                                            />
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
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

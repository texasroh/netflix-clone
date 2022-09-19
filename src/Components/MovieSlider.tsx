import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
    position: relative;
    top: -170px;
    height: 300px;
`;

const Title = styled.div`
    font-size: 24px;
    padding: 20px 50px;
    font-weight: 600;
`;

const Row = styled(motion.div)`
    position: absolute;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);
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

const Arrow = styled.span`
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid white;
    border-radius: 100%;
    cursor: pointer;
    height: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: black;
    position: absolute;
    top: calc(50% - 25px);
`;

const Left = styled(Arrow)`
    &::before {
        content: "<";
    }
    left: 20px;
`;
const Right = styled(Arrow)`
    &::before {
        content: ">";
    }
    right: 20px;
`;

const rowVariants = {
    entry: (reverse: boolean) => ({
        x: reverse ? window.outerWidth + 10 : -window.outerWidth - 10,
    }),
    visible: { x: 0 },
    exit: (reverse: boolean) => ({
        x: reverse ? -window.outerWidth - 10 : window.outerWidth + 10,
    }),
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

interface SliderProps {
    movies?: IMovie[];
    category: string;
    link: string;
}

const offset = 6;

export const MovieSlider = ({ movies, category, link }: SliderProps) => {
    const navigate = useNavigate();
    const [leaving, setLeaving] = useState(false);
    const [reverse, setReverse] = useState(false);

    const [index, setIndex] = useState(0);
    const increaseIndex = () => {
        if (!leaving && movies) {
            setReverse(false);
            setLeaving(true);
            const totalMovies = movies.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const decreaseIndex = () => {
        if (!leaving && movies) {
            setReverse(true);
            setLeaving(true);
            const totalMovies = movies.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
        }
    };

    const onBoxClicked = (movieId: number) => {
        navigate(`movies/${link}/${movieId}`);
    };

    const onExitComplete = () => {
        setLeaving(false);
        setReverse(false);
    };

    return (
        <Wrapper>
            <Title>{category}</Title>
            <AnimatePresence
                initial={false}
                onExitComplete={onExitComplete}
                mode="popLayout"
                custom={reverse}
            >
                <Row
                    variants={rowVariants}
                    custom={reverse}
                    initial="entry"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={link + index}
                >
                    {movies
                        ?.slice(offset * index, offset * index + offset)
                        .map((movie) => (
                            <Box
                                key={link + movie.id}
                                whileHover="hover"
                                initial="normal"
                                variants={boxVariants}
                                onClick={() => onBoxClicked(movie.id)}
                                transition={{ type: "tween" }}
                                layoutId={link + movie.id}
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
            <Left onClick={increaseIndex} />
            <Right onClick={decreaseIndex} />
        </Wrapper>
    );
};

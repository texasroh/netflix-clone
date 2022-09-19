import { AnimatePresence, motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { getMovieDetail, getTvDetail, IMovieDetail, ITvDetail } from "../api";
import { useQuery } from "react-query";

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

const Info = styled.div`
    position: relative;
    top: -100px;
    padding: 0 20px;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 20px;
`;

const BigTitle = styled.h3`
    color: ${(props) => props.theme.white.lighter};
    /* text-align: center; */
    font-size: 46px;
    padding: 20px 0;
`;

const BigOverviwe = styled.p`
    color: ${(props) => props.theme.white.lighter};
    padding: 20px 0;
    font-size: 16px;
`;

export const TvDetail = () => {
    const navigate = useNavigate();
    const onOverlayClicked = () => navigate("");

    const bigMovieMatch = useMatch("tv/:link/:tvId");
    const link = bigMovieMatch?.params.link;
    const tvId = bigMovieMatch?.params.tvId;
    const { data: tv, isLoading } = useQuery<ITvDetail>(["tv", tvId], () =>
        getTvDetail(tvId!)
    );
    return (
        <AnimatePresence>
            <Overlay
                onClick={onOverlayClicked}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
            <BigMovie layoutId={link! + tvId}>
                {!isLoading && (
                    <>
                        <BigCover
                            $bgPhoto={makeImagePath(tv?.backdrop_path!, "w500")}
                        />
                        <Info>
                            <BigTitle>{tv?.name}</BigTitle>
                            <Row>
                                <span>{tv?.genres.name}</span>
                                <span>
                                    ⭐{Math.round(tv!.vote_average * 100) / 100}{" "}
                                    ({tv?.vote_count})
                                </span>
                            </Row>
                            <BigOverviwe>{tv?.overview}</BigOverviwe>
                        </Info>
                    </>
                )}
            </BigMovie>
        </AnimatePresence>
    );
};

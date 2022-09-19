import styled from "styled-components";
import { ITV } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div<{ $bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        url(${(props) => props.$bgPhoto});
    background-size: cover;
    background-position: center;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 24px;
    width: 50%;
`;

interface BannerProps {
    tv?: ITV;
}

export const TvBanner = ({ tv }: BannerProps) => {
    return (
        <Wrapper $bgPhoto={makeImagePath(tv?.poster_path || "")}>
            <Title>{tv?.name}</Title>
            <div>{tv?.first_air_date}</div>
            <Overview>{tv?.overview}</Overview>
        </Wrapper>
    );
};

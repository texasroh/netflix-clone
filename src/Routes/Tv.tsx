import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import styled from "styled-components";
import {
    ITV,
    getTVLatest,
    IGetTvResult,
    getTvAirToday,
    getTvPopular,
    getTvTopRated,
} from "../api";

import { TvBanner } from "../Components/TvBanner";
import { TvDetail } from "../Components/TvDetail";
import { TvSlider } from "../Components/TvSlider";

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

function Tv() {
    const { data: latest, isLoading: isLoadingLatest } = useQuery<ITV>(
        ["tvs", "latest"],
        getTVLatest
    );
    const { data: airToday } = useQuery<IGetTvResult>(
        ["tvs", "air_today"],
        getTvAirToday
    );
    const { data: popular } = useQuery<IGetTvResult>(
        ["tvs", "popular"],
        getTvPopular
    );
    const { data: topRated } = useQuery<IGetTvResult>(
        ["tvs", "top_rated"],
        getTvTopRated
    );

    const bigTvMatch = useMatch(`${process.env.PUBLIC_URL}/tv/:link/:tvId`);

    return (
        <Wrapper>
            {isLoadingLatest ? (
                <Loader>Loading..</Loader>
            ) : (
                <>
                    <TvBanner tv={latest}></TvBanner>
                    <TvSlider
                        tvs={airToday?.results}
                        link="air-today"
                        category="Air Today"
                    />
                    <TvSlider
                        tvs={popular?.results}
                        link="popular"
                        category="Popular"
                    />
                    <TvSlider
                        tvs={topRated?.results}
                        link="top-rated"
                        category="Top Rated"
                    />
                    {bigTvMatch && <TvDetail />}
                </>
            )}
        </Wrapper>
    );
}

export default Tv;

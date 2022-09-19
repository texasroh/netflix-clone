import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { IGetMoviesResult, IGetTvResult, searchMovie, searchTv } from "../api";
import styled from "styled-components";
import { MovieSlider } from "../Components/MovieSlider";
import { TvSlider } from "../Components/TvSlider";

const Wrapper = styled.div`
    background: black;
    overflow-x: hidden;
`;

const Info = styled.div`
    height: 450px;
    padding-top: 150px;
    font-size: 50px;
    text-align: center;
`;

const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
function Search() {
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const { data: movies, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "search"],
        () => searchMovie(keyword!)
    );
    const { data: tvs } = useQuery<IGetTvResult>(["tvs", "search"], () =>
        searchTv(keyword!)
    );

    console.log("movies", movies);
    console.log("tvs", tvs);

    return (
        <Wrapper>
            {isLoading ? (
                <Loader> Loading.. </Loader>
            ) : (
                <>
                    <Info>Search for: {keyword}</Info>
                    <MovieSlider
                        movies={movies?.results}
                        category="Movies"
                        link="movie"
                    />

                    <TvSlider tvs={tvs?.results} category="TVs" link="tv" />
                </>
            )}
        </Wrapper>
    );
}

export default Search;

const API_KEY = "c183a5884681c02c32b9c0dad01728ba";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview: string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface IMovieDetail {
    id: number;
    backdrop_path: string;
    popularity: number;
    production_companies: {
        name: string;
        logo_path: string;
    };
    release_date: string;
    runtime: number;
    title: string;
    vote_average: number;
    vote_count: number;
    overview: string;
}

export function getMovieDetail(movieId: string) {
    return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export function getNowPlaying() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export function getTopRated() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export function getUpcoming() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
        (response) => response.json()
    );
}

export function getSearch() {
    return fetch(`${BASE_PATH}/`);
}

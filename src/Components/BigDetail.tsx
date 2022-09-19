import { AnimatePresence } from "framer-motion";

export const BigDetail = () => {
    return (
        <AnimatePresence mode="popLayout">
            {bigMovieMatch ? (
                <>
                    <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <BigMovie layoutId={bigMovieMatch.params.movieId}>
                        {clickedMovie && (
                            <>
                                <BigCover
                                    $bgPhoto={makeImagePath(
                                        clickedMovie.backdrop_path,
                                        "w500"
                                    )}
                                />
                                <BigTitle>{clickedMovie.title}</BigTitle>
                                <BigOverviwe>
                                    {clickedMovie.overview}
                                </BigOverviwe>
                            </>
                        )}
                    </BigMovie>
                </>
            ) : null}
        </AnimatePresence>
    );
};

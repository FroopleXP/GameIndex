import Game from "./types/Game";

interface IGameSearch {
    search(term: string): Promise<Game[]>
}

export default IGameSearch;
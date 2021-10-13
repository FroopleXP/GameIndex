import IGameSearch from "../IGameSearch";
import IFileRepo from "../../../repo/IFileRepo";
import File from "../../../repo/types/File";
import Game from "../types/Game";

class GameSearch implements IGameSearch {

    private fileRepo: IFileRepo;

    constructor(fileRepo: IFileRepo) {
        this.fileRepo = fileRepo;
    }

    public async search(term: string): Promise<Game[]> {
        const files: File[] = await this.fileRepo.searchByName(term);
        const gameFiles: File[] = files.filter(Game.isGame);
        return gameFiles.map(file => new Game(file));
    }

}

export default GameSearch;
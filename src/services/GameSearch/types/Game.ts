import File, { Format } from "../../../repo/types/File";

class Game {

    public readonly file: File;
    public readonly name: string;

    constructor(file: File) {
        this.file = file;
        this.name = this.setName(file);
    }

    private setName(file: File): string {
        return file.name.split(" [")[0];
    }

    // Determines if a given file is a downloadable game
    static isGame(file: File): boolean {

        const isTorrent: boolean = file.original.includes(".torrent");
        const isSevenZip: boolean = file.format === Format.SevenZip;

        return isTorrent && isSevenZip;
    }

}

export default Game;
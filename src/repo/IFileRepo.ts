import File from "./types/File";

interface IFileRepo {
    searchByName(term: string): Promise<File[]>
}

export default IFileRepo;


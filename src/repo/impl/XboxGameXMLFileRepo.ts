import fs from "fs";
import { DOMParser } from "xmldom";

import IFileRepo from "../IFileRepo";
import FileMapper from "../mappers/FileMapper";
import File from "../types/File";

class XboxGameXMLFileRepo implements IFileRepo {

    private index: Document;

    constructor(indexFile: string) {
        this.index = this.parseIndexFile(this.readIndexFile(indexFile));
    }

    private parseIndexFile(toParse: string): Document {
        try {
            return new DOMParser().parseFromString(toParse, "text/xml");
        } catch (err) {
            throw new Error(`Failed to parse index file: ${err}`);
        }
    }

    private readIndexFile(location: string): string {
        try {
            return fs.readFileSync(location, "utf-8");
        } catch (err) {
            throw new Error(`Failed to open index file: ${err}`);
        }
    }

    public async searchByName(term: string): Promise<File[]> {

        const allFiles: HTMLCollectionOf<Element> = this.index.getElementsByTagName("file");
        const results: File[] = [];

        for (let i: number = 0; i < allFiles.length; i++) {
            const file: Element = allFiles[i];
            const name: string | null = file.getAttribute("name");

            if (!name) continue;
            if (!name.includes(term)) continue;

            results.push(FileMapper.FromXMLElement(file));
        }

        return results;

    }

}

export default XboxGameXMLFileRepo;
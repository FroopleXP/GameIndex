import Result from "./Result";

export enum TorrentContentsTypeDTO {
    File = "file",
    Directory = "dir"
}

export type TorrentContentsDTO = {
    [key: string]: {
        download: boolean,
        length: number,
        type: string,
        contents?: TorrentContentsDTO,
        index?: number
    }
}

export type TorrentDTO = {
    files_tree: {
        type?: string,
        contents: TorrentContentsDTO
    },
    name: string,
    info_hash: string
}

type TorrentResponseDTO = Result<TorrentDTO>;

export default TorrentResponseDTO;
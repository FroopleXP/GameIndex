import axios, { AxiosResponse, AxiosInstance } from "axios";
import fs, { ReadStream } from "fs";
import FormData from "form-data";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import LoginResponseDTO from "./dto/LoginResponse";
import UploadResponseDTO from "./dto/UploadResponse";
import TorrentResponseDTO from "./dto/TorrentResponse";
import Torrent, { TorrentContent } from "./Torrent";
import TorrentContentMapper from "./mappers/TorrentContentMapper";
import SubmitResponseDTO from "./dto/SubmitResponse";

type TorrentDownloadOptions = {
    addPaused?: boolean,
    compactAllocation?: boolean,
    downloadLocation?: string,
    maxConnections?: number,
    maxDownloadSpeed?: number,
    maxUploadSlots?: number,
    maxUploadSpeed?: number,
    moveCompleted?: boolean,
    moveCompletedPath?: string,
    prioritiseFirstLastPieces?: boolean,
    filePriorities?: number[]
}

const defTorrentDownloadOptions: TorrentDownloadOptions = {
    addPaused: false,
    compactAllocation: false,
    downloadLocation: "/tmp",
    maxConnections: -1,
    maxDownloadSpeed: -1,
    maxUploadSlots: -1,
    maxUploadSpeed: -1,
    moveCompleted: false,
    moveCompletedPath: "/tmp",
    prioritiseFirstLastPieces: false
}

class Deluge {

    private httpClient: AxiosInstance;
    private host: string;
    private cookieJar: CookieJar;

    constructor(host: string) {
        this.host = host;
        this.cookieJar = new CookieJar();
        this.httpClient = wrapper(axios.create({ jar: this.cookieJar }));
    }

    private async uploadFile(location: string): Promise<string> {

        const file: ReadStream = fs.createReadStream(location);
        const form: FormData = new FormData();
        form.append("file", file);

        const response: AxiosResponse<UploadResponseDTO> = await this.httpClient.post(`${this.host}/upload`, form, {
            headers: { ...form.getHeaders() }
        });

        if (!response.data.success || response.data.files.length == 0) {
            throw new Error("Failed to upload image");
        }

        return response.data.files[0];

    }

    private async getTorrentInfo(tmpFileLocation: string): Promise<Torrent> {

        const response: AxiosResponse<TorrentResponseDTO> = await this.httpClient.post(`${this.host}/json`, {
            id: 1,
            method: "web.get_torrent_info",
            params: [tmpFileLocation]
        });

        if (response.data.error !== null) {
            throw new Error(response.data.error.message);
        }

        if (response.data.result == null) {
            throw new Error("Failed to get Torrent info.")
        }

        return TorrentContentMapper.fromDto(response.data.result, tmpFileLocation);

    }

    private getFilePriorities(torrent: Torrent): number[] {

        const root: TorrentContent | null = torrent.getContents();
        let priority: number[] = [0];

        const addPriority = (node: TorrentContent): void => {
            if (node.index !== null) {
                priority[node.index] = (node.getDownload()) ? 1 : 0;
            }
            if (node.hasChildren()) {
                return node.getChildren().forEach(addPriority);
            }
        }

        // No root? No fun, bye!
        if (!root) return [];

        addPriority(root);

        return priority;

    }

    public async login(password: string): Promise<void> {

        const response: AxiosResponse<LoginResponseDTO> = await this.httpClient.post(`${this.host}/json`, {
            id: 1,
            method: "auth.login",
            params: [password]
        });

        if (response.data.error !== null) {
            throw new Error(response.data.error.message);
        }

        if (!response.data.result) {
            throw new Error("Wrong password");
        }

    }

    public async upload(location: string): Promise<Torrent> {
        const tmpFilePath: string = await this.uploadFile(location);
        return await this.getTorrentInfo(tmpFilePath);
    }

    public async download(torrent: Torrent, options?: TorrentDownloadOptions): Promise<void> {

        const opts: TorrentDownloadOptions = {
            ...defTorrentDownloadOptions,
            ...options,
            filePriorities: this.getFilePriorities(torrent)
        }

        const response: AxiosResponse<SubmitResponseDTO> = await this.httpClient.post(`${this.host}/json`, {
            id: 13,
            method: "web.add_torrents",
            params: [
                [
                    {
                        options: opts,
                        path: torrent.path
                    }
                ]
            ]
        });

        if (response.data.error !== null) {
            throw new Error(response.data.error.message);
        }

        if (!response.data.result) {
            throw new Error("Failed to set Torrent for download");
        }

    }

}

export default Deluge;
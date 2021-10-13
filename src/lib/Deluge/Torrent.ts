export enum TorrentContentType {
    File = "file",
    Directory = "dir"
}

export enum FileSize {
    GiB = 10e-9,
    MiB = 10e-6,
    KiB = 10e-3
}

export class TorrentContent {

    public readonly type: TorrentContentType;
    public readonly name: string;
    public readonly sizeBytes: number;
    public readonly depth: number;
    public readonly index: number | null;

    private parent: TorrentContent | null = null;
    private children: TorrentContent[] = [];
    private download: boolean = false;

    constructor(
        parent: TorrentContent | null,
        name: string,
        sizeBytes: number,
        type: TorrentContentType,
        index: number | null
    ) {
        this.parent = parent;
        this.type = type;
        this.name = name;
        this.sizeBytes = sizeBytes;
        this.depth = this.getDepth();
        this.index = index;
    }

    private getDepth(): number {
        if (!this.parent) return 0;
        return this.parent.depth + 1;
    }

    public getDownload(): boolean {
        return this.download;
    }

    public setDownload(download: boolean): void {
        this.download = download;
        this.getChildren().forEach(child => child.setDownload(download));
    }

    public addChild(child: TorrentContent): void {
        this.children.push(child);
    }

    public hasParent(): boolean {
        if (this.parent !== null) return true;
        return false;
    }

    public hasChildren(): boolean {
        if (this.children.length !== 0) return true;
        return false;
    }

    public getParent(): TorrentContent | null {
        return this.parent;
    }

    public getChildren(): TorrentContent[] {
        return this.children;
    }

    public getSize(unit?: FileSize): number {
        if (!unit) return this.sizeBytes;
        return this.sizeBytes * unit;
    }

}

class Torrent {

    public readonly name: string;
    public readonly hash: string;
    public readonly path: string;

    private contents: TorrentContent | null = null;

    constructor(name: string, hash: string, path: string) {
        this.name = name;
        this.hash = hash;
        this.path = path;
    }

    public hasContents(): boolean {
        if (this.contents !== null) return true;
        return false;
    }

    public setContents(contents: TorrentContent): void {
        this.contents = contents;
    }

    public getContents(): TorrentContent | null {
        return this.contents;
    }

}

export default Torrent;
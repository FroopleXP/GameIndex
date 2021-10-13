export enum Format {
    SevenZip = "7z",
    Text = "txt"
}

type File = {
    name: string,
    format: Format | null,
    original: string,
    size: number
}

export default File;
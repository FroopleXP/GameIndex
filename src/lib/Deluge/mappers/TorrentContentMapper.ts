import { TorrentContentsDTO, TorrentDTO } from "../dto/TorrentResponse";
import Torrent, { TorrentContent, TorrentContentType } from "../Torrent";
import { nullIfUndefined } from "../utils";

function toContentType(toMap: string): TorrentContentType {
    switch (toMap) {
        case "file":
            return TorrentContentType.File;
        case "dir":
            return TorrentContentType.Directory;
        default:
            return TorrentContentType.File;
    }
}

class TorrentContentMapper {

    public static fromDto(dto: TorrentDTO, path: string): Torrent {

        // uRoot = un-mapped root node
        const torrent: Torrent = new Torrent(dto.name, dto.info_hash, path);
        const toMap: TorrentContentsDTO = dto.files_tree.contents;

        // Get the first index (name) to create the root node
        const rName: string = Object.keys(toMap)[0];
        const rSizeBytes: number = toMap[rName].length;
        const rType: TorrentContentType = toContentType(toMap[rName].type);
        const rIndex: number | null = nullIfUndefined<number>(toMap[rName].index);

        // Create the root node
        const root: TorrentContent = new TorrentContent(null, rName, rSizeBytes, rType, rIndex);

        // We know the root will have children, populate them
        const mapChildren = (parent: TorrentContent, toMap: TorrentContentsDTO | undefined): void => {

            if (!toMap) return;

            Object.keys(toMap).forEach((key) => {

                // Get the first index (name) to create the root node
                const name: string = key;
                const sizeBytes: number = toMap[name].length;
                const type: TorrentContentType = toContentType(toMap[name].type);
                const index: number | null = nullIfUndefined<number>(toMap[name].index);

                // Create the child and set the parent
                const child: TorrentContent = new TorrentContent(parent, name, sizeBytes, type, index);

                // Add the new child to the parent
                parent.addChild(child);

                // If we have contents, we're a parent - recur!
                mapChildren(child, toMap[key].contents);

            });
        }

        // Check if the root will have children, if not we're done
        if (!toMap[rName].contents) {
            torrent.setContents(root);
            return torrent;
        }

        // Run the mapping
        mapChildren(root, toMap);

        // Finally, add the content to the Torrent and return
        torrent.setContents(root);
        return torrent;

    }

}

export default TorrentContentMapper;
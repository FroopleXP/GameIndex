import File, { Format } from "../types/File";

class FileMapper {

    public static FromXMLElement(xml: Element): File {

        let name: string = "";
        let format: Format | null = null;
        let original: string = "";
        let size: number = 0;

        // Name mapping
        const nameAttr: string | null = xml.getAttribute("name");
        if (nameAttr !== null) {
            name = nameAttr;
        }

        // Size mapping
        const sizeEl: Element | null = xml.getElementsByTagName("size").item(0);
        if (sizeEl !== null && sizeEl.textContent !== null) {
            size = parseInt(sizeEl.textContent);
        }

        // Original mapping
        const originalEl: Element | null = xml.getElementsByTagName("original").item(0);
        if (originalEl !== null && originalEl.textContent !== null) {
            original = originalEl.textContent;
        }

        // Format mapping
        const formatEl: Element | null = xml.getElementsByTagName("format").item(0);
        if (formatEl !== null && formatEl.textContent !== null) {
            switch (formatEl.textContent) {
                case "7z":
                    format = Format.SevenZip;
                    break;
                case "Text":
                    format = Format.Text;
                    break;
                default:
                    format = null;
            }
        }

        return {
            name,
            format,
            original,
            size
        };

    }

}

export default FileMapper;
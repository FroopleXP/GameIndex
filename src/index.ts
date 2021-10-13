import IGameSearch from "./services/GameSearch/IGameSearch";
import GameSearch from "./services/GameSearch/impl/GameSearch";
import IFileRepo from "./repo/IFileRepo";
import XboxGameXMLFileRepo from "./repo/impl/XboxGameXMLFileRepo";
import Deluge from "./lib/Deluge/Deluge";
import Torrent from "./lib/Deluge/Torrent";

// const fileRepo: IFileRepo = new XboxGameXMLFileRepo(__dirname + "/../data/romset.xml");
// const gameSearch: IGameSearch = new GameSearch(fileRepo);

(async () => {

    try {

        // const games: Game[] = await gameSearch.search("dick");

        const deluge: Deluge = new Deluge("http://localhost:8112");

        await deluge.login("deluge");

        const torrent: Torrent = await deluge.upload(__dirname + "/../data/archive.torrent");

        await deluge.download(torrent, {
            downloadLocation: "/User/froople/Downloads"
        });

    } catch (err) {
        console.error(err);
    }

})();

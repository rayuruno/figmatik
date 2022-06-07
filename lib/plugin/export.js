const DefaultOpts = {
    format: "jpg",
    scale: 1,
};
const { entries, keys } = Object;
export default {
    name: "export",
    init(figmatik) {
        figmatik.export = async function (nodes, options) {
            let reqs = nodes.reduce((g, n) => {
                g[n.file.fileKey] ||= {};
                g[n.file.fileKey][n.id] = n;
                return g;
            }, {});
            let imgs = [];
            for (const [fileKey, idMap] of entries(reqs)) {
                for (let opt of options) {
                    opt = { ...DefaultOpts, ...opt };
                    let res = await figmatik.api.images({
                        fileKey,
                        ids: keys(idMap),
                        ...opt,
                    });
                    for (const [id, url] of entries(res.images)) {
                        let buffer = await figmatik.http.request(new URL(url));
                        imgs.push({
                            node: idMap[id],
                            buffer,
                            ...opt,
                        });
                    }
                }
            }
            return imgs;
        };
    },
};

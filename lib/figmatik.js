import * as http from "./http.js";
import * as api from "./api.js";
import * as plugin from "./plugin.js";
export class Figmatik {
    http;
    api;
    constructor(config = {}) {
        config.plugins ||= [];
        if (!config.plugins.find((p) => p.name === "text")) {
            config.plugins.unshift(plugin.text());
        }
        if (!config.plugins.find((p) => p.name === "style")) {
            config.plugins.unshift(plugin.style());
        }
        config.plugins.unshift(plugin.export, plugin.selector);
        this.http = {
            request: http.Request(config.cache),
        };
        const endpointConfig = { ...config, request: this.http.request };
        this.api = {
            files: api.Files(endpointConfig),
            images: api.Images(endpointConfig),
        };
        config.plugins.forEach((p) => this.use(p));
    }
    use(plugin) {
        if (!plugin.init)
            return;
        plugin.init(this);
    }
}

import * as http from "./http.js";
import * as cache from "./cache.js";
import * as api from "./api.js";
import * as plugin from "./plugin.js";

export interface FigmatikConfig {
  token?: string;
  cache?: cache.CacheStore;
  plugins?: plugin.Plugin[];
}

export class Figmatik {
  readonly http;
  readonly api;

  constructor(config: FigmatikConfig = {}) {
    config.plugins ||= [];
    config.plugins.unshift(
      plugin.export,
      plugin.selector,
      plugin.text,
      plugin.style
    );

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

  use(plugin: plugin.Plugin) {
    if (!plugin.init) return;

    plugin.init(this);
  }
}

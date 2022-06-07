type GetFilesRequest = GetFilesParams & { fileKey: string };

type GetFilesParams = {
  version?: string;
  ids?: string[];
  depth?: number;
  geometry?: string;
  plugin_data?: string;
  branch_data?: string;
};

interface GetFilesResponse {
  readonly name: string;
  readonly role: string;
  readonly lastModified: string;
  readonly editorType: string;
  readonly thumbnailUrl: string;
  readonly version: string;
  readonly document: DocumentNode;
  readonly components: Record<string, Component>;
  readonly componentSets: Record<string, ComponentSet>;
  readonly schemaVersion: 0;
  readonly styles: Record<string, Style>;
  readonly mainFileKey: string;
  readonly branches: [
    {
      readonly key: string;
      readonly name: string;
      readonly thumbnail_url: string;
      readonly last_modified: string;
      readonly link_access: string;
    }
  ];
}

type GetImagesRequest = GetImagesParams & { fileKey: string };

type GetImagesParams = {
  ids: string[];
  format?: "jpg" | "png" | "svg" | "pdf";
  version?: string;
  scale?: number;
  svg_include_id?: boolean;
  svg_simplify_stroke?: boolean;
  use_absolute_bounds?: boolean;
};

interface GetImagesResponse {
  readonly err: string;
  readonly images: Record<string, string>;
  readonly status: number;
}

interface FileApi extends Omit<GetFilesResponse, "document"> {
  fileKey: string;
  document: DocumentApi;
}

interface DocumentApi extends NodeApi<DocumentNode> {
  children: CanvasApi[];
}

interface CanvasApi extends NodeApi<CanvasNode> {
  children: NodeApi<SceneNode>[];
}

type NodeApi<T extends Node = Node> = T & {
  file: FileApi;
  props: Record<string, string>;
  index: number;
  parent: NodeApi;
  children: NodeApi[];

  walk(cb: (node?: NodeApi) => boolean | void): void;
  iterate(): Generator<NodeApi, any, any>;
  find(pre: (node?: NodeApi) => boolean | void): NodeApi | undefined;
  findAll(pre: (node?: NodeApi) => boolean | void): NodeApi[];
  ancestors(): NodeApi[];
};

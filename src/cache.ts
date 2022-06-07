import { writeFile, readFile, mkdir, unlink, stat } from "fs/promises";
import { dirname, join } from "path";
import { createHash } from "crypto";
import os from "os";

export interface CacheStore {
  exists(path: string): Promise<boolean>;
  read(path: string): Promise<Buffer>;
  write(path: string, data: Buffer | string): Promise<undefined>;
  delete(path: string): Promise<undefined>;
}

export class FileCache implements CacheStore {
  tmpdir!: string;

  constructor(tmpdir = os.tmpdir()) {
    this.tmpdir = tmpdir;
  }

  exists(path: string): Promise<boolean> {
    return stat(this.filepath(path))
      .then((s) => s?.isFile())
      .catch((e) => false);
  }

  read(path: string): Promise<Buffer> {
    return readFile(this.filepath(path));
  }

  async write(path: string, data: string | Buffer): Promise<undefined> {
    const filepath = this.filepath(path);

    await mkdir(dirname(filepath), {
      recursive: true,
    }).catch(() => {});

    await writeFile(filepath, data);
    return;
  }

  async delete(path: string): Promise<undefined> {
    await unlink(this.filepath(path));
    return;
  }

  filepath(path: string) {
    return join(
      this.tmpdir,
      createHash("md5").update(path.replace(/\W|\s/g, "")).digest("hex")
    );
  }
}

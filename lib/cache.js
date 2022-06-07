import { writeFile, readFile, mkdir, unlink, stat } from "fs/promises";
import { dirname, join } from "path";
import { createHash } from "crypto";
import os from "os";
export class FileCache {
    tmpdir;
    constructor(tmpdir = os.tmpdir()) {
        this.tmpdir = tmpdir;
    }
    exists(path) {
        return stat(this.filepath(path))
            .then((s) => s?.isFile())
            .catch((e) => false);
    }
    read(path) {
        return readFile(this.filepath(path));
    }
    async write(path, data) {
        const filepath = this.filepath(path);
        await mkdir(dirname(filepath), {
            recursive: true,
        }).catch(() => { });
        await writeFile(filepath, data);
        return;
    }
    async delete(path) {
        await unlink(this.filepath(path));
        return;
    }
    filepath(path) {
        return join(this.tmpdir, createHash("md5").update(path.replace(/\W|\s/g, "")).digest("hex"));
    }
}

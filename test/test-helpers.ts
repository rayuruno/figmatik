import nock from "nock";
import { join } from "path";
import { readFile } from "fs/promises";

export async function mock(host: string, path: string, status: number) {
  nock(host)
    .get(path)
    .reply(
      status,
      await readFile(
        join(
          "./test/fixtures/responses",
          join(host, path).replace(/\W|\s/g, "")
        )
      )
    );
}

export function response(file: string): Promise<Buffer> {
  return readFile(join("./test/fixtures/responses", file));
}

export const contentFileKey = "KObTiYNzH7zah3VSknbeki";
export const contentFileVersion = "1875943475";
export const materialFileKey = "ZsaaakKEgys8zPMBaUbFz3";

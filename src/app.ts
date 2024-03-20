import cors from '@fastify/cors';
import { initServer } from "@ts-rest/fastify";
import { fastify } from "fastify";
import fs from 'fs-extra';
import { join } from "node:path";
import { contract } from "./contract";

const app = fastify({ bodyLimit: 200 * 1024 * 1024 });

const s = initServer();

type FileWriteCommand = {
  content: string,
  path: string
};

async function writeFile({ content, path }: FileWriteCommand) {
  const realPath = join(__dirname, '..', 'out', path);
  await fs.outputFile(realPath, content);
}

const router = s.router(contract, {
  write: async ({ body }) => {
    await writeFile(body);
    return {
      status: 201,
      body: { res: 'ok' },
    };
  },
});

app.register(cors, {});

app.register(s.plugin(router),{});

const port = 3001;

const start = async () => {
  try {
    await app.listen({ port }, () => {
      console.log(`start at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
    app.log.error(err);
    console.error('文件服务启动失败');
    process.exit(1);
  }
};

start();

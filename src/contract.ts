import { initContract } from '@ts-rest/core';

const c = initContract();

export const contract = c.router({
  write: {
    method: 'POST',
    path: '/compile',
    responses: {
      201: c.type<any>(),
    },
    body: c.type<{ path: string; content: string }>(),
    summary: 'Compile Nasl',
  },
});


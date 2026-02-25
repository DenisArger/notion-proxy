import test from 'node:test';
import assert from 'node:assert/strict';
import { handler as proxyHandler } from '../netlify/functions/notion-proxy.js';
import { handler as redirectsHandler } from '../netlify/functions/redirects.js';

test('notion proxy returns 400 when auth header is missing', async () => {
  const res = await proxyHandler({ headers: {}, path: '/x', httpMethod: 'POST', body: '{}' }, {});
  assert.equal(res.statusCode, 400);
});

test('redirects handler returns list payload', async () => {
  const res = await redirectsHandler({}, {});
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.ok(Array.isArray(body.redirects));
});

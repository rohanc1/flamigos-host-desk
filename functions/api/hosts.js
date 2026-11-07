import { json, hostMap } from '../_shared.js';

// Public: the names to show on the sign-in screen. Never returns PINs.
export async function onRequestGet({ env }) {
  return json({ hosts: [...hostMap(env).keys()], configured: hostMap(env).size > 0 });
}

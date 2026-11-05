/**
 * Host half: the board renders entirely in the browser.
 *
 * Eastmoney answers with `access-control-allow-origin: <request origin>`, so the
 * client fetches quotes directly and this plugin needs no server route.
 */

export const name = 'dsh-index-widget'

/** No host-side wiring: the plugin only contributes a client slot entry. */
export function apply() {}

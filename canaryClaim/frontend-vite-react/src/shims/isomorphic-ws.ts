/**
 * Browser-compatible surface for the named export used by Midnight's indexer
 * client. Browsers provide WebSocket globally, so no Node websocket package is
 * included in the client bundle.
 */
const BrowserWebSocket = globalThis.WebSocket;

export { BrowserWebSocket as WebSocket };
export default BrowserWebSocket;

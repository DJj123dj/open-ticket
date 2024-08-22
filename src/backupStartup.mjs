/** === ALTERNATIVE STARTUP METHOD ===
 * This file can be used to start the bot when the default `npm start` (npx tsx src/index.ts) doesn't work!
 * It is not recommended to use this by default, but it is a backup option for certain panels that don't support typescript.
 * 
 * RECOMMENDED ON:
 * - pterodactyl based panels
 * - pebblehost
 * - and more
 */

import "tsx"
import("./index.ts")
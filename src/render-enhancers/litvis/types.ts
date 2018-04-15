import { Cache } from "lru-cache";

import { Cache as LitvisCache } from "../../lib/litvis/cache";

export interface LitvisEnhancerCache {
  litvisCache: LitvisCache;
  successfulRenders: Cache<string, string>;
}

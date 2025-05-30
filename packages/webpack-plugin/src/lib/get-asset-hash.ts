/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

import crypto from "node:crypto";
import type { Asset } from "webpack";

/**
 * @param asset
 * @returns The MD5 hash of the asset's source.
 *
 * @private
 */
export const getAssetHash = (asset: Asset): string | null => {
  // If webpack has the asset marked as immutable, then we don't need to
  // use an out-of-band revision for it.
  // See https://github.com/webpack/webpack/issues/9038
  if (asset.info?.immutable) {
    return null;
  }

  return crypto.createHash("md5").update(asset.source.source()).digest("hex");
};

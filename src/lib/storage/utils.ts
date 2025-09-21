"server only";

import { config } from "@/lib/config";
import { StorageBuckets } from "@/lib/storage/constants";

export const getBucketBaseUrl = (bucketName: StorageBuckets) => {
  return `${config.supabase.storageUrl}/object/public/${bucketName}/`;
};

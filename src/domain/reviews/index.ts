"server only";

import { PreviewName } from "@/lib/images/types";
import prisma from "@/lib/prisma";
import { deleteFile } from "@/lib/storage";
import { StorageBuckets } from "@/lib/storage/constants";
import { getBucketBaseUrl } from "@/lib/storage/utils";

export const getReviewById = async (reviewId: string) => {
  return prisma.reviews.findUnique({ where: { id: reviewId } });
};

export const deleteReview = async (reviewId: string) => {
  const deletedReview = await prisma.reviews.delete({
    where: { id: reviewId },
  });

  if (deletedReview.pictureUrl) {
    const baseFileName = deletedReview.pictureUrl.replace(
      getBucketBaseUrl(StorageBuckets.REVIEW_PICTURES),
      "",
    );

    await Promise.all([
      deleteFile({
        bucketName: StorageBuckets.REVIEW_PICTURES,
        fileName: baseFileName,
      }),
      ...Object.values(PreviewName).map((previewName) =>
        deleteFile({
          bucketName: StorageBuckets.REVIEW_PICTURES,
          fileName: baseFileName.replace(`.jpg`, `_${previewName}.jpg`),
        }),
      ),
    ]);
  }
};

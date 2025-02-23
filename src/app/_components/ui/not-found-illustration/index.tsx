import * as motion from "motion/react-client";

import DropIcon from "@/app/_components/icons/drop";
import TapIcon from "@/app/_components/icons/tap";

const NotFoundIllustration = () => {
  return (
    <div className="relative -mt-48">
      <TapIcon size={192} className="fill-foreground-muted size-48" />

      <motion.div
        className="absolute inset-x-0 z-[-1] mx-auto size-6 origin-top"
        animate={{
          scale: [0, 1, 1],
          bottom: [-22, -24, -500],
          transition: {
            times: [0, 0.75, 1],
            duration: 3,
            ease: "easeIn",
            repeat: Number.POSITIVE_INFINITY,
          },
        }}
      >
        <DropIcon size={24} className="fill-primary/50 size-6" />
      </motion.div>
    </div>
  );
};

export default NotFoundIllustration;

"use client";

import { createContext, useContext } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
import { useMediaQuery } from "@/lib/tailwind/hooks";

import type { ComponentProps } from "react";

type CommonProps<T, U> = {
  [K in keyof T & keyof U]?: T[K] extends U[K] ? U[K] : never;
};

const ResponsiveDialogContext = createContext<boolean | null>(null);

const useIsDesktop = () => {
  const isDesktop = useContext(ResponsiveDialogContext);

  if (isDesktop === null) {
    throw new Error(
      "ResponsiveDialog components must be used within ResponsiveDialog",
    );
  }

  return isDesktop;
};

const ResponsiveDialog = ({
  dismissible,
  ...commonProps
}: CommonProps<ComponentProps<typeof Dialog>, ComponentProps<typeof Drawer>> &
  Pick<ComponentProps<typeof Drawer>, "dismissible">) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <ResponsiveDialogContext.Provider value={isDesktop}>
      {isDesktop ? (
        <Dialog {...commonProps} />
      ) : (
        <Drawer dismissible={dismissible} {...commonProps} />
      )}
    </ResponsiveDialogContext.Provider>
  );
};
ResponsiveDialog.displayName = "ResponsiveDialog";

const ResponsiveDialogPortal = (
  props: CommonProps<
    ComponentProps<typeof DialogPortal>,
    ComponentProps<typeof DrawerPortal>
  >,
) => {
  const isDesktop = useIsDesktop();
  const ResponsiveComponent = isDesktop ? DialogPortal : DrawerPortal;

  return <ResponsiveComponent {...props} />;
};
ResponsiveDialogPortal.displayName = "ResponsiveDialogPortal";

const ResponsiveDialogOverlay = (
  props: CommonProps<
    ComponentProps<typeof DialogOverlay>,
    ComponentProps<typeof DrawerOverlay>
  >,
) => {
  const isDesktop = useIsDesktop();
  const ResponsiveComponent = isDesktop ? DialogOverlay : DrawerOverlay;

  return <ResponsiveComponent {...props} />;
};
ResponsiveDialogOverlay.displayName = "ResponsiveDialogOverlay";

const ResponsiveDialogTrigger = (
  props: CommonProps<
    ComponentProps<typeof DialogTrigger>,
    ComponentProps<typeof DrawerTrigger>
  >,
) => {
  const isDesktop = useIsDesktop();
  const ResponsiveComponent = isDesktop ? DialogTrigger : DrawerTrigger;

  return <ResponsiveComponent {...props} />;
};
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

const ResponsiveDialogClose = (
  props: CommonProps<
    ComponentProps<typeof DialogClose>,
    ComponentProps<typeof DrawerClose>
  >,
) => {
  const isDesktop = useIsDesktop();
  const ResponsiveComponent = isDesktop ? DialogClose : DrawerClose;

  return <ResponsiveComponent {...props} />;
};
ResponsiveDialogClose.displayName = "ResponsiveDialogClose";

const ResponsiveDialogContent = ({
  dismissible,
  ...commonProps
}: CommonProps<
  ComponentProps<typeof DialogContent>,
  ComponentProps<typeof DrawerContent>
> &
  Pick<ComponentProps<typeof Drawer>, "dismissible">) => {
  const isDesktop = useIsDesktop();
  const ResponsiveComponent = isDesktop ? DialogContent : DrawerContent;

  return (
    <ResponsiveComponent data-dismissible={dismissible} {...commonProps} />
  );
};
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

const ResponsiveDialogHeader = (
  props: CommonProps<
    ComponentProps<typeof DialogHeader>,
    ComponentProps<typeof DrawerHeader>
  >,
) => {
  const isDesktop = useIsDesktop();
  const ResponsiveComponent = isDesktop ? DialogHeader : DrawerHeader;

  return <ResponsiveComponent {...props} />;
};
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";

const ResponsiveDialogFooter = (
  props: CommonProps<
    ComponentProps<typeof DialogFooter>,
    ComponentProps<typeof DrawerFooter>
  >,
) => {
  const isDesktop = useIsDesktop();
  const ResponsiveComponent = isDesktop ? DialogFooter : DrawerFooter;

  return <ResponsiveComponent {...props} />;
};
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";

const ResponsiveDialogTitle = (
  props: CommonProps<
    ComponentProps<typeof DialogTitle>,
    ComponentProps<typeof DrawerTitle>
  >,
) => {
  const isDesktop = useIsDesktop();
  const ResponsiveComponent = isDesktop ? DialogTitle : DrawerTitle;

  return <ResponsiveComponent {...props} />;
};
ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle";

const ResponsiveDialogDescription = (
  props: CommonProps<
    ComponentProps<typeof DialogDescription>,
    ComponentProps<typeof DrawerDescription>
  >,
) => {
  const isDesktop = useIsDesktop();
  const ResponsiveComponent = isDesktop ? DialogDescription : DrawerDescription;

  return <ResponsiveComponent {...props} />;
};
ResponsiveDialogDescription.displayName = "ResponsiveDialogDescription";

export {
  ResponsiveDialog,
  ResponsiveDialogPortal,
  ResponsiveDialogOverlay,
  ResponsiveDialogTrigger,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
};

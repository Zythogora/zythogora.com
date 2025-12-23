"use client";

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

const ResponsiveDialog = ({
  dismissible,
  ...commonProps
}: CommonProps<ComponentProps<typeof Dialog>, ComponentProps<typeof Drawer>> &
  Pick<ComponentProps<typeof Drawer>, "dismissible">) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return isDesktop ? (
    <Dialog {...commonProps} />
  ) : (
    <Drawer dismissible={dismissible} {...commonProps} />
  );
};
ResponsiveDialog.displayName = "ResponsiveDialog";

const ResponsiveDialogPortal = (
  props: CommonProps<
    ComponentProps<typeof DialogPortal>,
    ComponentProps<typeof DrawerPortal>
  >,
) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
  const isDesktop = useMediaQuery("(min-width: 768px)");
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

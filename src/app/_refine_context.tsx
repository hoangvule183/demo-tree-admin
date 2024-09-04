"use client";

import { Refine, type AuthProvider } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  RefineSnackbarProvider,
  ThemedLayoutV2,
  notificationProvider,
} from "@refinedev/mui";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";

import routerProvider from "@refinedev/nextjs-router";

import { ColorModeContextProvider } from "@contexts/color-mode";
import { dataProvider } from "@providers/data-provider";
import LoadingPage from "./loading";
import treeLogo from "/public/images/tree-logo.svg";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import TagIcon from "@mui/icons-material/Tag";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import Image from "next/image";

type RefineContextProps = {
  defaultMode?: string;
};

export const RefineContext = (
  props: React.PropsWithChildren<RefineContextProps>
) => {
  return (
    <SessionProvider>
      <App {...props} />
    </SessionProvider>
  );
};

type AppProps = {
  defaultMode?: string;
};

const App = (props: React.PropsWithChildren<AppProps>) => {
  const { data, status } = useSession();
  const to = usePathname();

  if (status === "loading") {
    return <LoadingPage />;
  }

  const authProvider: AuthProvider = {
    login: async () => {
      signIn("google", {
        callbackUrl: to ? to.toString() : "/",
        redirect: true,
      });

      return {
        success: true,
      };
    },
    logout: async () => {
      signOut({
        redirect: true,
        callbackUrl: "/login",
      });

      return {
        success: true,
      };
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        };
      }

      return {
        error,
      };
    },
    check: async () => {
      if (status === "unauthenticated") {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }

      return {
        authenticated: true,
      };
    },
    getPermissions: async () => {
      return null;
    },
    getIdentity: async () => {
      if (data?.user) {
        const { user } = data;
        return {
          name: user.name,
          avatar: user.image,
        };
      }

      return null;
    },
  };

  const defaultMode = props?.defaultMode;

  return (
    <>
      <RefineKbarProvider>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <RefineSnackbarProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              notificationProvider={notificationProvider}
              authProvider={authProvider}
              resources={[
                {
                  name: "upload files",
                  list: "/upload-files",
                },
                {
                  name: "groups",
                  list: "/groups",
                  create: "/groups/create",
                  show: "/groups/show/:id",
                  edit: "/groups/edit/:id",
                  meta: {
                    canDelete: false,
                    icon: <AccountTreeIcon />,
                  },
                },
                {
                  name: "tags",
                  list: "/tags",
                  create: "/tags/create",
                  show: "/tags/show/:id",
                  edit: "/tags/edit/:id",
                  meta: {
                    canDelete: false,
                    icon: <TagIcon />,
                  },
                },
                {
                  name: "projects",
                  list: "/projects",
                  create: "/projects/create",
                  show: "/projects/show/:id",
                  edit: "/projects/edit/:id",
                  meta: {
                    canDelete: false,
                    icon: <FilterNoneIcon />,
                  },
                },
                {
                  name: "resources",
                  create: "/resources/create",
                  edit: "/resources/edit/:id",
                  meta: {
                    canDelete: false,
                    hide: true,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                title: {
                  icon: (
                    <Image src={treeLogo} width={40} height={40} alt="logo" />
                  ),
                  text: "Tree Studio Admin",
                },
              }}
            >
              {props.children}
              <RefineKbar />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </>
  );
};

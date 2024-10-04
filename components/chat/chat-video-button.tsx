"use client";
import React from "react";
import qs from "query-string";
import ActionTooltip from "../navigation/action-tooltip";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { VideoOff, Video } from "lucide-react";

const ChatVideoButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isVideo = searchParams?.get("video");

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End Video Call" : "Start Video Call";

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;

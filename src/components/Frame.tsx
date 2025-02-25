"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { config } from "~/components/providers/WagmiProvider";
import { PurpleButton } from "~/components/ui/PurpleButton";
import { truncateAddress } from "~/lib/truncateAddress";
import { base } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE, YOINK_CONTRACT_ADDRESS } from "~/lib/constants";
import { useAccount, useContractWrite, useContractRead } from "wagmi";
import { YOINK_ABI } from "~/lib/yoink-abi";

function YoinkCard() {
  const { address } = useAccount();
  const { data: lastYoinkedBy } = useContractRead({
    address: YOINK_CONTRACT_ADDRESS,
    abi: YOINK_ABI,
    functionName: "lastYoinkedBy",
  });

  const { data: score } = useContractRead({
    address: YOINK_CONTRACT_ADDRESS,
    abi: YOINK_ABI,
    functionName: "score",
    args: [lastYoinkedBy || "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: !!lastYoinkedBy, // Only run if we have an address
    }
  });

  const { writeContract, isPending: isYoinking } = useContractWrite();

  const handleYoink = () => {
    if (address === lastYoinkedBy) {
      alert("You already have the flag!");
      return;
    }
    writeContract({
      address: YOINK_CONTRACT_ADDRESS,
      abi: YOINK_ABI,
      functionName: "yoink",
    });
  };

  return (
    <Card className="border-neutral-200 bg-white">
      <CardHeader>
        <CardTitle className="text-neutral-900">🚩 YoinkQuest 🚩</CardTitle>
        <CardDescription className="text-neutral-600">
          Click to yoink the flag!
        </CardDescription>
      </CardHeader>
      <CardContent className="text-neutral-800 flex flex-col gap-6">
        {lastYoinkedBy && (
          <div className="space-y-2">
            <Label className="text-lg">Current Holder:</Label>
            <div className="font-mono text-sm break-all px-2 py-1 bg-neutral-100 rounded">
              {truncateAddress(lastYoinkedBy)}
            </div>
          </div>
        )}
        
        {score && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-lg">Yoinks:</Label>
              <div className="text-2xl font-bold">{score.yoinks.toString()}</div>
            </div>
            <div className="space-y-2">
              <Label className="text-lg">Time Held:</Label>
              <div className="text-2xl font-bold">{score.time.toString()}s</div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleYoink}
          disabled={isYoinking}
          className="w-full py-6 text-xl"
        >
          {isYoinking ? "Yoinking..." : "Yoink the Flag!"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Frame(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  const [added, setAdded] = useState(false);

  const [addFrameResult, setAddFrameResult] = useState("");

  const addFrame = useCallback(async () => {
    try {
      await sdk.actions.addFrame();
    } catch (error) {
      if (error instanceof AddFrame.RejectedByUser) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      if (error instanceof AddFrame.InvalidDomainManifest) {
        setAddFrameResult(`Not added: ${error.message}`);
      }

      setAddFrameResult(`Error: ${error}`);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      if (!context) {
        return;
      }

      setContext(context);
      setAdded(context.client.added);

      // If frame isn't already added, prompt user to add it
      if (!context.client.added) {
        addFrame();
      }

      sdk.on("frameAdded", ({ notificationDetails }) => {
        setAdded(true);
      });

      sdk.on("frameAddRejected", ({ reason }) => {
        console.log("frameAddRejected", reason);
      });

      sdk.on("frameRemoved", () => {
        console.log("frameRemoved");
        setAdded(false);
      });

      sdk.on("notificationsEnabled", ({ notificationDetails }) => {
        console.log("notificationsEnabled", notificationDetails);
      });
      sdk.on("notificationsDisabled", () => {
        console.log("notificationsDisabled");
      });

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded, addFrame]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-full max-w-[400px] mx-auto py-4 px-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-neutral-900">{title}</h1>
        <YoinkCard />
      </div>
    </div>
  );
}

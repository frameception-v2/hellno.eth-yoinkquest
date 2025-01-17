import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

export const alt = "Farcaster Frames V2 Demo";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-gradient-to-b from-blue-600 to-purple-800">
        <div tw="flex flex-col items-center bg-white/90 p-8 rounded-2xl shadow-2xl">
          <h1 tw="text-6xl font-bold text-blue-900 mb-4">{PROJECT_TITLE}</h1>
          <h3 tw="text-2xl text-center text-gray-800 max-w-[500px]">{PROJECT_DESCRIPTION}</h3>
          <div tw="mt-6 text-gray-600 text-lg">Built on Farcaster Frames</div>
          <div tw="absolute bottom-4 right-4 text-sm text-white/50">v2.0</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

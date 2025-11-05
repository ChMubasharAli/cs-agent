import { Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import LoaderComp from "./LoaderComp";
import apiClient from "../api/axios";

export default function Audio({ callId = 14 }) {
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recordingUrl", callId],
    queryFn: () => {
      return apiClient
        .get(`/api/getRecordingUrlById/${callId}`)
        .then((response) => response.data);
    },
    enabled: !!callId,
  });

  return (
    <>
      <main className="py-4">
        {isLoading ? (
          <LoaderComp />
        ) : error ? (
          <Text py={"md"} ta={"center"} c={"red"}>
            Failed to load Recording: {error.message}
          </Text>
        ) : !dashboardData ? (
          <Text py={"md"} ta={"center"}>
            No Recording found.
          </Text>
        ) : (
          <section className="h-full bg-white rounded-2xl ">
            {/* Simple HTML5 Audio Player */}
            <audio
              controls
              controlsList="nodownload"
              className="w-full"
              preload="metadata"
            >
              <source src={dashboardData.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

            {/* Download fallback */}
            <div className="mt-3 text-center">
              <a
                href={dashboardData.url}
                download={`recording-${callId}.mp3`}
                className="text-blue-600 hover:underline text-sm"
              >
                Download Recording
              </a>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

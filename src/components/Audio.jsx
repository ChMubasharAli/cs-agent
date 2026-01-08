import { Text, Button } from "@mantine/core"; // Added Button for better UX
import { useQuery } from "@tanstack/react-query";
import LoaderComp from "./LoaderComp";
import apiClient from "../api/axios";

export default function Audio({ callId = "" }) {
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

  // The function to force download
  const handleDownload = async (url, filename) => {
    try {
      // 1. Fetch the data as a blob
      const response = await fetch(url);
      const blob = await response.blob();

      // 2. Create a local object URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // 3. Create a temporary anchor element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "recording.mp3";

      // 4. Append to body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 5. Clean up the memory
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: Try opening in new tab if fetch fails
      window.open(url, "_blank");
    }
  };

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

            {/* Download Button */}
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() =>
                  handleDownload(dashboardData.url, `recording-${callId}.mp3`)
                }
                className="text-blue-600 hover:underline text-sm bg-transparent border-none cursor-pointer"
              >
                Download Recording
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

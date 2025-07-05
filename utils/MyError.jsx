"use client";
const MyError = async (errorPayload) => {
  const error = {
    name: errorPayload.name || "Error",
    message: errorPayload.message || "An unexpected error occurred",
    stack: errorPayload.stack || "No stack trace available",
  };
  const projectData = window.localStorage.getItem("projectHash");

  // Extract the error object safely
  const serializedError = {
    name: error.name || "Error",
    message: error.message || "No message",
    stack: error.stack || "No stack",
  };

  await fetch("https://error-tracking-api.vercel.app/api/error", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      error: serializedError,
      projectId: projectData,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed to report error");
    }
    return response.json();
  });
};

export default MyError;

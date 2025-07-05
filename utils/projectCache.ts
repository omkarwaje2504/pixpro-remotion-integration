import { getDataSingleton } from "@actions/dataStore";

let cachedProjectData: any[] | null = null;

export async function getAllProjectsCached() {
  if (cachedProjectData) return cachedProjectData;

  try {
    const response = await getDataSingleton();

    const allProjects = response?.data || [];

    // ✅ Filter only the desired project
    const filtered = allProjects.filter(
      (project: any) =>
        project.id?.toString() === "9jnxlznp" ||
        project.name?.toString() === "9jnxlznp" ||
        project.web_link?.split("/").pop() === "9jnxlznp"
    );

    cachedProjectData = filtered;
    return cachedProjectData;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}
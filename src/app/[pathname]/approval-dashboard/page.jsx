import ApprovalPage from "@components/pages/ApprovalPage";
import { getDataSingleton } from "@actions/dataStore";

// 1. ✅ Static Params for SSG
export async function generateStaticParams() {
  try {
    console.log("Generating static paths for approval page...");

    const response = await getDataSingleton();

    return response["data"].map((project) => ({
      pathname:
        project.id?.toString() ||
        project.name?.toString() ||
        project.web_link?.split("/").pop(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// 2. ✅ Metadata for SEO
export async function generateMetadata({ params }) {
  const { pathname } = params;

  try {
    const data = await getDataSingleton();

    const projectInfo = data["data"].find(
      (project) =>
        project.id?.toString() === pathname ||
        project.name?.toString() === pathname ||
        project.web_link?.split("/").pop() === pathname,
    );

    if (!projectInfo) {
      throw new Error("Project not found");
    }

    return {
      title: projectInfo.seo_title || "Default Title",
      description: projectInfo.seo_description || "Default description",
      openGraph: {
        title: projectInfo.seo_title || "Default Title",
        description: projectInfo.seo_description || "Default description",
        images: [projectInfo.logo || "/default-image.jpg"],
      },
      twitter: {
        card: "summary_large_image",
        title: projectInfo.seo_title || "Default Title",
        description: projectInfo.seo_description || "Default description",
        image: projectInfo.logo || "/default-image.jpg",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "Error loading the page",
      openGraph: {
        title: "Error",
        description: "Error loading the page",
        images: ["/error-image.jpg"],
      },
      twitter: {
        card: "summary_large_image",
        title: "Error",
        description: "Error loading the page",
        image: "/error-image.jpg",
      },
    };
  }
}

// 3. ✅ Main Page Renderer
export default async function Home({ params }) {
  const { pathname } = params;

  try {
    const data = await getDataSingleton();

    const projectInfo = data["data"].find(
      (project) =>
        project.id?.toString() === pathname ||
        project.name?.toString() === pathname ||
        project.web_link?.split("/").pop() === pathname,
    );

    if (!projectInfo) {
      return <div className="text-red-500">404 – Project Not Found</div>;
    }

    return <ApprovalPage projectData={projectInfo} />;
  } catch (error) {
    console.error("Error loading approval page:", error);
    return <div className="text-red-500">Error loading the page.</div>;
  }
}

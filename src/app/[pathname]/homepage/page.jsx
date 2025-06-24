import HomePage from "@components/pages/HomePage";
import { getDataSingleton } from "@actions/dataStore";
import MyError from "@utils/MyError";

export async function generateStaticParams() {
  try {
    const response = await getDataSingleton();
    const projects = await response["data"].map((project) => ({
      pathname:
        project.id || project.name || project.web_link?.split("/").pop(),
    }));
    return projects;
  } catch (error) {
    MyError(error);
    console.error(error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { pathname } = await params;

  try {

    const data = await getDataSingleton();

    const projectInfo = data["data"].find(project =>
      project.id === pathname ||
      project.name === pathname ||
      project.web_link?.split('/').pop() === pathname
    );

    return {
      title: projectInfo?.seo_title || "Default Title",
      description: projectInfo?.seo_description || "Default description",
      openGraph: {
        title: projectInfo?.seo_title || "Default Title",
        description: projectInfo?.seo_description || "Default description",
        images: [projectInfo?.logo || "/default-image.jpg"],
      },
      twitter: {
        card: "summary_large_image",
        title: projectInfo?.seo_title || "Default Title",
        description: projectInfo?.seo_description || "Default description",
        image: projectInfo?.logo || "/default-image.jpg",
      },
    };
  } catch (error) {
    console.error(error);
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

export default async function Home({ params }) {
  const { pathname } = await params;

  try {
    const data = await getDataSingleton();
    const projectInfo = data["data"].find(
      (project) =>
        project.id === pathname ||
        project.name === pathname ||
        project.web_link?.split("/").pop() === pathname,
    );


    return <HomePage projectData={projectInfo} />;
  } catch (error) {
    console.error(error);
    return <div>Error loading the page.</div>;
  }
}


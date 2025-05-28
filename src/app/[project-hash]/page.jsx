import { FetchProjects } from "@actions/project";
import LoginPage from "@components/pages/LoingPage";

export async function generateStaticParams() {
  const pathnames = ["1", "2", "3", "4", "5"];
  return pathnames.map((path) => ({ pathname: path }));
}

export async function generateMetadata({ params }) {
  const { pathname } = params;

  const projectInfo = await FetchProjects(`${pathname}`);

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
}

export default async function Home({ params }) {
  const pathname = 1;
  try {
    const projectInfo = await FetchProjects(`${pathname}`);
    return <LoginPage projectData={projectInfo} />;
  } catch (error) {
    throw new Error("Failed to load project information", error);
  }
}

import { GroupWithTags } from "@app/projects/create/page";
import baseAxios from "./axiosClient";
import { ProjectItem } from "@customTypes/apiResponse";

const ProjectsService = {
  async create(data: {
    name: string;
    description: string;
    start_date: string;
    groups_tags: GroupWithTags[];
    folder_id: string;
  }): Promise<
    | { status: "success"; project: ProjectItem }
    | { status: "error"; errorMsg: string }
  > {
    try {
      const response = (await baseAxios.post("/projects", data)) as ProjectItem;
      return {
        status: "success",
        project: response,
      };
    } catch (err: any) {
      return { status: "error", errorMsg: err.response.data.error };
    }
  },
  async update(
    id: number,
    data: {
      name: string;
      description: string | null;
      is_show: boolean;
    }
  ): Promise<
    | { status: "success"; project: ProjectItem }
    | { status: "error"; errorMsg: string }
  > {
    try {
      const response = (await baseAxios.patch(
        `/projects/${id}`,
        data
      )) as ProjectItem;
      return {
        status: "success",
        project: response,
      };
    } catch (err: any) {
      return { status: "error", errorMsg: err.response.data.error };
    }
  },
  async serachProjects(
    query: string
  ): Promise<
    | { status: "success"; projects: ProjectItem[] }
    | { status: "error"; errorMsg: string }
  > {
    try {
      const response = (await baseAxios.post(
        `/projects/search?${query}`
      )) as ProjectItem[];

      return {
        status: "success",
        projects: response,
      };
    } catch (err: any) {
      return { status: "error", errorMsg: err.response.data.error };
    }
  },
};

export default ProjectsService;

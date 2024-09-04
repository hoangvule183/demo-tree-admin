import { Resource } from "@customTypes/apiResponse";
import baseAxios from "./axiosClient";

const ResourcesService = {
  async getResourceById(
    id: number
  ): Promise<
    | { status: "success"; resource: Resource }
    | { status: "error"; errorMsg: string }
  > {
    try {
      const response = (await baseAxios.get(`/resources/${id}`)) as Resource;
      return {
        status: "success",
        resource: response,
      };
    } catch (err: any) {
      return { status: "error", errorMsg: err.response.data.error };
    }
  },
  async deteleResource(
    id: number
  ): Promise<
    | { status: "success"; message: string }
    | { status: "error"; errorMsg: string }
  > {
    try {
      const response = (await baseAxios.delete(`/resources/${id}`)) as {
        message: string;
      };
      return {
        status: "success",
        message: response.message,
      };
    } catch (err: any) {
      return { status: "error", errorMsg: err.response.data.error };
    }
  },
};

export default ResourcesService;

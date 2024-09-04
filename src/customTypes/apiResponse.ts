enum ResourceType {
  folder,
  image,
  video,
}

type BaseItem = {
  id: number;
  createdAt: string;
  updatedAt: string | null;
};

export type ProjectItem = {
  description: string | null;
  folder_id: number;
  project_name: string;
  start_date: string | null;
  resource: Resource | null;
  is_show: boolean;
} & BaseItem;

export type ProjectDetails = {
  ProjectGroupTag: ProjectGroupTag[];
} & ProjectItem;

type ProjectGroupTag = {
  groupd_id: number;
  project_id: number;
  tag_id: number;
  group: Group;
  tag: Tag;
} & BaseItem;

export type Resource = {
  is_thumbnail: boolean;
  child_resources: Resource[] | null;
  description: string | null;
  parent_resource: Resource;
  parent_resource_id: number | null;
  resource_id: string;
  type: ResourceType;
} & BaseItem;

export type Group = {
  name: string;
} & BaseItem;

export type Tag = {
  name: string;
} & BaseItem;

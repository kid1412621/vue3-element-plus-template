import { BaseResponse, Info, Page } from "@/types";
import request from "@/utils/request";

export const getList = async (param: any) => {
  const { data } = await request.get<BaseResponse<Page<Info>>>(
    "/api/youfang/info/list",
    { params: param }
  );
  return data.result;
};

export const addInfo = (param: Info) =>
  request.post("/api/youfang/info/add", param);

export const editInfo = (param: Info) =>
  request.put("/api/youfang/info/edit", param);

export const deleteInfo = (ids: number[]) =>
  request.delete("/api/youfang/info/delete", { params: { ids: ids.join() } });

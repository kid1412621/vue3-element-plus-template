import { BaseResponse } from "@/types";
import request from "@/utils/request";

export const getAllByCode: any = async (param: any) => {
  const { data } = await request.get<BaseResponse<any>>(
    "/api/youfang/category/loadTree",
    { params: param }
  );
  return data.result;
};

export const add: any = (param: any) =>
  request.post("/api/youfang/category/add", param);

export const edit: any = (param: any) =>
  request.put("/api/youfang/category/edit", param);

export const batchEdit: any = (param: any) =>
  request.put("/api/youfang/category/editBatch", param);

export const batchDelete: any = (ids: number[]) =>
  request.delete("/api/youfang/category/deleteBatch", {
    params: { ids: ids.join() },
  });

import { BaseResponse, INews, Page } from "@/types";
import request from "@/utils/request";

export const getList = async (param: INews): Promise<Page<INews>> => {
  const { data } = await request.get<BaseResponse<Page<INews>>>(
    "/api/youfang/news/list",
    {
      params: param,
    }
  );
  return data.result;
};

export const add = (param: INews) =>
  request.post("/api/youfang/news/add", param);

export const edit = (param: INews) =>
  request.put("/api/youfang/news/edit", param);

export const deleteBatch: any = (ids: number[]) =>
  request.delete("/api/youfang/news/deleteBatch", {
    params: { ids: ids.join() },
  });

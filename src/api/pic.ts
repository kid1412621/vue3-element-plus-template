import { BaseResponse, IPic } from "@/types";
import request from "@/utils/request";

export async function getAllList(params: IPic): Promise<IPic[]> {
  const { data } = await request.get<BaseResponse<IPic[]>>(
    "/api/youfang/pic/list",
    {
      params: params,
    }
  );
  return data.result;
}

export const add: any = (param: IPic) =>
  request.post("/api/youfang/pic/add", param);

export const edit: any = (param: IPic) =>
  request.put("/api/youfang/pic/edit", param);

export const deleteBatch: any = (ids: number[]) =>
  request.delete("/api/youfang/pic/deleteBatch", {
    params: { ids: ids.join() },
  });

import { BaseResponse, ICollection, Page } from "@/types";
import request from "@/utils/request";

export const getList = async (
  param: ICollection
): Promise<Page<ICollection>> => {
  const { data } = await request.get<BaseResponse<Page<ICollection>>>(
    "/api/youfang/collection/list",
    { params: param }
  );
  return data.result;
};

export const addOne: any = (param: any) =>
  request.post("/api/youfang/collection/add", param);

export const editOne: any = (param: any) =>
  request.put("/api/youfang/collection/edit", param);

export const deleteBatch: any = (ids: number[]) =>
  request.delete("/api/youfang/collection/delete", {
    params: { ids: ids.join() },
  });

export const getItemList: any = async (param: any) => {
  const { data } = await request.get<BaseResponse<Page<any>>>(
    "/api/youfang/collection/listitem",
    { params: param }
  );
  return data.result;
};

export const addItems: any = (collectionId: [], infoIds: number[]) => {
  const data = new FormData();
  data.append("infoIds", infoIds.join());
  return request.post(`/api/youfang/collection/additems/${collectionId}`, data);
};

export const removeItems: any = (param: any) =>
  request.delete("/api/youfang/collection/deleteitems", { params: param });

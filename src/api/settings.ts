import { BaseResponse, IFeedback, Page, PageQuery } from "@/types";
import request from "@/utils/request";

export const getFeedbackList = async (
  param: Partial<IFeedback> & PageQuery
): Promise<Page<IFeedback>> => {
  const { data } = await request.get<BaseResponse<Page<IFeedback>>>(
    "/api/youfang/feedback/list",
    {
      params: param,
    }
  );
  return data.result;
};

export const deleteFeedback = (ids: number[]) =>
  request.delete<void>("/api/youfang/feedback/deleteBatch", {
    params: { ids: ids.join() },
  });

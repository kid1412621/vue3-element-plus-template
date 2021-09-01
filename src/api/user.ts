import { BaseResponse } from "@/types";
import request from "@/utils/request";

type LoginParam = {
  captcha: string;
  checkKey: number;
  password: string;
  username: string;
};

type LoginInfo = {
  token: string;
  userInfo: Record<string, unknown>;
};

export const login = async (param: LoginParam): Promise<LoginInfo> => {
  const { data } = await request.post<BaseResponse<LoginInfo>>(
    "/sys/login",
    param
  );
  return data.result;
};

export const logout = (): Promise<unknown> =>
  request.post<BaseResponse<null>>("/sys/logout");

export const getCaptcha = async (timestamp: Date): Promise<string> => {
  const { data } = await request.get<BaseResponse<string>>(
    `/sys/randomImage/${timestamp}`
  );
  return data.result;
};

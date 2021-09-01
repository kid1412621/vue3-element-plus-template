import axios, { AxiosInstance, AxiosResponse } from "axios";
import store from "@/store";
import router from "@/router";
import { BaseResponse } from "@/types";
import { ElNotification } from "element-plus";

const service: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
  headers: {
    "x-access-token": store.state.token,
    "Access-Control-Allow-Methods": "OPTIONS, GET, PUT, POST, DELETE",
    "Access-Control-Allow-Headers": "x-access-token, Content-Type",
  },
  // transformRequest: [data => Qs.stringify(data, { arrayFormat: 'comma' })]
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    Object.assign(config.headers, { "x-access-token": store.state.token });
    return config;
  },
  (error) => {
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone interceptor
service.interceptors.response.use(
  (response: AxiosResponse<BaseResponse<any>>) => {
    if (response.data.code === 403) {
      router.replace({ name: "Login" });
      return Promise.reject(response?.data.message || "登录失效");
    }

    // 后端响应过度封装了
    const { data } = response;
    if (!data || (data.code !== 200 && data.code !== 0)) {
      return Promise.reject(data.message || "请求失败");
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      ElNotification({ title: "登录失效，请重新登录", type: "warning" });
      router.replace({ name: "Login" });
    }
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);

export default service;

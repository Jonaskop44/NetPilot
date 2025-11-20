import { API_URL } from "@/lib/constants";
import Axios, { AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = Axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error - cancel property is added to promise
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

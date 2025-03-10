import { Http } from "./api/http";
import { HttpApi } from "./api/http-api";
import { Flagster } from "./flagster";
import { NullLocalStorage } from "./localstorage/null-localstorage";
import { LocalStorage } from "./localstorage/real-localstorage";
export type { IApi } from "./api/api";
export type { Config, FlagsterState } from "./flagster";
export { Flagster } from "./flagster";

const http = new Http();
const api = new HttpApi(http, "https://api.flagster.fr");

export const createFlagster = () => new Flagster(api, new LocalStorage());
export const createFlagsterSSR = () =>
	new Flagster(api, new NullLocalStorage());

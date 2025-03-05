import { Http } from "./api/http";
import { HttpApi } from "./api/http-api";
import { Flagster } from "./flagster";
import { LocalStorage } from "./localstorage/real-localstorage";
export type { IApi } from "./api/api";
export type { Config } from "./flagster";
export { Flagster } from "./flagster";

const http = new Http();
const api = new HttpApi(http, "http://localhost:3000");
const localStorage = new LocalStorage();

export const flagster = () => new Flagster(api, localStorage);

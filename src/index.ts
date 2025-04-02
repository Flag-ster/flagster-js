import { Http } from "./api/http";
import { HttpApi } from "./api/http-api";
import { Flagster } from "./flagster";
import { RandomIdentityGenerator } from "./identity-generator/random-identity-generator";
import { NullLocalStorage } from "./localstorage/null-localstorage";
import { FlagsLocalStorage } from "./flags-storage/flags-localstorage";
import { IdentityLocalStorage } from "./identity-storage/identity-localstorage";
import { NullIdentityStorage } from "./identity-storage/null-identity-storage";
export type { IApi } from "./api/api";
export type { Config, FlagsterState } from "./flagster";
export { Flagster } from "./flagster";

const http = new Http();
const api = new HttpApi(http, "https://api.flagster.fr");
const identityGenerator = new RandomIdentityGenerator();

export const createFlagster = () =>
	new Flagster(
		api,
		new FlagsLocalStorage(),
		identityGenerator,
		new IdentityLocalStorage(),
	);

export const createFlagsterSSR = () =>
	new Flagster(
		api,
		new NullLocalStorage(),
		identityGenerator,
		new NullIdentityStorage(),
	);

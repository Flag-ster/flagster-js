import { IHttp } from "./http-api";

export class Http implements IHttp {
	send(
		method: string,
		params: { url: string; body?: string },
	): Promise<Response> {
		return fetch(params.url, {
			method,
			body: params.body,
		});
	}
}

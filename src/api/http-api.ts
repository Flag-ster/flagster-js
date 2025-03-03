import { IApi } from "./api";

export type IHttp = {
	send(
		method: string,
		params: { url: string; body?: string },
	): Promise<Response>;
};

export class HttpApi implements IApi {
	constructor(
		private readonly http: IHttp,
		private readonly baseUrl: string,
	) {}

	async getFlags(environment: string): Promise<Record<string, boolean>> {
		const response = await this.http.send("GET", {
			url: `${this.baseUrl}/eval/${environment}/flags`,
		});
		const flags = await response.json();
		return flags;
	}
}

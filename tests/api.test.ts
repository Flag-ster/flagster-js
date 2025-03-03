import { HttpApi } from "../src/api/http-api";

describe("HttpApi", () => {
	test("getting flags for environment", async () => {
		const baseUrl = "http://localhost:3000";
		const api = new HttpApi(
			{
				async send(method, params) {
					expect(method).toBe("GET");
					expect(params.url).toBe(`${baseUrl}/eval/test/flags`);
					return new Response(JSON.stringify({ flag1: true, flag2: false }));
				},
			},
			baseUrl,
		);

		const flags = await api.getFlags("test");

		expect(flags).toEqual({
			flag1: true,
			flag2: false,
		});
	});
});

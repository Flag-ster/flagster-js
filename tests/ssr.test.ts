import { NotInitializedError } from "../src/flagster";
import { FlagsterTester } from "./flagster.tester";

describe("SSR", () => {
	describe("Get state", () => {
		test("can not get state from non-initialized instance", () => {
			const tester = new FlagsterTester();
			expect(() => tester.getState()).toThrowError(new NotInitializedError());
		});

		test("current flags are returned", async () => {
			const tester = new FlagsterTester()
				.withApi({
					getFlags: async () => {
						return {
							flag1: false,
							flag2: true,
						};
					},
				})
				.initFlagster({
					environment: "environemnt-id",
				});

			await tester.waitForInit();

			expect(tester.getState()).toEqual(
				expect.objectContaining({
					flags: {
						flag1: false,
						flag2: true,
					},
				}),
			);
		});
	});

	test("config is returned when initialized", async () => {
		const tester = new FlagsterTester().initFlagster({
			environment: "environemnt-id",
		});

		await tester.waitForInit();

		expect(tester.getState()).toEqual(
			expect.objectContaining({
				config: { environment: "environemnt-id" },
			}),
		);
	});

	describe("Set state", () => {
		test("instance is loaded with state", async () => {
			const tester = new FlagsterTester();

			tester.setState({
				flags: {
					flag1: true,
					flag2: false,
				},
				config: {
					environment: "environemnt-id",
				},
			});

			expect(tester.getState()).toEqual({
				flags: {
					flag1: true,
					flag2: false,
				},
				config: {
					environment: "environemnt-id",
				},
			});
		});
	});
});

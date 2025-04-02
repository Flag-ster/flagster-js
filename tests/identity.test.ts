import { FlagsterTester, InMemoryIdentityStorage } from "./flagster.tester";

describe("Identity", () => {
	test("identity is passed for evaluation", async () => {
		const tester = new FlagsterTester().withApi({
			async getFlags(_, identity) {
				expect(identity).toBe("user-id");
				return {};
			},
		});

		tester.initFlagster({
			environment: "environemnt-id",
			identity: "user-id",
		});

		await tester.waitForInit();
	});

	test("identity is generated when not passed", async () => {
		const tester = new FlagsterTester().withApi({
			async getFlags(_, identity) {
				expect(identity).toBe("id-generated");
				return {};
			},
		});

		tester.initFlagster({
			environment: "environemnt-id",
		});

		await tester.waitForInit();
	});

	test("identity is return in state", async () => {
		const tester = new FlagsterTester();
		tester.initFlagster({
			environment: "environemnt-id",
			identity: "user-id",
		});

		await tester.waitForInit();

		expect(tester.getFlagster().getState()).toEqual(
			expect.objectContaining({
				config: expect.objectContaining({
					identity: "user-id",
				}),
			}),
		);
	});

	test("saved identity is use when identity is not passed and was already generated", async () => {
		const tester = new FlagsterTester()
			.withIdentityStorage(new InMemoryIdentityStorage("id-saved"))
			.withApi({
				async getFlags(_, identity) {
					expect(identity).toBe("id-saved");
					return {};
				},
			});

		tester.initFlagster({
			environment: "environemnt-id",
		});

		await tester.waitForInit();
	});

	test("generated identity is saved", async () => {
		const identityStorage = new InMemoryIdentityStorage();
		const tester = new FlagsterTester()
			.withIdentityStorage(identityStorage)
			.withApi({
				async getFlags(_, identity) {
					expect(identity).toBe("id-generated");
					return {};
				},
			});

		tester.initFlagster({
			environment: "environemnt-id",
		});

		await tester.waitForInit();

		expect(identityStorage.identity).toBe("id-generated");
	});
});

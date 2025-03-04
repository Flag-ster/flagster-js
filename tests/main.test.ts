import { FlagsterTester, MockLocalStorage } from "./flagster.tester";

describe("Flagster", () => {
	let tester: FlagsterTester;
	const defaultFlags = {
		flag1: false,
		flag2: false,
	};

	beforeEach(() => {
		tester = new FlagsterTester();
	});

	test.each(["environemnt-id", "another-environment-id"])(
		"getting flags for %s",
		async (environmentId) => {
			tester.initFlagster({
				environment: environmentId,
			});

			await tester.waitForInit();

			expect(tester.getflags()).toEqual({
				flag1: false,
				flag2: true,
			});
		},
	);

	test("default flags is use before initialization", () => {
		tester.initFlagster({
			environment: "environemnt-id",
			defaultFlags,
		});

		expect(tester.getflags()).toEqual({
			flag1: false,
			flag2: false,
		});
	});

	test("on change callback is called when flags are set to default", async () => {
		let changeCalled = false;
		tester.initFlagster({
			environment: "environemnt-id",
			defaultFlags,
			onChange(oldFlags, newFlags) {
				if (changeCalled) return;
				expect(oldFlags).toEqual({});
				expect(newFlags).toEqual({
					flag1: false,
					flag2: false,
				});
				changeCalled = true;
			},
		});

		expect(changeCalled).toBe(true);
	});

	test("on change callback is called when flags are set to api values", async () => {
		let changeCalledTime = 0;
		tester.initFlagster({
			environment: "environemnt-id",
			defaultFlags,
			onChange(oldFlags, newFlags) {
				changeCalledTime++;
				if (changeCalledTime === 1) return;
				expect(oldFlags).toEqual(defaultFlags);
				expect(newFlags).toEqual({
					flag1: false,
					flag2: true,
				});
			},
		});

		await tester.waitForInit();

		expect(changeCalledTime).toBe(2);
	});

	test("save api flags into local storage", async () => {
		tester.initFlagster({
			environment: "environemnt-id",
		});

		await tester.waitForInit();

		expect(tester.getFlagsFromLocalStorage()).toEqual({
			flag1: false,
			flag2: true,
		});
	});

	test("getting flags from local storage instead of default flags when exist", async () => {
		tester
			.withLocalStorage(
				new MockLocalStorage({
					flag1: true,
					flag2: false,
				}),
			)
			.initFlagster({
				environment: "environemnt-id",
				defaultFlags,
			});

		expect(tester.getflags()).toEqual({
			flag1: true,
			flag2: false,
		});
	});

	test("on change callback is called when flags are set to local storage values", async () => {
		let onChangeCalled = false;
		tester
			.withLocalStorage(
				new MockLocalStorage({
					flag1: true,
					flag2: false,
				}),
			)
			.initFlagster({
				environment: "environemnt-id",
				defaultFlags,
				onChange(oldFlags, newFlags) {
					if (onChangeCalled) return;
					expect(oldFlags).toEqual({});
					expect(newFlags).toEqual({
						flag1: true,
						flag2: false,
					});
					onChangeCalled = true;
				},
			});

		expect(onChangeCalled).toBe(true);
	});

	test("populate local storage with flags from default when not exist in local", async () => {
		tester
			.withLocalStorage(
				new MockLocalStorage({
					flag1: true,
				}),
			)
			.initFlagster({
				environment: "environemnt-id",
				defaultFlags: {
					flag1: false,
					flag3: true,
				},
			});

		expect(tester.getflags()).toEqual({
			flag1: true,
			flag3: true,
		});
	});

	test("can add on change listener after initialization", async () => {
		let onChangeCalled = false;
		tester.initFlagster({
			environment: "environemnt-id",
			defaultFlags,
		});

		tester.addOnChange(() => {
			onChangeCalled = true;
		});

		await tester.waitForInit();

		expect(onChangeCalled).toBe(true);
	});
});

import { Config, Flagster, ILocalStorage } from "../src/flagster";

export class MockLocalStorage implements ILocalStorage {
	private savedFlags: Record<string, boolean> = {};

	constructor(flags: Record<string, boolean> = {}) {
		this.savedFlags = flags;
	}

	save(flags: Record<string, boolean>) {
		this.savedFlags = flags;
	}

	get() {
		return this.savedFlags;
	}
}

export class FlagsterTester {
	private flagster: Flagster | null = null;
	private localStorage = new MockLocalStorage();

	withLocalStorage(localStorage: MockLocalStorage) {
		this.localStorage = localStorage;
		return this;
	}

	initFlagster(config: Config) {
		this.flagster = new Flagster(
			{
				getFlags: async (environment) => {
					expect(environment).toBe(config.environment);
					return {
						flag1: false,
						flag2: true,
					};
				},
			},
			this.localStorage,
		);

		this.flagster.init(config);
		return this;
	}

	async waitForInit() {
		await new Promise((resolve) => setTimeout(resolve, 0));
	}

	getflags() {
		return this.flagster?.getflags() || {};
	}

	getFlagsFromLocalStorage() {
		return this.localStorage.get();
	}
}

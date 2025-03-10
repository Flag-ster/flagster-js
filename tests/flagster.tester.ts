import { IApi } from "../src/api/api";
import {
	Config,
	Flagster,
	FlagsterState,
	OnChangeListener,
} from "../src/flagster";
import { ILocalStorage } from "../src/localstorage/localstorage";

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

class DummyApi implements IApi {
	getFlags = async () => {
		return {
			flag1: false,
			flag2: true,
		};
	};
}

export class FlagsterTester {
	private flagster: Flagster | null = null;
	private localStorage = new MockLocalStorage();
	private api: IApi = new DummyApi();

	withLocalStorage(localStorage: MockLocalStorage) {
		this.localStorage = localStorage;
		return this;
	}

	withApi(api: IApi) {
		this.api = api;
		return this;
	}

	initFlagster(config: Config) {
		this.getFlagster().init(config);
		return this;
	}

	async waitForInit() {
		await new Promise((resolve) => setTimeout(resolve, 0));
	}

	setState(state: FlagsterState) {
		this.getFlagster().setState(state);
	}

	getState() {
		return this.getFlagster().getState();
	}

	getflags() {
		return this.flagster?.getFlags() || {};
	}

	getFlagster() {
		if (!this.flagster) {
			this.flagster = new Flagster(this.api, this.localStorage);
		}

		return this.flagster;
	}

	addOnChange(callback: OnChangeListener) {
		return this.flagster!.onChange(callback);
	}

	getFlagsFromLocalStorage() {
		return this.localStorage.get();
	}
}

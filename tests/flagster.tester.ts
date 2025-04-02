import { IApi } from "../src/api/api";
import { FlagsStorage } from "../src/flags-storage/flags-storage";
import {
	Config,
	Flagster,
	FlagsterState,
	OnChangeListener,
} from "../src/flagster";
import { IdentityGenerator } from "../src/identity-generator/identity-generator";
import { IdentityStorage } from "../src/identity-storage/identity-storage";

export class MockLocalStorage implements FlagsStorage {
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

class DummyIdentityGenerator implements IdentityGenerator {
	generate() {
		return "id-generated";
	}
}

class EmptyIdentityStorage implements IdentityStorage {
	get(): string | undefined {
		return;
	}

	save(_: string) {}
}

export class InMemoryIdentityStorage implements IdentityStorage {
	constructor(public identity?: string) {}

	get(): string | undefined {
		return this.identity;
	}

	save(identity: string) {
		this.identity = identity;
	}
}

export class FlagsterTester {
	private flagster: Flagster | null = null;
	private localStorage = new MockLocalStorage();
	private api: IApi = new DummyApi();
	private identityGenerator: IdentityGenerator = new DummyIdentityGenerator();
	private identityStorage: IdentityStorage = new EmptyIdentityStorage();

	withIdentityStorage(identityStorage: IdentityStorage) {
		this.identityStorage = identityStorage;
		return this;
	}

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
			this.flagster = new Flagster(
				this.api,
				this.localStorage,
				this.identityGenerator,
				this.identityStorage,
			);
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

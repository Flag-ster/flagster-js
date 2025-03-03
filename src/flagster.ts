export type IApi = {
	getFlags: (environment: string) => Promise<Record<string, boolean>>;
};

export type ILocalStorage = {
	save(flags: Record<string, boolean>): void;
	get(): Record<string, boolean>;
};

export type Config = {
	environment: string;
	defaultFlags?: Record<string, boolean>;
	onChange?: (
		oldFlags: Record<string, boolean>,
		newFlags: Record<string, boolean>,
	) => void;
};

export class Flagster {
	private flags: Record<string, boolean> = {};
	private config: Config | null = null;

	constructor(
		private readonly api: IApi,
		private readonly localStorage: ILocalStorage,
	) {}

	init(config: Config) {
		this.config = config;

		const loadedFromStorage = this.loadFromStorage();

		if (!loadedFromStorage) {
			this.changeFlags(config.defaultFlags || {});
		}

		this.api.getFlags(config.environment).then((flags) => {
			this.changeFlags(flags);
			this.localStorage.save(this.flags);
		});
	}

	private changeFlags(newFlags: Record<string, boolean>) {
		const oldFlags = this.flags;
		this.flags = newFlags;
		this.config!.onChange?.(oldFlags, newFlags);
	}

	private loadFromStorage() {
		const savedFlags = this.localStorage.get();
		const isLocalStorageEmpty = Object.keys(savedFlags).length === 0;

		if (isLocalStorageEmpty) return false;

		const defaultFlags = this.config!.defaultFlags || {};

		this.changeFlags({ ...defaultFlags, ...savedFlags });

		return true;
	}

	getflags() {
		return this.flags;
	}
}

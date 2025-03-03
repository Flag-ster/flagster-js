import { IApi } from "./api/api";
import { ILocalStorage } from "./localstorage/localstorage";

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
		this.loadFromStorage();
		this.loadFromApi();
	}

	private changeFlags(newFlags: Record<string, boolean>) {
		const oldFlags = this.flags;
		this.flags = newFlags;
		this.config!.onChange?.(oldFlags, newFlags);
	}

	private loadFromStorage() {
		const savedFlags = this.localStorage.get();
		const defaultFlags = this.config!.defaultFlags || {};
		this.changeFlags({ ...defaultFlags, ...savedFlags });
	}

	private loadFromApi() {
		this.api.getFlags(this.config!.environment).then((flags) => {
			this.changeFlags(flags);
			this.localStorage.save(this.flags);
		});
	}

	getflags() {
		return this.flags;
	}
}

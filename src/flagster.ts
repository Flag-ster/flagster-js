import { IApi } from "./api/api";
import { ILocalStorage } from "./localstorage/localstorage";

export type OnChangeListener = (
	oldFlags: Record<string, boolean>,
	newFlags: Record<string, boolean>,
) => void;

export type Config = {
	environment: string;
	defaultFlags?: Record<string, boolean>;
	onChange?: OnChangeListener;
};

class Flags {
	private values: Map<string, boolean>;

	constructor(flags: Record<string, boolean>) {
		this.values = new Map(Object.entries(flags));
	}

	getAll() {
		return Object.fromEntries(this.values);
	}

	isEquals(other: Flags) {
		const hasDivergenteKeysCount = this.values.size !== other.values.size;
		if (hasDivergenteKeysCount) return false;

		for (const key of this.values.keys()) {
			if (this.values.get(key) !== other.values.get(key)) {
				return false;
			}
		}
		return true;
	}
}

export class Flagster {
	private flags: Flags = new Flags({});
	private config: Config | null = null;
	private onChangeListeners: OnChangeListener[] = [];

	constructor(
		private readonly api: IApi,
		private readonly localStorage: ILocalStorage,
	) {}

	init(config: Config) {
		this.config = config;
		this.flags = new Flags(config.defaultFlags || {});
		this.loadFromStorage();
		this.loadFromApi();
	}

	private changeFlags(newFlags: Flags) {
		const oldFlags = this.flags;
		this.flags = new Flags(newFlags.getAll());
		if (oldFlags.isEquals(newFlags)) return;
		this.config!.onChange?.(oldFlags.getAll(), newFlags.getAll());
		this.onChangeListeners.forEach((listener) =>
			listener(oldFlags.getAll(), newFlags.getAll()),
		);
	}

	private loadFromStorage() {
		const savedFlags = this.localStorage.get();
		this.changeFlags(this.populateWithDefaultFlags(savedFlags));
	}

	private loadFromApi() {
		this.api.getFlags(this.config!.environment).then((flags) => {
			this.changeFlags(this.populateWithDefaultFlags(flags));
			this.localStorage.save(this.flags.getAll());
		});
	}

	private populateWithDefaultFlags(flags: Record<string, boolean>) {
		const defaultFlags = this.config!.defaultFlags || {};
		return new Flags({ ...defaultFlags, ...flags });
	}

	getflags() {
		return this.flags.getAll();
	}

	onChange(callback: OnChangeListener) {
		this.onChangeListeners.push(callback);
		return () => {
			this.onChangeListeners = this.onChangeListeners.filter(
				(listener) => listener !== callback,
			);
		};
	}
}

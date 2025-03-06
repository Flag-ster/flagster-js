import { IApi } from "./api/api";
import { Flags } from "./flags";
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

export class AlreadyInitializedError extends Error {
	constructor() {
		super("Flagster is already initialized");
	}
}

export class Flagster {
	private flags: Flags = new Flags();
	private config: Config | null = null;
	private onChangeListeners: OnChangeListener[] = [];
	private isInitialized = false;

	constructor(
		private readonly api: IApi,
		private readonly localStorage: ILocalStorage,
	) {}

	init(config: Config) {
		if (this.isInitialized) {
			throw new AlreadyInitializedError();
		}
		this.isInitialized = true;
		this.config = config;
		this.flags = new Flags(config.defaultFlags);
		config.onChange && this.onChange(config.onChange);
		this.loadFromStorage();
		this.loadFromApi();
	}

	getFlags() {
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

	isInit() {
		return this.isInitialized;
	}

	private changeFlags(newFlags: Flags) {
		const oldFlags = this.flags;
		this.flags = newFlags;
		if (oldFlags.isEquals(newFlags)) return;
		this.onChangeListeners.forEach((listener) =>
			listener(oldFlags.getAll(), newFlags.getAll()),
		);
	}

	private loadFromStorage() {
		const savedFlags = this.localStorage.get();
		this.changeFlags(this.populateWithDefaultFlags(savedFlags));
	}

	private async loadFromApi() {
		const flags = await this.api.getFlags(this.config!.environment);
		this.changeFlags(this.populateWithDefaultFlags(flags));
		this.localStorage.save(this.flags.getAll());
	}

	private populateWithDefaultFlags(flags: Record<string, boolean>) {
		const defaultFlags = this.config!.defaultFlags || {};
		return new Flags({ ...defaultFlags, ...flags });
	}
}

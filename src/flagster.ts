import { IApi } from "./api/api";
import { Flags } from "./flags";
import { IdentityGenerator } from "./identity-generator/identity-generator";
import { FlagsStorage } from "./flags-storage/flags-storage";
import { IdentityStorage } from "./identity-storage/identity-storage";

export type OnChangeListener = (
	oldFlags: Record<string, boolean>,
	newFlags: Record<string, boolean>,
) => void;

export type Config = {
	environment: string;
	identity?: string;
	defaultFlags?: Record<string, boolean>;
	onChange?: OnChangeListener;
};

type Context = {
	environment: string;
	identity: string;
};

export class AlreadyInitializedError extends Error {
	constructor() {
		super("Flagster is already initialized");
	}
}

export class NotInitializedError extends Error {
	constructor() {
		super("Flagster is not initialized");
	}
}

export type FlagsterState = ReturnType<Flagster["getState"]>;

type InitState = "NOT_INITIALIZED" | "INITIALIZING" | "INITIALIZED";

export class Flagster {
	private flags: Flags = new Flags();
	private context: Context | null = null;
	private config: Config | null = null;
	private onChangeListeners: OnChangeListener[] = [];
	private initState: InitState = "NOT_INITIALIZED";

	constructor(
		private readonly api: IApi,
		private readonly flagsStorage: FlagsStorage,
		private readonly identityGenerator: IdentityGenerator,
		private readonly identityStorage: IdentityStorage,
	) {}

	async init(config: Config) {
		if (!this.canInit()) {
			throw new AlreadyInitializedError();
		}
		this.initState = "INITIALIZING";
		this.config = config;
		this.context = {
			environment: config.environment,
			identity:
				config.identity ||
				this.identityStorage.get() ||
				this.generateIdentity(),
		};
		this.flags = new Flags(config.defaultFlags);
		if (config.onChange) this.onChange(config.onChange);
		this.loadFromStorage();
		await this.loadFromApi();
		this.initState = "INITIALIZED";
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

	canInit() {
		return this.initState === "NOT_INITIALIZED";
	}

	setState(state: FlagsterState) {
		this.initState = "INITIALIZED";
		this.flags = new Flags(state.flags);
		this.config = {
			environment: state.config.environment,
		};
		this.context = {
			environment: state.config.environment,
			identity: state.config.identity,
		};
	}

	getState() {
		if (!this.isInit()) throw new NotInitializedError();
		return {
			flags: this.flags.getAll(),
			config: {
				environment: this.context?.environment!,
				identity: this.context?.identity!,
			},
		};
	}

	private isInit() {
		return this.initState === "INITIALIZED";
	}

	private generateIdentity() {
		const identity =
			this.identityStorage.get() || this.identityGenerator.generate();
		this.identityStorage.save(identity);
		return identity;
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
		const savedFlags = this.flagsStorage.get();
		this.changeFlags(this.populateWithDefaultFlags(savedFlags));
	}

	private async loadFromApi() {
		const flags = await this.api.getFlags(
			this.context!.environment,
			this.context!.identity || "",
		);
		this.changeFlags(this.populateWithDefaultFlags(flags));
		this.flagsStorage.save(this.flags.getAll());
	}

	private populateWithDefaultFlags(flags: Record<string, boolean>) {
		const defaultFlags = this.config!.defaultFlags || {};
		return new Flags({ ...defaultFlags, ...flags });
	}
}

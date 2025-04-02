export type FlagsStorage = {
	save(flags: Record<string, boolean>): void;
	get(): Record<string, boolean>;
};

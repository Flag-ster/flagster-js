export type ILocalStorage = {
	save(flags: Record<string, boolean>): void;
	get(): Record<string, boolean>;
};

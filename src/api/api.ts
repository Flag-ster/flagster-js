export type IApi = {
	getFlags: (environment: string) => Promise<Record<string, boolean>>;
};

export type IApi = {
	getFlags: (
		environment: string,
		identity: string,
	) => Promise<Record<string, boolean>>;
};

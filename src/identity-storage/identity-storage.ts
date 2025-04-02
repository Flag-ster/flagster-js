export type IdentityStorage = {
	save: (identity: string) => void;
	get: () => string | undefined;
};

interface IException {
	message?: string;
	desc?: string;
}

export default class Exception extends Error {
	desc: string | undefined;

	constructor(params: IException) {
		super(params.message);
		this.desc = params.desc;
	}
}

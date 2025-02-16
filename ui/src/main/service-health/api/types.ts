export interface IEnviroment {
	id: number;
	title: string;
	description: string;
	created_at: string;
}

export interface IService {
	id: number;
	environment_id: number;
	title: string;
	description: string;
	uptime: number;
	health_check_url: string;
	interval: number;
	created_at: string;
	status: 'unhealthy' | 'healthy';
}

export interface IOutage {
	start_time: string;
	end_time: string;
	text: string;
	downtime_duration: number;
}

export interface IServiceOutage {
	date: string;
	outages: IOutage[];
}

export type ServiceOutages = IServiceOutage[];

export interface IEnviromentDetails extends IEnviroment {
	services: IService[];
}

export interface ICreateEnvPayload {
	title: string;
	description?: string | null;
}

export interface IUpdateEnvPayload {
	envId: number;
	values: {
		title?: string;
		description?: string | null;
	};
}

export interface IServiceDetailsPayload {
	envId: number;
	serviceId: number;
}

export interface ICreateServicePayload {
	envId: number;
	values: {
		title: string;
		description?: string | null;
		health_check_url: string;
		interval: number;
	};
}
export interface IUpdateServicePayload {
	envId: number;
	serviceId: number;
	values: {
		title?: string;
		description?: string;
		health_check_url?: string;
		interval?: number;
	};
}

export interface IDeleteServicePayload {
	envId: number;
	serviceId: number;
}

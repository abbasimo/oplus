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

export interface IEnviromentDetails extends IEnviroment {
	services: IService[];
}

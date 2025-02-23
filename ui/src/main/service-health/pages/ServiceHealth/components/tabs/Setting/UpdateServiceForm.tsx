import { useForm } from 'react-hook-form';
import { pop } from 'react-material-overlay';
import { useUpdateServiceMutation } from '@main/service-health/api/services';
import { IService } from '@main/service-health/api/types';
import { RHFForm } from '@remate/components';

import UpsertServiceForm from './UpsertServiceForm';

interface IUpdateServiceFormProps {
	envId: number;
	service: IService;
}

export default function UpdateServiceForm({ envId, service }: IUpdateServiceFormProps) {
	const { mutate, isPending } = useUpdateServiceMutation({
		onSuccess() {
			pop({ id: 'update-service' });
		}
	});
	const methods = useForm({
		defaultValues: {
			title: service.title,
			description: service.description,
			health_check_url: service.health_check_url,
			interval: service.interval
		}
	});

	return (
		<RHFForm
			methods={methods}
			onSubmit={methods.handleSubmit((values) => {
				mutate({ envId, serviceId: service.id, values });
			})}
		>
			<UpsertServiceForm
				submitting={isPending}
				submitButtonText="ذخیره تغییرات"
			/>
		</RHFForm>
	);
}

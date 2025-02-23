import { useForm } from 'react-hook-form';
import { pop } from 'react-material-overlay';
import { useCreateServiceMutation } from '@main/service-health/api/services';
import { RHFForm } from '@remate/components';

import UpsertEnvironmentForm from './UpsertEnvironmentForm';

interface ICreateServiceFormProps {
	envId: number;
}

export default function CreateServiceForm({ envId }: ICreateServiceFormProps) {
	const { mutate, isPending } = useCreateServiceMutation({
		onSuccess() {
			pop({ id: 'create-service' });
		}
	});
	const methods = useForm({
		defaultValues: {
			title: '',
			description: null,
			health_check_url: '',
			interval: 5
		}
	});

	return (
		<RHFForm
			methods={methods}
			onSubmit={methods.handleSubmit((values) => {
				mutate({ envId, values });
			})}
		>
			<UpsertEnvironmentForm
				submitting={isPending}
				submitButtonText="ایجاد سرویس"
			/>
		</RHFForm>
	);
}

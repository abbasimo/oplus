import { useForm } from 'react-hook-form';
import { pop } from 'react-material-overlay';
import { useCreateEnvMutation } from '@main/service-health/api/environments';
import { RHFForm } from '@remate/components';

import UpsertEnvironmentForm from './UpsertEnvironmentForm';

export default function CreateEnvironmentForm() {
	const { mutate, isPending } = useCreateEnvMutation({
		onSuccess() {
			pop({ id: 'create-environment' });
		}
	});

	const methods = useForm({
		defaultValues: {
			title: '',
			description: null
		}
	});

	return (
		<RHFForm
			methods={methods}
			onSubmit={methods.handleSubmit((values) => {
				mutate(values);
			})}
		>
			<UpsertEnvironmentForm
				submitting={isPending}
				submitButtonText="ایجاد محیط جدید"
			/>
		</RHFForm>
	);
}

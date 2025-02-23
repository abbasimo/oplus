import { useForm } from 'react-hook-form';
import { pop } from 'react-material-overlay';
import { useUpdateEnvMutation } from '@main/service-health/api/environments';
import { IEnvironment } from '@main/service-health/api/types';
import { RHFForm } from '@remate/components';

import UpsertEnvironmentForm from './UpsertEnvironmentForm';

interface IUpdateEnvironmentFormProps {
	environment: IEnvironment;
}

export default function UpdateEnvironmentForm({ environment }: IUpdateEnvironmentFormProps) {
	const { mutate, isPending } = useUpdateEnvMutation({
		onSuccess() {
			pop({ id: 'edit-environment' });
		}
	});
	const methods = useForm({
		defaultValues: {
			title: environment.title,
			description: environment.description
		}
	});

	return (
		<RHFForm
			methods={methods}
			onSubmit={methods.handleSubmit(({ title, description }) => {
				mutate({ envId: environment.id, values: { title, description: description || null } });
			})}
		>
			<UpsertEnvironmentForm
				submitButtonText="ذخیره تغییرات"
				submitting={isPending}
			/>
		</RHFForm>
	);
}

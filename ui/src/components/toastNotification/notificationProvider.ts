import { toast } from 'react-toastify';
import { NotificationProviderType } from '@remate/core';

const notificationProvider: NotificationProviderType = {
	open: ({ key, message, type }) => {
		if (toast.isActive(key as string)) {
			toast.update(key as string, {
				render: message,
				closeButton: true,
				autoClose: 5000,
				type
			});
		} else {
			toast(message, {
				toastId: key,
				type
			});
		}
	},
	close: (key) => toast.dismiss(key)
};

export default notificationProvider;

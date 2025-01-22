import { LocalizationProvider } from '@remate/components';
import { useAppSelector } from '@store/hooks';
import { selectCurrentLanguageId } from '@store/slices/i18nSlice';

interface IRemateComponentsLocalizationProvider {
	children: React.ReactNode;
}

function RemateComponentsLocalizationProvider({ children }: IRemateComponentsLocalizationProvider) {
	const currentlang = useAppSelector(selectCurrentLanguageId);

	return <LocalizationProvider lang={currentlang}>{children}</LocalizationProvider>;
}

export default RemateComponentsLocalizationProvider;

import CurrentSetting from '../features/settings/components/CurrentSetting';
import SettingsOptions from '../features/settings/components/SettingsOptions';

export default function SettingsPage() {
    return (
        <>
            <h1 className="mb-6 text-2xl font-semibold">Paramètres</h1>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]">
                <SettingsOptions />
                <CurrentSetting />
            </div>
        </>
    );
}

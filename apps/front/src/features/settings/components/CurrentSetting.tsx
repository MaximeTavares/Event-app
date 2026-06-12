import { Outlet } from 'react-router';

export default function CurrentSetting() {
    return (
        <div className="min-w-0 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
            <Outlet />
        </div>
    );
}

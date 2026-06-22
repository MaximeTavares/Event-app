import { Outlet } from 'react-router';
import { PageContainer } from '../../../shared/layout/PageContainer';

export default function CurrentSetting() {
    return (
        <PageContainer>
            <Outlet />
        </PageContainer>
    );
}

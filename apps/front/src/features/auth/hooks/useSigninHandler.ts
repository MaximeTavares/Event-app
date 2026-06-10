import { LoginRequestDto } from '@app/contracts';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSignin } from './use_auth.service';

export const useSigninHandler = () => {
    const navigate = useNavigate();
    const signin = useSignin();
    const queryClient = useQueryClient();

    return async (data: LoginRequestDto) => {
        await signin.mutateAsync(data);

        await queryClient.invalidateQueries({
            queryKey: ['me'],
        });

        await navigate('/');
    };
};

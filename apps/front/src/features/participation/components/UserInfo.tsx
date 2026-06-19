type UserInfoProps = {
    user: {
        firstname: string | null;
        lastname: string | null;
        email: string;
    };
};

export function UserInfo({ user }: Readonly<UserInfoProps>) {
    return (
        <div className="flex flex-col min-w-0">
            <span className="font-medium truncate">
                {user.firstname} {user.lastname}
            </span>

            <span className="text-xs text-gray-500 truncate">{user.email}</span>
        </div>
    );
}

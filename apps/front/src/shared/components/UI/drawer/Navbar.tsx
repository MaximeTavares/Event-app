import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { GoSidebarCollapse } from 'react-icons/go';
import { FiLogOut } from 'react-icons/fi';

import { menuNavigates, menuMainSides } from './menuDrawer';
import Button from '../Button';
import { useSignout } from '../../../../features/auth/hooks/use_auth.service';

const Navbar = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(() => window.innerWidth >= 1024);

    const signoutMutation = useSignout();

    const handleSignout = async () => {
        await signoutMutation.mutateAsync();
        navigate('/');
    };

    return (
        <div className="drawer lg:drawer-open">
            <input
                id="app-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={drawerOpen}
                onChange={(e) => setDrawerOpen(e.target.checked)}
            />

            {/* CONTENT */}
            <div className="drawer-content min-h-screen bg-base-100">
                {!drawerOpen && (
                    <div className="lg:hidden p-2">
                        <label htmlFor="app-drawer" className="btn btn-square btn-ghost">
                            <GoSidebarCollapse className="size-6" />
                        </label>
                    </div>
                )}

                <main className="w-full min-h-screen">{children}</main>
            </div>

            {/* SIDEBAR */}
            <div className="drawer-side">
                <label htmlFor="app-drawer" className="drawer-overlay" />

                <aside className="w-64 bg-base-200 min-h-full flex flex-col">
                    {/* HEADER */}
                    <div className="p-4 font-bold">
                        H.E.L.P
                        <div className="text-xs opacity-70">Hub for Event Logistic & People</div>
                    </div>

                    {/* 🔵 NAV PRIMARY (ICÔNES ONLY) */}
                    <ul className="menu w-full px-2 flex flex-row justify-around items-center gap-2">
                        {menuNavigates.map((item) => (
                            <li key={item.label} className="flex-1">
                                <button
                                    onClick={() => navigate(item.path)}
                                    className="
                    btn btn-ghost btn-sm
                    w-full
                    aspect-square
                    flex items-center justify-center
                "
                                    title={item.label}
                                >
                                    {item.icon}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* 🟡 NAV SECONDARY (COMPACT BUTTONS) */}
                    <ul className="menu w-full px-2 mt-4 gap-1">
                        {menuMainSides.map((item) => (
                            <li key={item.label}>
                                <button
                                    onClick={() => navigate(item.path)}
                                    className="
                                        btn btn-ghost btn-sm
                                        justify-start
                                        gap-2
                                        w-full
                                        h-10
                                    "
                                >
                                    {item.icon}
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* FOOTER */}
                    <div className="mt-auto p-4">
                        <Button
                            variant="primary"
                            className="w-full btn-sm flex items-center gap-2"
                            onClick={handleSignout}
                        >
                            <FiLogOut />
                            Déconnexion
                        </Button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Navbar;

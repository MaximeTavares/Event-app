// src/shared/components/UI/Drawer.tsx
import React, { useState } from 'react';
import { menuNavigates, menuMainSides } from './menuDrawer';
import { useNavigate } from 'react-router';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { FiLogOut } from 'react-icons/fi';
import Button from '../Button';
import { useSignout } from '../../../../features/auth/hooks/use_auth.service';

const Navbar = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(() => window.innerWidth >= 1024);
    const [showSearchInput, setShowSearchInput] = useState(false);

    const signoutMutation = useSignout();

    const handleSignout = async () => {
        await signoutMutation.mutateAsync();
        navigate('/');
    };

    return (
        <div className="drawer lg:drawer-open">
            <input
                id="my-drawer-4"
                type="checkbox"
                className="drawer-toggle"
                checked={drawerOpen}
                onChange={(e) => setDrawerOpen(e.target.checked)}
            />
            <div className="drawer-content overflow-hidden">
                {/* Sidebar Mobile */}
                {!drawerOpen && (
                    <label
                        htmlFor="my-drawer-4"
                        aria-label="open sidebar"
                        className="btn btn-square btn-ghost lg:hidden"
                    >
                        <GoSidebarCollapse className="my-1.5 inline-block size-8" />
                    </label>
                )}
                {/* Page content here */}
                <div className="p-4 h-full overflow-y-auto">{children}</div>
            </div>
            <div className="drawer-side is-drawer-close:overflow-visible overflow-hidden">
                {/* Sidebar toggle icon */}
                <div className={`w-full flex ${drawerOpen ? 'justify-end' : 'justify-center'}`}>
                    <label
                        htmlFor="my-drawer-4"
                        aria-label="open sidebar"
                        className="btn btn-square btn-ghost"
                    >
                        {drawerOpen ? (
                            <GoSidebarExpand className="my-1.5 inline-block size-8" />
                        ) : (
                            <GoSidebarCollapse className="my-1.5 inline-block size-6" />
                        )}
                    </label>
                </div>
                {/* Header du menu */}
                <div className="menu w-full">
                    <span className="font-semibold">H.E.L.P</span>
                    <span className="font-semibold is-drawer-close:hidden">
                        (Hub for Event Logistic & People)
                    </span>
                </div>
                <label
                    htmlFor="my-drawer-4"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                {/* Navbar */}
                <nav className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                    {/* Sidebar content here */}
                    <ul className="menu w-full flex-row justify-center gap-2">
                        {/* List item Navigates */}
                        {menuNavigates.map((item, idx) => (
                            <li key={item.label + idx}>
                                <button
                                    className={
                                        'is-drawer-close:tooltip is-drawer-close:tooltip-right'
                                    }
                                    onClick={() => navigate(item.path)}
                                    data-tip={item.tooltip || item.label}
                                    aria-label={item.label}
                                >
                                    {item.icon}
                                    {!drawerOpen && (
                                        <span className="is-drawer-close:hidden">{item.label}</span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <ul className="menu w-full grow">
                        {/* List item Navigates */}
                        {menuMainSides.map((item, idx) => (
                            <li key={item.label + idx}>
                                {/* Search input */}
                                {item.isSearch ? (
                                    drawerOpen ? (
                                        <label className="input">
                                            {item.icon}
                                            <input
                                                type="search"
                                                required
                                                placeholder={item.label}
                                            />
                                        </label>
                                    ) : showSearchInput ? (
                                        <label className="input w-64">
                                            {item.icon}
                                            <input
                                                type="search"
                                                autoFocus
                                                placeholder={item.label}
                                                onBlur={() => setShowSearchInput(false)}
                                            />
                                        </label>
                                    ) : (
                                        <button
                                            className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                                            data-tip={item.tooltip || item.label}
                                            onClick={() => setShowSearchInput(true)}
                                        >
                                            {item.icon}
                                            <span className="is-drawer-close:hidden">
                                                {item.label}
                                            </span>
                                        </button>
                                    )
                                ) : (
                                    <button
                                        className={
                                            'is-drawer-close:tooltip is-drawer-close:tooltip-right'
                                        }
                                        onClick={() => navigate(item.path)}
                                        data-tip={item.tooltip || item.label}
                                        aria-label={item.label}
                                    >
                                        {item.icon}
                                        <span className="is-drawer-close:hidden">{item.label}</span>
                                    </button>
                                )}
                            </li>
                        ))}
                        <li className="mt-auto">
                            <Button
                                variant="secondary"
                                className="is-drawer-close:btn-square is-drawer-close:mx-auto is-drawer-close:w-full"
                                onClick={handleSignout}
                                aria-label="Se deconnecter"
                                data-tip="Se deconnecter"
                            >
                                <FiLogOut />
                                <span className="is-drawer-close:hidden">Se deconnecter</span>
                            </Button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;

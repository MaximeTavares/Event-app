import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { GoSidebarCollapse } from 'react-icons/go';

import { VisitorMenuMainSides } from './menuDrawer';

const VisitorNavbar = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(() => window.innerWidth >= 1024);

    return (
        <div className="drawer lg:drawer-open">
            <input
                id="visitor-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={drawerOpen}
                onChange={(e) => setDrawerOpen(e.target.checked)}
            />

            {/* CONTENT */}
            <div className="drawer-content min-h-screen bg-base-100">
                {/* MOBILE TOGGLE */}
                {!drawerOpen && (
                    <div className="lg:hidden p-2">
                        <label htmlFor="visitor-drawer" className="btn btn-square btn-ghost">
                            <GoSidebarCollapse className="size-6" />
                        </label>
                    </div>
                )}

                <main className="w-full min-h-screen">{children}</main>
            </div>

            {/* SIDEBAR */}
            <div className="drawer-side">
                <label htmlFor="visitor-drawer" className="drawer-overlay" />

                <aside className="w-64 bg-base-200 min-h-full flex flex-col">
                    {/* HEADER */}
                    <div className="p-4 font-bold">
                        H.E.L.P
                        <div className="text-xs opacity-70">Hub for Event Logistic & People</div>
                    </div>

                    {/* NAV (ONLY 2 BUTTONS) */}
                    <ul className="menu w-full px-2 mt-4 gap-1">
                        {VisitorMenuMainSides.map((item) => (
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
                </aside>
            </div>
        </div>
    );
};

export default VisitorNavbar;

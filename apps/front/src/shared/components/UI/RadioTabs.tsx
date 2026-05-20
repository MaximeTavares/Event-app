import React from "react";

type TabItem = {
	label: string;
	icon: React.ReactNode;
	content: React.ReactNode;
};

interface RadioTabsProps {
	tabs: TabItem[];
	defaultTabLabel: string;
	name?: string;
}
/**
 * Generic Radio Tabs component based on the DaisyUI `tabs-lift`.
 *
 * This component renders a set of tabs using radio inputs.
 * It strictly follows DaisyUI's required DOM structure to ensure proper styling and behavior.
 *
 * ⚠ Important:
 * - All tabs must share the same `name` to work correctly.
 * - `defaultTabLabel` must match one of the provided tab labels.
 *
 * @example
 *
 * <RadioTabs
 *   tabs={[
 *     {
 *       label: "Info",
 *       icon: <InfoIcon />,
 *       content: <EventDetailsCard />
 *     }
 *   ]}
 *   defaultTabLabel="Info"
 * />
 *
 */
export function RadioTabs({ tabs, defaultTabLabel, name = "RadioTabs" }: Readonly<RadioTabsProps>) {
	return (
		<div className="tabs tabs-lift">
			{tabs.map((tab) => (
				<React.Fragment key={tab.label}>
					<label className="tab gap-2">
						<input
							type="radio"
							name={name}
							defaultChecked={tab.label === defaultTabLabel}
						/>
						{tab.icon}
						{tab.label}
					</label>
					<div className="tab-content bg-base-100 border-base-300 p-6">{tab.content}</div>
				</React.Fragment>
			))}
		</div>
	);
}

import {
	GoPerson,
	GoBell,
	GoGear,
	GoHome,
	GoCodespaces,
	GoTrophy,
	GoGoal,
	GoSearch,
} from "react-icons/go";
import type { MenuItem } from "./type";

export const menuNavigates: MenuItem[] = [
	{
		label: "Profil",
		icon: <GoPerson className="size-5" />,
		path: "/me/profile",
		tooltip: "Profil",
	},
	{
		label: "Notifications",
		icon: <GoBell className="size-5" />,
		path: "/notifications",
		tooltip: "Notifications",
	},
	{
		label: "Paramètres",
		icon: <GoGear className="size-5" />,
		path: "/settings",
		tooltip: "Paramètres",
	},
];

export const menuMainSides: MenuItem[] = [
	{
		label: "Recherche",
		icon: <GoSearch className="my-1.5 inline-block size-5" />,
		isSearch: true,
		path: "/",
		tooltip: "Recherche",
	},
	{
		label: "Accueil",
		icon: <GoHome className="my-1.5 inline-block size-5" />,
		path: "/",
		tooltip: "Accueil",
	},
	{
		label: "Dashboard",
		icon: <GoCodespaces className="my-1.5 inline-block size-5" />,
		path: "/dashboard",
		tooltip: "Dashboard",
	},
	{
		label: "Évènements",
		icon: <GoTrophy className="my-1.5 inline-block size-5" />,
		path: "/me/events",
		tooltip: "Évènements",
	},
	{
		label: "Missions",
		icon: <GoGoal className="my-1.5 inline-block size-5" />,
		path: "/me/mission",
		tooltip: "Missions",
	},
];

export const VisitorMenuNavigates: MenuItem[] = [
	{
		label: "Connexion",
		icon: <GoPerson className="size-5" />,
		path: "/auth/signin",
		tooltip: "Connexion",
	},
];

export const VisitorMenuMainSides: MenuItem[] = [
	{
		label: "Accueil",
		icon: <GoHome className="my-1.5 inline-block size-5" />,
		path: "/",
		tooltip: "Accueil",
	},
];

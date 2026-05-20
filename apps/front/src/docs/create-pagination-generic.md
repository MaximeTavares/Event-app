# Guide - Créer une pagination générique et l'appliquer à la liste des événements

## Objectif

Mettre en place une pagination réutilisable dans le projet, puis l'appliquer à la liste des événements de la page d'accueil.

Le besoin se décompose en deux parties :

1. créer un composant UI générique capable d'afficher des contrôles de pagination,
2. brancher ce composant sur un cas concret, ici la Home, pour charger les événements 10 par 10.

Ce guide suit la logique déjà adoptée dans le projet :

1. la page construit les paramètres de requête,
2. le service ou l'API applique ces paramètres,
3. le composant de liste reste concentré sur l'affichage,
4. le composant de pagination reste réutilisable.

---

## Pourquoi créer un composant générique

Si on code un bouton ou des contrôles de pagination directement dans chaque liste, on duplique rapidement :

1. la gestion du changement de page,
2. le rendu des boutons précédent et suivant,
3. le calcul de l'état actif ou désactivé des contrôles,
4. le style visuel commun.

Un composant générique permet donc de :

1. centraliser le comportement,
2. garder un rendu cohérent entre les pages,
3. réutiliser la même base sur les événements, les utilisateurs, les messages ou les notifications,
4. faire évoluer le composant une seule fois.

---

## Architecture recommandée

La pagination doit être pensée en quatre niveaux.

### 1. Les filtres ou paramètres de requête

Ils contiennent les informations qui disent quelle portion des données doit être récupérée.

Exemple :

```ts
export interface EventFilters {
	statuses?: string[];
	start_date?: string;
	end_date?: string;
	city?: string;
	distanceKm?: number;
	latitude?: number;
	longitude?: number;
	page?: number;
	limit?: number;
}
```

Les champs utiles pour la pagination sont ici :

1. `page` : numéro de la page demandée,
2. `limit` : nombre maximum d'éléments à retourner.

### 2. L'API ou la couche de données

Elle applique `page` et `limit` sur les données réelles ou sur les fake data.

### 3. La page

Elle garde l'état local :

1. page courante,
2. taille de page,
3. remise à zéro quand les filtres changent.

### 4. Le composant de pagination

Il affiche uniquement l'interface de contrôle.

Il ne doit pas connaître les événements, les utilisateurs ou les messages. Il ne reçoit que des props génériques.

---

## Étape 1 - Ajouter les paramètres de pagination au contrat de filtres

Avant de construire un composant UI, il faut que le contrat de requête accepte déjà la pagination.

Dans le projet, cela passe par le type `EventFilters`.

Exemple :

```ts
export interface EventFilters {
	statuses?: string[];
	start_date?: string;
	end_date?: string;
	city?: string;
	distanceKm?: number;
	latitude?: number;
	longitude?: number;
	page?: number;
	limit?: number;
}
```

### Pourquoi cette étape est nécessaire

Sans `page` et `limit`, la page ne peut pas exprimer clairement son besoin à l'API.

Autrement dit :

1. le composant UI seul ne suffit pas,
2. la pagination doit aussi exister dans le contrat de données,
3. le front se prépare ainsi à une future API back paginée.

---

## Étape 2 - Appliquer la pagination dans l'API

Une fois `page` et `limit` disponibles, l'API doit limiter les résultats.

Dans le projet actuel, cela se fait dans la logique fake data de `event.api.ts`.

Extrait type :

```ts
if (filters.limit && filters.limit > 0) {
	const page = filters.page && filters.page > 0 ? filters.page : 1;
	const startIndex = (page - 1) * filters.limit;
	return filteredEvents.slice(startIndex, startIndex + filters.limit);
}

return filteredEvents;
```

### Explication

Dans la version actuelle du projet, la fake API utilise bien `page` et `limit` pour renvoyer une tranche précise de résultats.

La logique est la suivante :

1. si `limit` vaut `12 et `page`vaut`1`, on renvoie les éléments 1 à 10,
2. si `limit` vaut `12` et `page` vaut `2`, on renvoie les éléments 11 à 20,
3. si `limit` n'est pas défini, on renvoie toute la liste.

Autrement dit, la découpe par page est déjà active dans la couche fake data.

En revanche, cette couche ne fournit pas encore de métadonnées de pagination complètes, comme :

1. le nombre total d'éléments,
2. le nombre total de pages.

Cela veut dire que la logique de découpe existe déjà, mais que le calcul d'un `totalPages` fiable doit encore être branché proprement côté données ou côté page.

Le point important ici est que la pagination est appliquée après les autres filtres.

Donc l'ordre logique est :

1. filtrer par statut,
2. filtrer par ville,
3. filtrer par dates,
4. paginer le résultat final.

Cet ordre est le bon, sinon la page risque d'afficher un sous-ensemble incohérent.

---

## Étape 3 - Concevoir le composant générique de pagination

Le composant générique doit rester neutre.

Il ne doit pas savoir s'il est utilisé pour :

1. des événements,
2. des utilisateurs,
3. des documents,
4. des messages.

Il doit seulement savoir :

1. quelle est la page courante,
2. combien il y a de pages,
3. comment changer de page.

### Props recommandées

Exemple :

```ts
type PaginationProps = {
	currentPage?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
	className?: string;
};
```

### Pourquoi ces props

1. `currentPage` indique la page active,
2. `totalPages` permet d'activer ou désactiver précédent et suivant,
3. `onPageChange` rend le composant pilotable depuis la page parente,
4. `className` facilite l'intégration dans différents layouts.

---

## Étape 4 - Implémenter le composant Pagination

L'implémentation actuelle du projet suit cette logique :

```tsx
import Button from "./Button";

// Voir la documentation src/docs/create-pagination-generic.md

type PaginationProps = {
	currentPage?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
	className?: string;
};

export default function Pagination({
	currentPage = 1,
	totalPages = 1,
	onPageChange,
	className = "",
}: PaginationProps) {
	const canPaginate = Boolean(onPageChange) && totalPages > 1;

	return (
		<div className={`flex flex-wrap items-center justify-center gap-3 ${className}`.trim()}>
			{canPaginate ? (
				<div className="join">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="join-item"
						disabled={currentPage <= 1}
						onClick={() => onPageChange?.(currentPage - 1)}
					>
						«
					</Button>

					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="join-item pointer-events-none"
					>
						Page {currentPage} / {totalPages}
					</Button>

					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="join-item"
						disabled={currentPage >= totalPages}
						onClick={() => onPageChange?.(currentPage + 1)}
					>
						»
					</Button>
				</div>
			) : null}
		</div>
	);
}
```

### Pourquoi utiliser le modèle DaisyUI `join`

Ce choix permet d'obtenir un rendu plus compact et plus lisible pour une pagination courte.

Concrètement :

1. le bouton précédent,
2. l'indicateur de page,
3. le bouton suivant,

sont visuellement regroupés comme un seul bloc d'interface.

Le rendu attendu ressemble à ceci :

```tsx
<div className="join">
	<button className="join-item btn">«</button>
	<button className="join-item btn">Page 22</button>
	<button className="join-item btn">»</button>
</div>
```

### Ce que fait ce composant

1. il affiche précédent et suivant seulement si une vraie pagination par page existe,
2. il reste totalement découplé du type de données affichées.

Le bouton central qui affiche `Page X / Y` est volontairement non interactif grâce à `pointer-events-none`.

Son rôle est purement informatif.

### Point important

Le composant ne stocke pas lui-même l'état de page.

C'est volontaire.

La page parente reste responsable de :

1. la page courante,
2. le nombre total de pages,
3. le moment où on doit repasser à la page 1.

Cela rend le composant plus simple à réutiliser.

---

## Étape 5 - Intégrer la pagination dans la page Home

La page Home doit maintenant piloter le comportement.

Dans la nouvelle version visée, la Home utilise une vraie pagination par pages de 10 éléments.

Le principe est simple :

1. la page garde `currentPage` dans son état local,
2. elle envoie `page` et `limit` à la requête,
3. elle réinitialise `currentPage` à `1` dès qu'un filtre change.

### État local minimal

Exemple :

```ts
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 12;
```

### Construction des filtres

Exemple :

```ts
const filters = useMemo<EventFilters>(() => {
	return {
		statuses: statuses.length > 0 ? statuses : undefined,
		start_date: filterDateValue.start ?? undefined,
		end_date: filterDateValue.end ?? undefined,
		page: currentPage,
		limit: pageSize,
	};
}, [currentPage, filterDateValue, statuses]);
```

### Explication

Ici la logique est la suivante :

1. on demande toujours 10 éléments par page,
2. `currentPage` détermine quel bloc de résultats doit être chargé,
3. la requête change dès que la page courante change.

---

## Étape 6 - Réinitialiser la pagination quand les filtres changent

Dès qu'un filtre change, on veut revenir à la page 1.

Pourquoi ?

Parce qu'un nouveau jeu de résultats doit repartir d'un état clair.

Exemples :

```ts
onStatusesChange={(nextStatuses) => {
	setCurrentPage(1);
	setStatuses(nextStatuses);
}}

onLocationChange={(updater) => {
	setCurrentPage(1);
	setLocation((prev) => updater(prev));
}}

onFilterDateValueChange={(nextFilterDateValue) => {
	setCurrentPage(1);
	setFilterDateValue(nextFilterDateValue);
}}
```

Et pour le reset :

```ts
onReset={() => {
	setCurrentPage(1);
	setStatuses([]);
	setFilterDateValue({ start: null, end: null });
	setLocation({ city: '', distanceKm: 0 });
}}
```

### Pourquoi c'est important

Sans cette remise à zéro :

1. on peut rester sur une page qui n'a plus de sens avec le nouveau filtre,
2. le comportement devient moins lisible pour l'utilisateur,
3. la logique de pagination devient difficile à prédire.

---

## Étape 7 - Brancher la pagination dans HomeEventsList

La liste des événements n'a pas besoin de connaître le détail de la requête.

Elle doit seulement savoir :

1. quels événements afficher,
2. s'il faut afficher le contrôle de pagination,
3. quelle page est active,
4. comment changer de page.

Exemple de props :

```ts
type HomeEventsListProps = {
	listStatusMessage: string | null;
	events: Event[];
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};
```

Puis intégration du composant générique :

```tsx
<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
```

### Pourquoi cette séparation est utile

`HomeEventsList` reste un composant de présentation.

Il n'a pas besoin de savoir :

1. comment `limit` est calculé,
2. comment la requête est envoyée,
3. comment les filtres sont reconstruits.

Il affiche simplement :

1. la grille d'événements,
2. le composant de pagination,
3. le message de statut si nécessaire.

---

## Étape 8 - Brancher la pagination sur la Home

Dans la page, le branchement final ressemble à ceci :

```tsx
<HomeEventsList
	listStatusMessage={listStatusMessage}
	events={displayedEvents}
	currentPage={currentPage}
	totalPages={totalPages}
	onPageChange={setCurrentPage}
/>
```

### Explication

Le composant reçoit ici :

1. la page courante,
2. le nombre total de pages,
3. la fonction qui met à jour la page.

Cela veut dire :

1. un clic sur « ou » met à jour `currentPage`,
2. la requête est relancée avec `page` et `limit`,
3. la liste affiche seulement les 12 éléments de la page demandée.

---

## Ce que cette version couvre déjà

Avec cette implémentation, le projet sait déjà faire :

1. charger 12 éléments par page,
2. naviguer entre les pages,
3. réutiliser le composant de pagination sur d'autres listes,
4. garder un composant UI indépendant de la logique métier.

La limite actuelle n'est donc pas la navigation entre pages.

La vraie limite actuelle est l'absence de retour structuré du total depuis la couche de données.

---

## Ce qu'il faut en plus pour une pagination complète côté API

La navigation entre pages fonctionne côté UI dès que `page`, `limit`, `currentPage` et `onPageChange` sont branchés.

En revanche, pour une pagination vraiment complète, il faut aussi que l'API fournisse une information sur le volume total.

### Ce qu'il faudra en plus

Pour une pagination par page vraiment propre, il faudra connaître :

1. le nombre total d'éléments,
2. ou directement le nombre total de pages.

Cela veut dire qu'à terme l'API devra probablement renvoyer non seulement les données, mais aussi des métadonnées de pagination.

Exemple de forme plus complete :

```ts
type PaginatedResult<T> = {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};
```

---

## Recommandation pratique pour le projet

Pour l'état actuel du projet, la bonne démarche est celle-ci :

1. garder `Pagination.tsx` comme composant UI générique,
2. utiliser directement une pagination par pages de 12 éléments,
3. faire évoluer plus tard la réponse API pour exposer un total clair,
4. réutiliser dès maintenant ce composant pour d'autres listes simples.

Cette approche permet de garder une architecture propre sans bloquer le besoin immédiat.

---

## Résumé final

La pagination générique se construit donc en trois couches :

1. un contrat de filtres qui accepte `page` et `limit`,
2. une API qui applique ces paramètres,
3. un composant UI réutilisable qui affiche les contrôles.

L'intégration sur les événements suit ensuite cette logique :

1. la Home demande 12 éléments par page,
2. la liste affiche les cartes de la page courante,
3. le composant Pagination affiche le bloc DaisyUI avec précédent, page courante et suivant,
4. un clic change `currentPage` et relance la requête.

Cette base est déjà suffisante pour un usage réel, tout en préparant une pagination plus riche par la suite.

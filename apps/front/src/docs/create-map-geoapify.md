# Guide - Créer une carte Geoapify centrée sur le user avec un rayon de 25 km

## Objectif

Créer une carte Geoapify qui :

1. affiche la position de l'utilisateur à partir de son adresse dans user_profile,
2. affiche un cercle de 25 km autour de cette position,
3. affiche les événements présents dans ce cercle,
4. prépare le terrain pour le futur filtre distance.

Ce guide décrit l'architecture cible et une mise en place progressive adaptée à l'état actuel du projet.

## Ce que Geoapify peut faire pour ce besoin

Geoapify ne stocke pas vos événements métier, mais fournit les briques nécessaires pour les afficher sur une carte :

1. Maps / Map Tiles : fond de carte interactif.
2. Geocoding API : transformation d'une adresse utilisateur en coordonnées.
3. Marker Icon API : création de marqueurs personnalisés.
4. Static Maps API : génération d'une image de carte si vous ne voulez pas d'interactivité.

Pour vos événements HELP, la source de vérité reste votre API ou vos fake data. Geoapify sert à afficher, géocoder et styliser.

## Architecture recommandée

### 1. Données utilisateur

Le profil utilisateur doit exposer une adresse structurée exploitable pour le géocodage.

Contrat DTO backend de référence pour les données utilisateur :

```ts
type UserWithProfileAndAddressDTO = {
	user: UserDTO;
	profile: UserProfileDTO | null;
	address: AddressDTO | null;
};

type UserProfileDTO = {
	firstName?: string | null;
	lastName?: string | null;
	phoneNumber?: string | null;
	birthDate?: Date | null;
	bio?: string | null;
	avatarUrl?: string | null;
	createdAt?: Date;
	updatedAt?: Date | null; //Données calculées
	fullName?: string | null;
	age?: number | null;
};

type AddressDTO = {
	id: number;
	street_number: string;
	street_name: string;
	address_line_2?: string | null;
	city: string;
	postal_code: string;
	country: string;
	coordinates?: AddressCoordinates;
};

interface AddressCoordinates {
	lat: number;
	lon: number;
}
```

Remarque : les DTO backend ci-dessus deviennent la référence fonctionnelle pour l'intégration de la carte. Le front peut garder ses types locaux, mais ils doivent rester alignés avec ce contrat.

### 2. Données événement

Les événements doivent déjà exposer des coordonnées persistées.

L'état actuel du projet va déjà dans ce sens avec :

1. [src/features/address/types/address.type.ts](src/features/address/types/address.type.ts)
2. [src/features/event/api/fakeEventData.ts](src/features/event/api/fakeEventData.ts)

Contrat DTO backend de référence pour les événements :

```ts
class EventDTO {
	id: number;
	user: UserDTO;
	title: string;
	description: string;
	program: string;
	start_date: Date;
	end_date: Date;
	address: AddressDTO | null;
	status: Event_status;
	created_at: Date;
	updated_at: Date | null;
}

class EventWithUserAndAddressDTO {
	data: EventDTO & {
		address?: AddressDTO | null;
		user?: UserDTO | null;
	};
}
```

### 3. Responsabilités

Répartition recommandée :

1. user_profile : donne l'adresse de départ de l'utilisateur.
2. Geoapify Geocoding : transforme l'adresse utilisateur en lat/lon si nécessaire.
3. event.api : renvoie les événements avec leurs coordonnées.
4. composant carte : affiche user, rayon, événements.
5. filtre distance : réutilise le même point d'origine et le même rayon.

## Flux métier cible

Au chargement de la page carte :

1. récupérer le user_profile,
2. lire son adresse,
3. si address.coordinates existe, l'utiliser directement,
4. sinon géocoder l'adresse via Geoapify,
5. centrer la carte sur ce point,
6. dessiner un cercle de 25 km,
7. charger les événements,
8. ne garder sur la carte que ceux dont les coordonnées tombent dans ce rayon.

## Choix technique recommandé pour le front

Pour une carte interactive, le plus pragmatique ici est :

1. Geoapify Map Tiles comme fond de carte,
2. Leaflet ou MapLibre pour le rendu interactif,
3. vos événements comme source de marqueurs,
4. Geoapify Geocoding pour transformer l'adresse utilisateur en coordonnées.

### Pourquoi ce choix

1. Places API n'est pas adaptée pour stocker ou filtrer vos événements métier.
2. Une librairie de carte cliente est faite pour afficher vos propres points.
3. Le cercle de 25 km devient un simple objet graphique sur la carte.
4. La même base servira ensuite à FilterDistance.

---

## Étape 1 - Préparer les données utilisateur

Le minimum requis est une adresse utilisateur exploitable.

Exemple minimal :

```ts
const userProfile = {
	id: 1,
	userId: 1,
	address: {
		street_number: 8,
		street_name: "Rue de la République",
		postal_code: 59000,
		city: "Lille",
		country: "France",
	},
};
```

Si vous ne stockez pas encore l'adresse dans user_profile, il faut l'ajouter avant de brancher la carte.

## Étape 2 - Géocoder l'adresse du user

Le géocodage de l'adresse complète ne doit pas être le chemin principal côté front.

La bonne démarche est de le faire côté back au moment de la création ou de la mise à jour d'une adresse, aussi bien pour le user_profile que pour l'event.

### Démarche recommandée côté back

1. le front envoie une adresse complète au back,
2. le back valide les champs utiles : numéro, rue, code postal, ville, pays,
3. le back construit une chaîne d'adresse complète,
4. le back appelle Geoapify Forward Geocoding,
5. le back récupère lat et lon,
6. le back enregistre ces coordonnées dans address.coordinates,
7. le back renvoie ensuite l'adresse enrichie au front.

### Pourquoi faire cela côté back

1. la clé API Geoapify reste côté serveur,
2. les coordonnées sont générées une seule fois,
3. les données restent cohérentes entre user_profile, event et carte,
4. le front n'a plus à refaire du géocodage à chaque affichage.

### Cas d'usage visés

1. à la création d'une adresse d'événement,
2. à la modification d'une adresse d'événement,
3. à la création d'une adresse de user_profile,
4. à la modification d'une adresse de user_profile.

Le front pourra ensuite simplement lire address.coordinates pour :

1. afficher la carte,
2. dessiner le cercle de 25 km,
3. filtrer les événements dans la zone.

### Exemple de logique de géocodage réutilisable

Le bloc ci-dessous représente la logique de géocodage elle-même. `geoapify.service.ts`

Autrement dit :

1. geocodeAddress est la logique technique de géocodage,
2. enrichAddressWithCoordinates est le helper métier back qui s'appuie dessus.

Exemple de logique à réutiliser pour géocoder une adresse complète :

```ts
export interface Coordinates {
	lat: number;
	lon: number;
}

export interface GeocodingAddress {
	street_number?: number | string;
	street_name?: string;
	address_line_2?: string;
	postal_code?: number | string;
	city?: string;
	country?: string;
}

export type GeoapifyResponse = {
	results: {
		lat: number;
		lon: number;
	}[];
};

function buildAddressQuery(address: GeocodingAddress): string {
	return [
		address.street_number,
		address.street_name,
		address.address_line_2,
		address.postal_code,
		address.city,
		address.country,
	]
		.filter((value) => value !== undefined && value !== null && String(value).trim() !== "")
		.join(", ");
}

export async function geocodeAddress(address: GeocodingAddress): Promise<Coordinates | null> {
	const query = buildAddressQuery(address);
	if (!query) return null;

	const apiKey = process.env.GEOAPIFY_API_KEY;
	if (!apiKey) {
		throw new Error("La clé API Geoapify n'est pas définie");
	}

	const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&lang=fr&limit=10&filter=countrycode:fr&apiKey=${apiKey}`;

	try {
		const response = await fetch(url);
		if (!response.ok) return null;

		const result: GeoapifyResponse = await response.json();
		const firstResult = result.results?.[0];

		if (!firstResult) return null;

		return {
			lat: firstResult.lat,
			lon: firstResult.lon,
		};
	} catch (error) {
		console.error("Erreur geocodeAddress:", error);
		return null;
	}
}
```

### Exemple de helper métier back adapté à votre architecture

```ts
async function enrichAddressWithCoordinates(address: CreateAddressDto) {
	const coordinates = await geocodeAddress({
		street_number: address.street_number,
		street_name: address.street_name,
		address_line_2: address.address_line_2,
		postal_code: address.postal_code,
		city: address.city,
		country: address.country,
	});

	return {
		...address,
		coordinates,
	};
}
```

Ici, enrichAddressWithCoordinates est bien le helper back partagé.

Il ne remplace pas geocodeAddress :

1. geocodeAddress appelle Geoapify et renvoie lat/lon,
2. enrichAddressWithCoordinates adapte votre CreateAddressDto backend et ajoute coordinates,
3. les services user_profile et event réutilisent ensuite ce helper métier.

L'idée n'est donc pas forcément de créer une méthode createAddress isolée, mais plutôt d'enrichir l'adresse juste avant connectOrCreate ou juste avant create dans le service métier concerné.

### Cas user_profile

Dans le flux actuel, le point d'entrée est buildProfileData. La démarche recommandée est :

1. si profile.address existe, appeler le géocodage côté back,
2. enrichir l'objet address avec coordinates,
3. passer cet objet enrichi au create du connectOrCreate.

Exemple adapté à la logique :

```ts
export async function buildProfileData(profile: CreateUserProfileDto | UpdateUserProfileDto) {
	const { address, ...profileData } = profile;

	const addressWithCoordinates = address
		? await enrichAddressWithCoordinates(address)
		: undefined;

	return {
		profileData,
		addressData: addressWithCoordinates
			? {
					connectOrCreate: {
						where: {
							unique_address: {
								street_number: addressWithCoordinates.street_number,
								street_name: addressWithCoordinates.street_name,
								city: addressWithCoordinates.city,
								postal_code: addressWithCoordinates.postal_code,
								country: addressWithCoordinates.country,
							},
						},
						create: addressWithCoordinates,
					},
				}
			: undefined,
	};
}
```

### Cas event

Dans EventService, le bon endroit est juste avant le prisma.event.create ou prisma.event.update, au moment où on prépare la partie Address du data.

Exemple adapté à create :

```ts
async create(
	createEventDto: CreateEventDto,
	userId: number,
): Promise<EventWithUserAndAddressDTO> {
	await this.userService.validateUser(userId);

	const { address, ...eventData } = createEventDto;
	const addressWithCoordinates = await enrichAddressWithCoordinates(address);

	const newEvent = await this.prisma.event.create({
		data: {
			...eventData,
			Address: {
				connectOrCreate: {
					where: {
						unique_address: {
							street_number: addressWithCoordinates.street_number,
							street_name: addressWithCoordinates.street_name,
							city: addressWithCoordinates.city,
							postal_code: addressWithCoordinates.postal_code,
							country: addressWithCoordinates.country,
						},
					},
					create: addressWithCoordinates,
				},
			},
			User: { connect: { id: userId } },
			start_date: new Date(createEventDto.start_date),
			end_date: new Date(createEventDto.end_date),
			status: 'DRAFT',
		},
		select: eventWithAddressAndUser,
	});

	return {
		data: mapEvent(newEvent),
	};
}
```

La même logique doit être rejouée dans update quand l'adresse change.

### Recommandation d'implémentation

Pour éviter de dupliquer la logique entre user_profile et event, le plus propre est :

1. créer un helper back partagé du type enrichAddressWithCoordinates,
2. l'appeler dans le flux user_profile,
3. l'appeler dans le flux event create,
4. l'appeler dans le flux event update si l'adresse est modifiée.

Le bénéfice est direct : les coordonnées sont persistées dès l'écriture en base, et le front n'a ensuite plus besoin de géocoder l'adresse complète pour afficher la carte ou calculer le rayon.

---

## Étape 3 - Afficher la carte

Dans cette approche, on passe sur une vraie carte interactive avec Leaflet, tout en gardant Geoapify comme fournisseur de tuiles.

Le front affiche une carte Leaflet classique, puis lui ajoute :

1. le fond de carte Geoapify,
2. le point utilisateur,
3. les marqueurs événements,
4. un cercle de 25 km autour du user.

L'intérêt est important : on conserve vos coordonnées persistées côté back, mais on gagne maintenant le déplacement, le zoom et une structure réutilisable pour la suite.

### Principe général

Le fond de carte provient des tuiles Geoapify au format Z/X/Y :

```text
https://maps.geoapify.com/v1/tile/{style}/{z}/{x}/{y}.png?apiKey=...
```

Leaflet se charge ensuite de :

1. créer l'instance de carte,
2. charger les tuiles Geoapify,
3. centrer la vue sur l'utilisateur,
4. afficher les marqueurs,
5. dessiner le cercle de 25 km.

### Ce que doit faire le front

Le flux recommandé devient :

1. récupérer user_profile.address.coordinates,
2. récupérer les événements avec event.address.coordinates ou event.location.coordinates,
3. transformer ces coordonnées en données compatibles carte,
4. créer la configuration Geoapify pour Leaflet,
5. afficher la carte,
6. ajouter les marqueurs et le cercle.

### Préparer la configuration Geoapify pour Leaflet

On centralise la configuration de la couche de tuiles dans un helper dédié. `LeafletMap.tsx`

### Explication des méthodes

#### GeoapifyMapStyle

Ce type limite explicitement les styles autorisés dans le projet.

```tsx
export type GeoapifyMapStyle = "osm-bright" | "osm-carto" | "toner-grey" | "klokantech-basic";
```

Le bénéfice est simple :

1. éviter les fautes de frappe dans le nom du style,
2. garder une liste claire des styles validés côté équipe,
3. permettre plus tard un sélecteur de style sans ouvrir tous les cas possibles.

#### GeoapifyLeafletTileLayerOptions

Cette interface décrit l'objet final attendu par votre couche de tuiles.

```tsx
export interface GeoapifyLeafletTileLayerOptions {
	attribution: string;
	apiKey: string;
	maxZoom: number;
	id: GeoapifyMapStyle;
	url: string;
	baseUrl: string;
	retinaUrl: string;
	isRetina: boolean;
}
```

Elle regroupe :

1. les URLs utiles,
2. la clé API,
3. l'attribution obligatoire,
4. le maxZoom,
5. l'information retina.

Autrement dit, le composant carte n'a pas à reconstruire lui-même ces informations.

#### GEOAPIFY_MAPS_HOST

```tsx
const GEOAPIFY_MAPS_HOST = "https://maps.geoapify.com/v1/tile";
```

Cette constante porte la base commune des URLs de tuiles Geoapify.

Le fait de l'extraire évite de dupliquer la même chaîne dans plusieurs fonctions.

#### GEOAPIFY_LEAFLET_ATTRIBUTION

Leaflet doit afficher l'attribution du fournisseur de tuiles.

```tsx
export const GEOAPIFY_LEAFLET_ATTRIBUTION =
	'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors';
```

Cette constante garantit que le texte d'attribution reste cohérent partout dans le projet.

#### GEOAPIFY_LEAFLET_MAX_ZOOM

```tsx
export const GEOAPIFY_LEAFLET_MAX_ZOOM = 20;
```

Cette constante fixe le zoom maximal supporté par la couche Geoapify utilisée.

Elle sert à éviter des comportements incohérents si plusieurs composants carte apparaissent plus tard.

#### buildTileUrl

```tsx
function buildTileUrl(style: GeoapifyMapStyle, apiKey: string, retina = false): string {
	const suffix = retina ? "@2x" : "";
	return `${GEOAPIFY_MAPS_HOST}/${style}/{z}/{x}/{y}${suffix}.png?apiKey=${apiKey}`;
}
```

Cette fonction fabrique l'URL brute des tuiles à partir de :

1. style,
2. apiKey,
3. mode retina ou non.

Si retina vaut true, on génère la version @2x pour les écrans à forte densité de pixels.

#### createGeoapifyLeafletTileLayerOptions

Cette fonction construit l'objet complet utilisé par la couche Leaflet.

```tsx
export function createGeoapifyLeafletTileLayerOptions(
	apiKey: string,
	style: GeoapifyMapStyle = "osm-bright",
	isRetina = typeof window !== "undefined" ? window.devicePixelRatio > 1 : false,
): GeoapifyLeafletTileLayerOptions {
	const baseUrl = buildTileUrl(style, apiKey, false);
	const retinaUrl = buildTileUrl(style, apiKey, true);

	return {
		attribution: GEOAPIFY_LEAFLET_ATTRIBUTION,
		apiKey,
		maxZoom: GEOAPIFY_LEAFLET_MAX_ZOOM,
		id: style,
		url: isRetina ? retinaUrl : baseUrl,
		baseUrl,
		retinaUrl,
		isRetina,
	};
}
```

Son rôle est de :

1. calculer l'URL standard,
2. calculer l'URL retina,
3. choisir l'URL effectivement utilisée,
4. retourner toutes les métadonnées utiles dans un seul objet.

Elle devient donc l'entrée principale pour tout composant qui veut brancher Geoapify dans Leaflet.

#### getDefaultGeoapifyLeafletConfig

Cette fonction lit directement la clé dans l'environnement front.

```tsx
export function getDefaultGeoapifyLeafletConfig(style: GeoapifyMapStyle = "osm-bright") {
	const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

	if (!apiKey) {
		throw new Error("La clé API Geoapify n'est pas définie dans .env (VITE_GEOAPIFY_API_KEY)");
	}

	return createGeoapifyLeafletTileLayerOptions(apiKey, style);
}
```

Son rôle est de :

1. sécuriser l'accès à VITE_GEOAPIFY_API_KEY,
2. échouer immédiatement si la configuration manque,
3. fournir une configuration prête à l'emploi avec un style par défaut.

Elle simplifie le code du composant carte, qui n'a plus à gérer lui-même la lecture de la variable d'environnement.

Exemple de helper complet `LeafletMap.tsx` :

```tsx
export type GeoapifyMapStyle = "osm-bright" | "osm-carto" | "toner-grey" | "klokantech-basic";

export interface GeoapifyLeafletTileLayerOptions {
	attribution: string;
	apiKey: string;
	maxZoom: number;
	id: GeoapifyMapStyle;
	url: string;
	baseUrl: string;
	retinaUrl: string;
	isRetina: boolean;
}

const GEOAPIFY_MAPS_HOST = "https://maps.geoapify.com/v1/tile";

export const GEOAPIFY_LEAFLET_ATTRIBUTION =
	'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors';

export const GEOAPIFY_LEAFLET_MAX_ZOOM = 20;

function buildTileUrl(style: GeoapifyMapStyle, apiKey: string, retina = false): string {
	const suffix = retina ? "@2x" : "";
	return `${GEOAPIFY_MAPS_HOST}/${style}/{z}/{x}/{y}${suffix}.png?apiKey=${apiKey}`;
}

export function createGeoapifyLeafletTileLayerOptions(
	apiKey: string,
	style: GeoapifyMapStyle = "osm-bright",
	isRetina = typeof window !== "undefined" ? window.devicePixelRatio > 1 : false,
): GeoapifyLeafletTileLayerOptions {
	const baseUrl = buildTileUrl(style, apiKey, false);
	const retinaUrl = buildTileUrl(style, apiKey, true);

	return {
		attribution: GEOAPIFY_LEAFLET_ATTRIBUTION,
		apiKey,
		maxZoom: GEOAPIFY_LEAFLET_MAX_ZOOM,
		id: style,
		url: isRetina ? retinaUrl : baseUrl,
		baseUrl,
		retinaUrl,
		isRetina,
	};
}

export function getDefaultGeoapifyLeafletConfig(style: GeoapifyMapStyle = "osm-bright") {
	const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

	if (!apiKey) {
		throw new Error("La clé API Geoapify n'est pas définie dans .env (VITE_GEOAPIFY_API_KEY)");
	}

	return createGeoapifyLeafletTileLayerOptions(apiKey, style);
}
```

### Données minimales nécessaires

On centralise ces éléments dans un fichier dédié plus explicite :

```ts
src / shared / components / UI / map / map - data.ts;
```

Ce fichier ne contient pas seulement des types.

Il contient aussi les fonctions de transformation qui convertissent les données métier du projet en données prêtes pour la carte.

```ts
import type { AddressCoordinates } from "../../../../features/address/types/address.type";
import type { Event } from "../../../../features/event/types/event.type";
import type { UserWithProfileAndAddress } from "../../../../features/user_profile/types/types";

export type UserOrigin = AddressCoordinates;
export type EventMapPoint = Pick<Event, "id" | "title"> & AddressCoordinates;

export function toUserOrigin(userProfile: UserWithProfileAndAddress): UserOrigin | null {
	const coordinates = userProfile.address?.coordinates;

	if (!coordinates) {
		return null;
	}

	return {
		lat: coordinates.lat,
		lon: coordinates.lon,
	};
}

export function toEventMapPoints(events: Event[]): EventMapPoint[] {
	return events
		.filter(
			(
				event,
			): event is Event & {
				address: NonNullable<Event["address"]> & { coordinates: UserOrigin };
			} => Boolean(event.address?.coordinates),
		)
		.map(
			(event): EventMapPoint => ({
				id: event.id,
				title: event.title,
				lat: event.address.coordinates.lat,
				lon: event.address.coordinates.lon,
			}),
		);
}
```

Autrement dit, on ne recrée pas deux structures métier supplémentaires.

On réutilise :

1. `AddressCoordinates` pour l'origine utilisateur,
2. `Event` pour extraire seulement `id` et `title`,
3. `lat` et `lon` via `AddressCoordinates`.

Et on ajoute dans ce même fichier deux helpers simples :

1. `toUserOrigin(...)` pour extraire l'origine carte à partir de `UserWithProfileAndAddress`,
2. `toEventMapPoints(...)` pour transformer une liste d'événements en points affichables sur la carte.

Cette organisation est plus explicite que `map.type.ts`, parce que le fichier ne contient pas seulement des types mais aussi de la logique de mapping.

---

### Suite de la création de la map

Une fois la configuration Geoapify prête, la suite est très classique côté Leaflet.

#### 1. Installer la stack carte

Si ce n'est pas déjà fait, il faut ajouter Leaflet et son intégration React.

```bash
npm install leaflet react-leaflet
```

Puis charger le CSS Leaflet dans le point d'entrée front `src/main.tsx`.

Exemple :

```ts
import "leaflet/dist/leaflet.css";
```

#### 2. Créer un composant carte dédié dans `src/shared/components/UI/map/UserEventsMap.tsx`

Le composant peut recevoir seulement les données utiles :

```tsx
type UserEventsMapProps = {
	userOrigin: UserOrigin;
	events: EventMapPoint[];
	radiusMeters?: number;
};
```

#### 3. Brancher les tuiles Geoapify dans Leaflet

Le composant récupère la configuration via le helper `src/shared/utils/leafletMap.tsx`, puis l'injecte dans TileLayer.

Exemple `UserEventsMap.tsx` :

```tsx
const tileLayer = getDefaultGeoapifyLeafletConfig("osm-bright");
```

Puis `UserEventsMap.tsx` :

```tsx
<TileLayer attribution={tileLayer.attribution} url={tileLayer.url} maxZoom={tileLayer.maxZoom} />
```

#### 4. Centrer la vue sur l'utilisateur

La carte doit démarrer sur la position du user.

Exemple `UserEventsMap.tsx` :

```tsx
<MapContainer
	center={[userOrigin.lat, userOrigin.lon]}
	zoom={9}
	scrollWheelZoom
	className="h-130 w-full rounded-xl"
>
```

#### 5. Ajouter le marqueur utilisateur

Le point utilisateur devient un Marker Leaflet.

Exemple `UserEventsMap.tsx` :

```tsx
<Marker position={[userOrigin.lat, userOrigin.lon]}>
	<Popup>Position de l'utilisateur</Popup>
</Marker>
```

#### 6. Ajouter les marqueurs des événements

On parcourt les événements déjà transformés en EventMapPoint.

Exemple `UserEventsMap.tsx` :

```tsx
{
	events.map((event) => (
		<Marker key={event.id} position={[event.lat, event.lon]}>
			<Popup>{event.title}</Popup>
		</Marker>
	));
}
```

#### 7. Dessiner le cercle de 25 km

Le cercle se base sur la position du user et sur un rayon en mètres.

Exemple `UserEventsMap.tsx` :

```tsx
<Circle
	center={[userOrigin.lat, userOrigin.lon]}
	radius={radiusMeters}
	pathOptions={{
		color: "#0ea5e9",
		fillColor: "#0ea5e9",
		fillOpacity: 0.12,
		weight: 2,
	}}
/>
```

Dans le projet actuel, le composant utilise bien `radiusMeters` au lieu d'une valeur figée, ce qui permet déjà de préparer le futur branchement avec le filtre distance.

### Exemple de structure de composant React

```tsx
type UserEventsMapProps = {
	userOrigin: UserOrigin;
	events: EventMapPoint[];
	radiusMeters?: number;
};

export function UserEventsMap({ userOrigin, events, radiusMeters = 25_000 }: UserEventsMapProps) {
	const tileLayer = getDefaultGeoapifyLeafletConfig("osm-bright");

	return (
		<MapContainer
			center={[userOrigin.lat, userOrigin.lon]}
			zoom={9}
			scrollWheelZoom
			className="h-130 w-full rounded-xl border border-base-300"
		>
			<TileLayer
				attribution={tileLayer.attribution}
				url={tileLayer.url}
				maxZoom={tileLayer.maxZoom}
			/>

			<Marker position={[userOrigin.lat, userOrigin.lon]}>
				<Popup>Position de l'utilisateur</Popup>
			</Marker>

			<Circle
				center={[userOrigin.lat, userOrigin.lon]}
				radius={radiusMeters}
				pathOptions={{
					color: "#0ea5e9",
					fillColor: "#0ea5e9",
					fillOpacity: 0.12,
					weight: 2,
				}}
			/>

			{events.map((event) => (
				<Marker key={event.id} position={[event.lat, event.lon]}>
					<Popup>{event.title}</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
```

#### 8. Créer un hook dédié pour l'origine utilisateur

Pour éviter de recalculer l'origine directement dans la page, on peut encapsuler cette logique dans un hook dédié : `src/shared/components/UI/map/useUserMapOrigin.ts`.

Ce hook ne récupère pas lui-même les données du profil. Son rôle est uniquement de transformer un `UserWithProfileAndAddress` déjà chargé en `UserOrigin | null`.

Exemple :

```tsx
import { useMemo } from "react";
import type { UserWithProfileAndAddress } from "../../../../features/user_profile/types/types";
import type { UserOrigin } from "./map-data";
import { toUserOrigin } from "./map-data";

export function useUserMapOrigin(
	userWithProfileAndAddress: UserWithProfileAndAddress | null | undefined,
): UserOrigin | null {
	return useMemo(() => {
		if (!userWithProfileAndAddress) {
			return null;
		}

		return toUserOrigin(userWithProfileAndAddress);
	}, [userWithProfileAndAddress]);
}
```

#### 9. Intégrer la carte dans `src/pages/Home.tsx`

Une fois le composant et le hook prêts, l'étape suivante consiste à les brancher dans la page qui possède déjà les filtres et la liste d'événements.

Dans le projet actuel, `Home.tsx` ne lit plus directement `fakeUsersWithProfileAndAddress`.

On suit maintenant la même logique que pour les événements :

1. une API `user_profile` prête pour le back,
2. un hook React Query dédié,
3. un fallback fake uniquement à l'intérieur de l'API temporaire.

Le flux est donc :

1. `src/features/user_profile/api/api.ts` expose `getCurrentUserWithProfileAndAddress()`,
2. `src/features/user_profile/hooks/use_user_profile.service.ts` expose `useGetCurrentUserWithProfileAndAddress()`,
3. `Home.tsx` consomme ce hook,
4. `useUserMapOrigin(...)` transforme ensuite le résultat en origine de carte.

Exemple `Home.tsx` :

```tsx
import { useMemo, useState } from "react";
import { useGetCurrentUserWithProfileAndAddress } from "../features/user_profile/hooks/use_user_profile.service";
import UserEventsMap from "../shared/components/UI/map/UserEventsMap";
import { toEventMapPoints } from "../shared/components/UI/map/map-data";
import { useUserMapOrigin } from "../shared/components/UI/map/useUserMapOrigin";

const { data: events = [], isLoading, isError, error } = useGetEvents(filters);
const {
	data: currentUser,
	isLoading: isUserLoading,
	isError: isUserError,
	error: userError,
} = useGetCurrentUserWithProfileAndAddress();
const userOrigin = useUserMapOrigin(currentUser);
const eventMapPoints = useMemo(() => toEventMapPoints(events), [events]);
const mapRadiusMeters = location.distanceKm > 0 ? location.distanceKm * 1000 : 25_000;

return (
	<>
		{!isLoading && !isError && !isUserLoading && !isUserError && userOrigin ? (
			<UserEventsMap
				userOrigin={userOrigin}
				events={eventMapPoints}
				radiusMeters={mapRadiusMeters}
			/>
		) : null}
	</>
);
```

Avec cette structure, le jour où le back est prêt, il suffit essentiellement de remplacer le fallback fake dans `src/features/user_profile/api/api.ts` par le vrai appel HTTP, comme cela a déjà été préparé pour `event.api.ts`.

Exemple `src/features/user_profile/api/api.ts` :

```ts
// import axios from "axios";
import type { UserWithProfileAndAddress } from "../types/types";
import { fakeUsersWithProfileAndAddress } from "../../user/api/fakeUserData";

// const API_URL = "";

export async function getCurrentUserWithProfileAndAddress(): Promise<UserWithProfileAndAddress | null> {
	// const { data } = await axios.get<UserWithProfileAndAddress>(`${API_URL}/user-profile/me`);

	await new Promise((resolve) => setTimeout(resolve, 200));

	return fakeUsersWithProfileAndAddress[0] ?? null;
}
```

Exemple `src/features/user_profile/hooks/use_user_profile.service.ts` :

```ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getCurrentUserWithProfileAndAddress } from "../api/api";
import type { UserWithProfileAndAddress } from "../types/types";

export function useGetCurrentUserWithProfileAndAddress(): UseQueryResult<
	UserWithProfileAndAddress | null,
	Error
> {
	return useQuery<UserWithProfileAndAddress | null, Error>({
		queryKey: ["user-profile", "me"],
		queryFn: () => getCurrentUserWithProfileAndAddress(),
	});
}
```

### Avantages de cette option

1. vraie carte interactive avec zoom et déplacement,
2. intégration propre avec vos coordonnées déjà persistées,
3. configuration Geoapify centralisée dans un helper réutilisable,
4. base solide pour ajouter ensuite clustering, filtres visuels ou fitBounds.

### Limites de cette option

1. il faut ajouter la dépendance Leaflet côté front,
2. il faut gérer le CSS Leaflet et éventuellement les icônes personnalisées,
3. l'affichage des marqueurs demande un peu plus de code qu'une image statique.

### Recommandation pratique

Pour cette étape 3, cette approche est la bonne si l'objectif est :

1. afficher une vraie carte utilisateur,
2. préparer le futur filtrage par rayon,
3. réutiliser le même socle pour la suite du projet,
4. éviter de réécrire toute la logique au moment de passer à une carte interactive.

## Étape 4 - Différencier les marqueurs

Avant de passer au rayon de 25 km, il est utile de clarifier la stratégie d'affichage des marqueurs.

Dans le projet actuel, on ne garde pas l'icône Leaflet par défaut pour tous les points.

On utilise l'API Marker Icon de Geoapify pour générer deux icônes différentes :

1. un marqueur utilisateur,
2. un marqueur événement.

L'objectif est simple : rendre la lecture de la carte immédiate.

### Principe retenu

Le composant `UserEventsMap.tsx` crée deux URLs d'icônes Geoapify :

1. une icône Material `person` en bleu pour l'utilisateur,
2. une icône Material `event` en orange pour les événements.

Exemple de helper local dans `UserEventsMap.tsx` :

```tsx
function buildMarkerIconUrl(apiKey: string, icon: string, color: string): string {
	const searchParams = new URLSearchParams({
		apiKey,
		type: "material",
		icon,
		iconType: "material",
		size: "52",
		color,
		contentColor: "#ffffff",
	});

	return `https://api.geoapify.com/v2/icon?${searchParams.toString()}`;
}
```

### Intégration dans `UserEventsMap.tsx`

Le composant crée ensuite deux objets `Icon` Leaflet distincts :

```tsx
const userMarkerIcon = useMemo(
	() =>
		new Icon({
			iconUrl: buildMarkerIconUrl(tileLayer.apiKey, "person", "#2563eb"),
			iconSize: [31, 46],
			iconAnchor: [15, 46],
			popupAnchor: [0, -40],
		}),
	[tileLayer.apiKey],
);

const eventMarkerIcon = useMemo(
	() =>
		new Icon({
			iconUrl: buildMarkerIconUrl(tileLayer.apiKey, "event", "#d97706"),
			iconSize: [31, 46],
			iconAnchor: [15, 46],
			popupAnchor: [0, -40],
		}),
	[tileLayer.apiKey],
);
```

Puis ces icônes sont injectées dans les marqueurs :

```tsx
<Marker position={[userOrigin.lat, userOrigin.lon]} icon={userMarkerIcon}>
	<Popup>Position de l'utilisateur</Popup>
</Marker>;

{
	events.map((event) => (
		<Marker key={event.id} position={[event.lat, event.lon]} icon={eventMarkerIcon}>
			<Popup>{event.title}</Popup>
		</Marker>
	));
}
```

### Pourquoi cette démarche

Cette approche a plusieurs avantages :

1. l'utilisateur et les événements sont distingués visuellement sans ambiguïté,
2. on reste dans l'écosystème Geoapify,
3. on peut faire évoluer facilement les icônes plus tard selon le type d'événement ou le statut,
4. on évite de dépendre de l'icône Leaflet par défaut, qui ne différencie pas les usages métier.

### Point d'attention

L'API Marker Icon consomme des crédits Geoapify.

En pratique, comme les URLs générées sont stables et réutilisables, cette approche reste adaptée tant que vous gardez un nombre limité de variantes d'icônes.

---

## Étape 5 - Représenter le rayon de 5 km

Le rayon de 5 km correspond à 5 000 mètres.

Dans votre logique cible immédiate, l'origine de la carte ne doit plus toujours être l'utilisateur.

La règle devient :

1. si une ville est saisie dans `FilterLocation`, cette ville devient l'origine de recherche,
2. sinon, on garde l'origine issue du profil utilisateur,
3. le cercle utilise `location.distanceKm` si une valeur est choisie,
4. sinon le cercle utilise 5 000 mètres par défaut.

Autrement dit, la priorité est donnée à la ville du filtre, pas au profil.

### Étape 5.1 - Garder le rayon par défaut à 5 km

Le calcul du rayon peut rester très simple dans `Home.tsx` :

```ts
const mapRadiusMeters = location.distanceKm > 0 ? location.distanceKm * 1000 : 5_000;
```

Ce que cela signifie :

1. si le slider distance vaut `25`, le cercle fait `25_000` mètres,
2. si aucune distance n'est encore choisie, le cercle fait `5_000` mètres.

### Étape 5.2 - Faire de la ville filtrée l'origine prioritaire

Le premier besoin n'est pas encore de filtrer côté back.

Le premier besoin est de déterminer quel point doit servir d'origine à la carte.

On peut formaliser cette règle dans le guide avant tout changement de code :

```ts
const hasCityFilter = location.city.trim().length > 0;
```

Ensuite :

1. si `hasCityFilter` vaut `true`, il faut géocoder `location.city`,
2. si `hasCityFilter` vaut `false`, on garde `useUserMapOrigin(currentUser)`.

### Étape 5.3 - Géocoder la ville du filtre avec Geoapify

Le projet possède déjà un helper réutilisable dans `src/shared/utils/map/GeocodeGeoapify.tsx`.

L'idée n'est donc pas de créer une nouvelle logique de géocodage, mais de réutiliser `geocodeCity(...)` pour convertir la ville du filtre en coordonnées.

Comme `geocodeCity(...)` est asynchrone, il ne faut pas l'appeler directement dans le rendu React.

La bonne approche dans `Home.tsx` est de passer par React Query.

Exemple de logique attendue :

```ts
const {
	data: cityCoordinates,
	isLoading: isCityGeocoding,
	isError: isCityGeocodingError,
} = useQuery({
	queryKey: ["geocode-city", location.city.trim()],
	queryFn: () => geocodeCity(location.city.trim()),
	enabled: hasCityFilter,
});
```

Le résultat attendu :

1. `cityCoordinates` contient `lat` et `lon` si la ville est trouvée,
2. `cityCoordinates` vaut `null` ou `undefined` tant que rien d'exploitable n'est disponible,
3. `isCityGeocoding` permet de savoir qu'une résolution est en cours,
4. `isCityGeocodingError` permet de traiter explicitement l'échec technique du géocodage,
5. si aucune ville n'est trouvée, `cityCoordinates` vaut `null` sans forcément être une erreur HTTP.

Le helper front actuel doit être documenté ainsi :

```ts
export interface Coordinates {
	lat: number;
	lon: number;
}

type GeoapifyJsonResponse = {
	results: {
		lat: number;
		lon: number;
	}[];
};

type GeoapifyGeoJsonResponse = {
	features?: {
		geometry?: {
			coordinates?: [number, number];
		};
	}[];
};

export async function geocodeCity(city: string): Promise<Coordinates | null> {
	const normalizedCity = city.trim();

	if (!normalizedCity) return null;

	const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
	if (!apiKey) {
		throw new Error("La clé API Geoapify n'est pas définie dans .env (VITE_GEOAPIFY_API_KEY)");
	}

	const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(normalizedCity)}&lang=fr&limit=10&type=city&filter=countrycode:fr&format=json&apiKey=${apiKey}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Impossible de contacter le service de géocodage (${response.status}).`,
			);
		}

		const result = (await response.json()) as GeoapifyJsonResponse | GeoapifyGeoJsonResponse;
		const firstResult = "results" in result ? result.results?.[0] : undefined;

		if (firstResult) {
			return {
				lat: firstResult.lat,
				lon: firstResult.lon,
			};
		}

		const firstFeatureCoordinates =
			"features" in result ? result.features?.[0]?.geometry?.coordinates : undefined;

		if (firstFeatureCoordinates && firstFeatureCoordinates.length >= 2) {
			const [lon, lat] = firstFeatureCoordinates;

			return { lat, lon };
		}

		return null;
	} catch (error) {
		console.error("Erreur geocodeCity:", error);

		if (error instanceof Error) {
			throw error;
		}

		throw new Error("Impossible de géocoder la ville sélectionnée.");
	}
}
```

Les points importants ici sont :

1. on nettoie la saisie avec `trim()`,
2. on lit la clé front dans `import.meta.env.VITE_GEOAPIFY_API_KEY`,
3. on force `format=json` pour rester cohérent avec l'accès à `result.results`,
4. on garde un fallback de lecture si Geoapify renvoie une structure `features`,
5. on renvoie `null` quand la ville n'est simplement pas trouvée,
6. on lève une erreur seulement quand le service ou la configuration échoue vraiment.

### Étape 5.4 - Déterminer l'origine effective de la carte

Une fois les coordonnées de la ville disponibles, l'origine effective de la carte peut être pensée comme ceci :

```ts
const userOrigin = useUserMapOrigin(currentUser);
const effectiveOrigin = cityCoordinates ?? userOrigin;
```

Cette variable `effectiveOrigin` devient le vrai point d'entrée de toute la logique cartographique.

Concrètement :

1. le marqueur principal se place sur `effectiveOrigin`,
2. le cercle se dessine autour de `effectiveOrigin`,
3. le filtrage local des événements se fait à partir de `effectiveOrigin`.

### Étape 5.5 - Ce que la carte doit afficher visuellement

À cette étape, la carte doit afficher :

1. un marqueur d'origine,
2. un cercle semi-transparent de `mapRadiusMeters`,
3. les événements qui tombent dans ce cercle.

Le terme important ici est bien marqueur d'origine.

Quand une ville est saisie, ce marqueur représente la ville filtrée.

Quand aucune ville n'est saisie, ce marqueur représente le profil utilisateur.

---

## Étape 6 - Filtrer localement les événements à partir de cette origine

À ce stade, le filtrage local front est la bonne approche de transition.

Le flux logique devient :

1. récupérer les événements,
2. déterminer `effectiveOrigin`,
3. calculer la distance entre `effectiveOrigin` et chaque événement,
4. ne garder que ceux dont la distance est inférieure ou égale au rayon.

Point d'architecture important : à partir de cette étape, la ville saisie dans `FilterLocation` ne doit plus être envoyée dans `useGetEvents(filters)` pour filtrer la liste brute.

Cette ville sert uniquement à :

1. être géocodée,
2. produire `effectiveOrigin`,
3. devenir le centre du cercle.

Si on continue à transmettre `city` dans `EventFilters`, on réduit les événements trop tôt côté requête, avant même le calcul dans le cercle.

Concrètement, dans `Home.tsx`, le `useMemo<EventFilters>` doit rester limité aux filtres réellement appliqués avant la carte, par exemple :

```ts
const filters = useMemo<EventFilters>(() => {
	return {
		statuses: statuses.length > 0 ? statuses : undefined,
		start_date: filterDateValue.start ?? undefined,
		end_date: filterDateValue.end ?? undefined,
	};
}, [statuses, filterDateValue]);
```

La règle à retenir est donc simple :

1. `location.city` sert à trouver le centre,
2. `mapRadiusMeters` sert à déterminer le rayon,
3. `visibleEvents` est la seule vraie liste filtrée spatialement.

### Étape 6.1 - Vérifier que l'événement possède des coordonnées

Avant de calculer une distance, il faut exclure les événements sans coordonnées persistées.

Exemple :

```ts
const coords = event.address?.coordinates;

if (!coords) {
	return false;
}
```

### Étape 6.2 - Créer la méthode `haversineDistance`

Avant de filtrer les événements, il faut disposer d'une fonction utilitaire capable de calculer une distance entre deux points géographiques.

Le bon endroit pour cette méthode est [src/shared/components/UI/map/map-data.ts](src/shared/components/UI/map/map-data.ts), car ce fichier centralise déjà les types et les helpers de transformation utiles à la carte.

Exemple d'implémentation :

```ts
export function haversineDistance(origin: AddressCoordinates, target: AddressCoordinates): number {
	const earthRadiusKm = 6371;
	const deltaLat = toRadians(target.lat - origin.lat);
	const deltaLon = toRadians(target.lon - origin.lon);
	const originLat = toRadians(origin.lat);
	const targetLat = toRadians(target.lat);
	const a =
		Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
		Math.cos(originLat) * Math.cos(targetLat) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return earthRadiusKm * c;
}

function toRadians(value: number): number {
	return (value * Math.PI) / 180;
}
```

Cette méthode :

1. reçoit deux points `lat/lon`,
2. convertit les écarts angulaires en radians,
3. applique la formule de [Haversine](https://www.movable-type.co.uk/scripts/latlong.html)
4. renvoie une distance en kilomètres.

Le point important est le suivant : `mapRadiusMeters` est exprimé en mètres, alors que `haversineDistance(...)` renvoie des kilomètres.

Il faudra donc comparer `distanceKm` à `mapRadiusMeters / 1000`.

### Étape 6.3 - Calculer la distance par rapport à l'origine effective

L'exemple suivant montre bien la logique attendue :

```ts
const visibleEvents = events.filter((event) => {
	const coords = event.address?.coordinates;

	if (!coords || !effectiveOrigin) return false;

	const distanceKm = haversineDistance(
		{ lat: effectiveOrigin.lat, lon: effectiveOrigin.lon },
		{ lat: coords.lat, lon: coords.lon },
	);

	return distanceKm <= mapRadiusMeters / 1000;
});
```

Ce point est essentiel :

1. on ne compare plus toujours les événements au profil utilisateur,
2. on les compare à l'origine active,
3. cette origine active est la ville filtrée quand elle existe.

Dans l'implémentation de `Home.tsx`, il est préférable d'encapsuler ce calcul dans un `useMemo(...)` pour éviter de recalculer le filtre à chaque rendu sans raison.

Exemple cohérent avec l'étape 6 complète :

```ts
const visibleEvents = useMemo(() => {
	if (!effectiveOrigin) {
		return [];
	}

	return events.filter((event) => {
		const coords = event.address?.coordinates;

		if (!coords) {
			return false;
		}

		const distanceKm = haversineDistance(
			{ lat: effectiveOrigin.lat, lon: effectiveOrigin.lon },
			{ lat: coords.lat, lon: coords.lon },
		);

		return distanceKm <= mapRadiusMeters / 1000;
	});
}, [effectiveOrigin, events, mapRadiusMeters]);
```

L'utilisation concrète de `haversineDistance(...)` est donc la suivante :

1. on passe l'origine active comme premier argument,
2. on passe les coordonnées de l'événement comme second argument,
3. on récupère une distance en kilomètres,
4. on garde seulement les événements qui tombent dans le rayon.

### Étape 6.4 - Mapper ensuite uniquement les événements visibles pour la carte

Une fois le filtrage fait, le mapping carte doit s'appuyer sur `visibleEvents` et non sur la liste brute `events`.

Exemple :

```ts
const eventMapPoints = useMemo(() => toEventMapPoints(visibleEvents), [visibleEvents]);
```

Ainsi :

1. la liste affichée,
2. les marqueurs de la carte,
3. le contenu du cercle

reposent tous sur la même source de vérité.

---

### Étape 6.5 - Enfin alimenter la carte avec les événements visibles

Quatrième étape :

```ts
<UserEventsMap
	searchOrigin={effectiveOrigin}
	events={eventMapPoints}
	radiusMeters={mapRadiusMeters}
/>
```

---

## Étape 7 - États UI à prévoir pour cette logique

Avec cette nouvelle priorité donnée à la ville filtrée, les états UI à documenter deviennent :

1. chargement du profil utilisateur,
2. géocodage de la ville filtrée en cours,
3. ville filtrée introuvable,
4. adresse utilisateur absente quand aucune ville n'est saisie,
5. aucun événement dans le rayon,
6. événements visibles dans le rayon.

Exemples de messages cohérents :

1. Géocodage de la ville en cours.
2. Impossible de géocoder la ville sélectionnée.
3. Ville introuvable.
4. Adresse utilisateur introuvable.
5. Aucun événement trouvé dans un rayon de 5 km.

### Étape 7.1 - Ce que doit faire `Home.tsx`

Dans l'implémentation actuelle, `Home.tsx` reste le bon endroit pour agréger les différents états venant :

1. du hook événements,
2. du hook profil utilisateur,
3. du géocodage React Query,
4. du filtrage local par rayon.

Le rôle de `Home.tsx` est donc de produire :

1. un message bloquant pour la carte,
2. éventuellement un message d'avertissement non bloquant quand le fallback sur l'adresse utilisateur est utilisé,
3. un message pour la liste.

Dans le rendu, cela implique que la carte ne s'affiche que si :

1. les événements sont chargés,
2. le profil est chargé,
3. aucun état bloquant n'est actif,
4. `effectiveOrigin` existe.

Exemple minimal de logique centralisée :

```ts
const isCityNotFound =
	hasCityFilter && !isCityGeocoding && !isCityGeocodingError && cityCoordinates === null;

const mapStatusMessage = useMemo(() => {
	return buildMapStatusMessage({
		hasCityFilter,
		isCityGeocoding,
		isCityGeocodingError,
		isCityNotFound,
		isUserLoading,
		isUserError,
		userErrorMessage: userError?.message,
		hasUserOrigin: Boolean(userOrigin),
		hasEffectiveOrigin: Boolean(effectiveOrigin),
	});
}, [
	effectiveOrigin,
	hasCityFilter,
	isCityGeocoding,
	isCityGeocodingError,
	isCityNotFound,
	isUserError,
	isUserLoading,
	userError?.message,
	userOrigin,
]);

const mapWarningMessage = useMemo(() => {
	return buildMapWarningMessage({
		hasCityFilter,
		isCityGeocodingError,
		isCityNotFound,
		hasUserOrigin: Boolean(userOrigin),
	});
}, [hasCityFilter, isCityGeocodingError, isCityNotFound, userOrigin]);
```

Avec la version actuellement retenue de `mapUiMessages.ts`, la logique de message est la suivante :

```ts
export function buildMapStatusMessage(params: BuildMapStatusMessageParams): string | null {
	if (isUserLoading) {
		return "Chargement du profil utilisateur...";
	}

	if (params.isUserError) {
		return params.userErrorMessage ?? "Impossible de charger le profil utilisateur.";
	}

	if (params.isCityGeocoding && !params.hasEffectiveOrigin) {
		return "Géocodage de la ville en cours...";
	}

	if ((params.isCityGeocodingError || params.isCityNotFound) && !params.hasEffectiveOrigin) {
		return "Impossible de géocoder la ville sélectionnée.";
	}

	if (!params.hasCityFilter && !params.hasUserOrigin) {
		return "Adresse utilisateur introuvable.";
	}

	return null;
}

export function buildMapWarningMessage(params: BuildMapWarningMessageParams): string | null {
	if (!params.hasCityFilter) {
		return null;
	}

	if (params.isCityGeocodingError || params.isCityNotFound) {
		return params.hasUserOrigin
			? "Impossible de géocoder la ville sélectionnée. La carte reste centrée sur votre adresse."
			: "Impossible de géocoder la ville sélectionnée.";
	}

	return null;
}
```

Cette logique permet de garder une seule source de vérité pour l'état de la carte, tout en conservant le fallback sur `userOrigin` si cette adresse existe déjà.

### Étape 7.2 - Gérer aussi le message de liste

Une fois le message de carte défini, il est utile de produire un second message pour la liste afin de distinguer :

1. les erreurs de chargement,
2. les problèmes d'origine ou de géocodage,
3. le cas où aucun événement ne tombe dans le rayon.

Exemple :

```ts
const listStatusMessage = useMemo(() => {
	return buildListStatusMessage({
		isEventsLoading: isLoading,
		isEventsError: isError,
		eventsErrorMessage: error?.message,
		visibleEventsCount: visibleEvents.length,
		radiusMeters: mapRadiusMeters,
	});
}, [error?.message, isError, isLoading, mapRadiusMeters, visibleEvents.length]);
```

### Étape 7.3 - Rendu conditionnel recommandé

Le rendu devient ensuite beaucoup plus lisible :

```ts
{mapWarningMessage ? (
	<div>{mapWarningMessage}</div>
) : null}
```

Puis pour la carte :

```ts
{!isLoading && !isError && !mapStatusMessage && effectiveOrigin ? (
	<UserEventsMap
		searchOrigin={effectiveOrigin}
		events={eventMapPoints}
		radiusMeters={mapRadiusMeters}
	/>
) : mapStatusMessage ? (
	<div>{mapStatusMessage}</div>
) : null}
```

Puis pour la liste :

```ts
{listStatusMessage ? (
	<div>{listStatusMessage}</div>
) : (
	<ul>
		...
	</ul>
)}
```

Le cas important à bien distinguer est le suivant :

1. si une ville est saisie, l'erreur utile concerne cette ville,
2. si aucune ville n'est saisie, l'erreur utile concerne le profil utilisateur.

### Étape 7.4 - extraire cela dans un fichier séparé

`Home.tsx` commence à devenir trop chargé.

```text
src/shared/utils/map/mapUiMessages.ts
```

Ce module contient :

1. une fonction pour calculer `mapStatusMessage`,
2. une fonction pour calculer `listStatusMessage`,
3. éventuellement un petit type décrivant les états d'entrée.

Exemple :

```ts
type BuildMapStatusMessageParams = {
	hasCityFilter: boolean;
	isCityGeocoding: boolean;
	isCityGeocodingError: boolean;
	isCityNotFound: boolean;
	isUserLoading: boolean;
	isUserError: boolean;
	userErrorMessage?: string;
	hasUserOrigin: boolean;
	hasEffectiveOrigin: boolean;
};

type BuildMapWarningMessageParams = {
	hasCityFilter: boolean;
	isCityGeocodingError: boolean;
	isCityNotFound: boolean;
	hasUserOrigin: boolean;
};

export function buildMapStatusMessage(params: BuildMapStatusMessageParams): string | null {
	if (params.isUserLoading) {
		return "Chargement du profil utilisateur...";
	}

	if (params.isUserError) {
		return params.userErrorMessage ?? "Impossible de charger le profil utilisateur.";
	}

	if (params.isCityGeocoding && !params.hasEffectiveOrigin) {
		return "Géocodage de la ville en cours...";
	}

	if ((params.isCityGeocodingError || params.isCityNotFound) && !params.hasEffectiveOrigin) {
		return "Impossible de géocoder la ville sélectionnée.";
	}

	if (!params.hasCityFilter && !params.hasUserOrigin) {
		return "Adresse utilisateur introuvable.";
	}

	return null;
}

export function buildMapWarningMessage(params: BuildMapWarningMessageParams): string | null {
	if (!params.hasCityFilter) {
		return null;
	}

	if (params.isCityGeocodingError || params.isCityNotFound) {
		return params.hasUserOrigin
			? "Impossible de géocoder la ville sélectionnée. La carte reste centrée sur votre adresse."
			: "Impossible de géocoder la ville sélectionnée.";
	}

	return null;
}
```

Cette extraction a un avantage clair :

1. `Home.tsx` garde le pilotage des données,
2. la logique de messages devient testable et réutilisable,
3. le composant reste plus lisible.

En revanche, il vaut mieux éviter de déplacer trop tôt tout le rendu dans un composant séparé si la logique n'est pas encore stabilisée. À ce stade, extraire seulement les fonctions de message est le meilleur compromis.

---

## Étape 8 - Créer le fichier `GeocodeGeoapify.tsx`

Cette étape mérite d'être explicitée séparément, car elle porte toute la résolution de la ville saisie dans `FilterLocation`.

Le fichier à créer côté front est :

```text
src/shared/utils/map/GeocodeGeoapify.tsx
```

Son rôle est strictement limité à ceci :

1. recevoir une ville saisie par l'utilisateur,
2. interroger l'API Geoapify,
3. renvoyer `{ lat, lon }` si une ville est trouvée,
4. renvoyer `null` si aucune ville n'est trouvée,
5. lever une erreur seulement si la configuration ou l'appel réseau échoue.

Exemple complet cohérent avec l'implémentation actuelle :

```ts
export interface Coordinates {
	lat: number;
	lon: number;
}

type GeoapifyJsonResponse = {
	results: {
		lat: number;
		lon: number;
	}[];
};

type GeoapifyGeoJsonResponse = {
	features?: {
		geometry?: {
			coordinates?: [number, number];
		};
	}[];
};

export async function geocodeCity(city: string): Promise<Coordinates | null> {
	const normalizedCity = city.trim();

	if (!normalizedCity) return null;

	const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
	if (!apiKey) {
		throw new Error("La clé API Geoapify n'est pas définie dans .env (VITE_GEOAPIFY_API_KEY)");
	}

	const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(normalizedCity)}&lang=fr&limit=10&type=city&filter=countrycode:fr&format=json&apiKey=${apiKey}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(
				`Impossible de contacter le service de géocodage (${response.status}).`,
			);
		}

		const result = (await response.json()) as GeoapifyJsonResponse | GeoapifyGeoJsonResponse;
		const firstResult = "results" in result ? result.results?.[0] : undefined;

		if (firstResult) {
			return {
				lat: firstResult.lat,
				lon: firstResult.lon,
			};
		}

		const firstFeatureCoordinates =
			"features" in result ? result.features?.[0]?.geometry?.coordinates : undefined;

		if (firstFeatureCoordinates && firstFeatureCoordinates.length >= 2) {
			const [lon, lat] = firstFeatureCoordinates;

			return { lat, lon };
		}

		return null;
	} catch (error) {
		console.error("Erreur geocodeCity:", error);

		if (error instanceof Error) {
			throw error;
		}

		throw new Error("Impossible de géocoder la ville sélectionnée.");
	}
}
```

Ce fichier est important pour une raison simple : il évite de mélanger dans `Home.tsx` la logique d'interface et la logique d'appel API.

---

## Étape 9 - Utiliser `FilterDistance` pour modifier la taille du cercle

Maintenant que l'origine de recherche est gérée, l'étape suivante consiste à laisser l'utilisateur faire varier le rayon du cercle avec `FilterDistance`.

L'objectif de cette étape est simple :

1. manipuler une distance en kilomètres dans l'UI,
2. convertir cette distance en mètres pour Leaflet,
3. redessiner le cercle automatiquement,
4. recalculer la liste des événements visibles avec ce nouveau rayon.

Le composant déjà présent dans le projet est :

```text
src/shared/components/UI/filter/FilterDistance.tsx
```

Sa responsabilité est uniquement de remonter la distance choisie via `onChange(...)`.

Exemple cohérent avec le composant actuel :

```tsx
type FilterDistanceProps = {
	city: string;
	distanceKm: number;
	onChange: (distanceKm: number) => void;
};

export default function FilterDistance({ city, distanceKm, onChange }: FilterDistanceProps) {
	const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(Number(e.target.value));
	};

	return (
		<label>
			<span>
				Distance{" "}
				{city && (
					<>
						autour de <b>{city}</b>
					</>
				)}
			</span>
			<input
				type="range"
				min={0}
				max={100}
				step={25}
				value={distanceKm}
				onChange={handleDistanceChange}
			/>
		</label>
	);
}
```

Dans l'état actuel du code, cela donne les valeurs suivantes :

1. `0 km`,
2. `25 km`,
3. `50 km`,
4. `75 km`,
5. `100 km`.

### Étape 9.1 - Stocker la distance dans `Home.tsx`

La distance choisie doit vivre dans l'état local déjà utilisé avec la ville.

Exemple :

```ts
type LocationState = {
	city: string;
	distanceKm: number;
};

const [location, setLocation] = useState<LocationState>({
	city: "",
	distanceKm: 0,
});
```

Puis le branchement du composant devient :

```tsx
<FilterDistance
	city={location.city}
	distanceKm={location.distanceKm}
	onChange={(distanceKm) => {
		setLocation((prev) => ({ ...prev, distanceKm }));
	}}
/>
```

De cette manière :

1. le slider lit la valeur actuelle,
2. `Home.tsx` reste la source de vérité,
3. toute la logique carte/liste peut se brancher sur `location.distanceKm`.

### Étape 9.2 - Convertir les kilomètres en mètres pour la carte

Leaflet attend un rayon en mètres pour le composant `Circle`.

Il faut donc dériver une valeur `mapRadiusMeters` à partir de `location.distanceKm`.

Exemple cohérent avec l'implémentation actuelle :

```ts
const mapRadiusMeters = location.distanceKm > 0 ? location.distanceKm * 1000 : 5_000;
```

Cette formule signifie :

1. si l'utilisateur choisit `25`, le rayon vaut `25_000` mètres,
2. si l'utilisateur choisit `100`, le rayon vaut `100_000` mètres,
3. si la valeur reste à `0`, l'application garde pour l'instant un rayon par défaut de `5 km`.

Point important : avec cette version, `0` n'est pas encore un vrai cercle de `0 km`, mais un état initial qui conserve le comportement par défaut à `5 km`.

Si plus tard vous voulez qu'une sélection à `0` signifie réellement "ne rien afficher au-delà du point d'origine", il faudra alors changer cette formule.

### Étape 9.3 - Utiliser ce rayon pour la carte

Une fois `mapRadiusMeters` calculé, la carte l'utilise directement :

```tsx
<UserEventsMap
	searchOrigin={effectiveOrigin}
	events={eventMapPoints}
	radiusMeters={mapRadiusMeters}
/>
```

Le cercle Leaflet s'adapte alors automatiquement à la distance choisie.

### Étape 9.4 - Utiliser le même rayon pour filtrer les événements

La carte et la liste doivent rester synchronisées.

Le même `mapRadiusMeters` doit donc être réutilisé dans le filtre local :

```ts
const visibleEvents = useMemo(() => {
	if (!effectiveOrigin) {
		return [];
	}

	return events.filter((event) => {
		const coords = event.address?.coordinates;

		if (!coords) {
			return false;
		}

		const distanceKm = haversineDistance(
			{ lat: effectiveOrigin.lat, lon: effectiveOrigin.lon },
			{ lat: coords.lat, lon: coords.lon },
		);

		return distanceKm <= mapRadiusMeters / 1000;
	});
}, [effectiveOrigin, events, mapRadiusMeters]);
```

Le bénéfice est immédiat :

1. quand le slider change, le cercle change,
2. les marqueurs visibles changent,
3. la liste des événements change,
4. tout repose sur une seule variable de rayon.

### Étape 9.5 - Résultat attendu de cette étape

À la fin de cette étape, le comportement attendu est le suivant :

1. l'utilisateur choisit une ville,
2. l'utilisateur ajuste la distance avec `FilterDistance`,
3. le cercle s'agrandit ou se réduit entre `0` et `100 km` dans l'UI,
4. l'application convertit cette valeur en mètres,
5. la carte et la liste se recalent ensemble sur ce rayon.

---

## Étape 10 - Ajouter un bouton pour afficher ou masquer la carte

À cette étape, l'objectif n'est plus de changer le calcul du cercle, mais de changer l'expérience utilisateur dans `Home.tsx`.

Le comportement attendu devient :

1. la carte est cachée par défaut,
2. la carte peut rester fermée sans désactiver les filtres spatiaux,
3. un bouton `Carte` permet d'ouvrir la carte,
4. quand la carte est ouverte, elle affiche `visibleEvents`,
5. la liste continue d'utiliser les mêmes règles de filtrage, que la carte soit ouverte ou non.

### Étape 10.1 - Ajouter un état local pour piloter l'affichage de la carte

Dans `Home.tsx`, il faut introduire un booléen dédié.

Exemple :

```ts
const [isMapVisible, setIsMapVisible] = useState(false);
```

Le choix de `false` comme valeur initiale permet de respecter le besoin métier : la carte ne s'affiche pas dès le chargement initial.

### Étape 10.2 - Ajouter un bouton `Carte` dans le formulaire avant le bouton reset

Le bouton doit être placé avant le bouton reset, dans le même formulaire.

Exemple de structure attendue :

```tsx
<label className="flex flex-col items-start">
	<span className="label text-xs">Carte</span>
	<button
		type="button"
		className="btn"
		onClick={() => setIsMapVisible((prev) => !prev)}
	>
		{isMapVisible ? "Masquer" : "Afficher"}
	</button>
</label>

<label className="flex flex-col items-start">
	<span className="label text-xs">Reset</span>
	<input className="btn btn-square" type="reset" value="x" />
</label>
```

Ici :

1. `type="button"` évite de déclencher le reset du formulaire,
2. le libellé change selon l'état,
3. le bouton reste proche des autres filtres.

### Étape 10.3 - Séparer visibilité de la carte et filtre spatial

Le point important est le suivant : fermer la carte ne doit pas couper le filtre par ville ou distance.

Il faut donc distinguer deux notions :

1. `isMapVisible` contrôle uniquement l'affichage de la carte,
2. `isSpatialFilterActive` contrôle si la liste doit être réduite à l'intérieur du cercle.

Exemple cohérent avec la logique actuelle :

```ts
const isSpatialFilterActive = hasCityFilter || location.distanceKm > 0;
const displayedEvents = isSpatialFilterActive ? visibleEvents : events;
```

Cela permet de garder une logique lisible :

1. `events` reste la liste brute,
2. `visibleEvents` reste la liste filtrée par cercle,
3. `displayedEvents` devient la vraie source de rendu pour la liste,
4. la fermeture de la carte ne casse plus les filtres spatiaux.

### Étape 10.4 - N'afficher la carte que si le bouton est actif

Le rendu conditionnel de la carte doit maintenant intégrer `isMapVisible`.

Exemple :

```tsx
{
	isMapVisible && !isLoading && !isError && !mapStatusMessage && effectiveOrigin ? (
		<UserEventsMap
			searchOrigin={effectiveOrigin}
			events={eventMapPoints}
			radiusMeters={mapRadiusMeters}
		/>
	) : isMapVisible && mapStatusMessage ? (
		<div>{mapStatusMessage}</div>
	) : null;
}
```

Cette condition est importante :

1. tant que la carte est fermée, aucun message lié à la carte n'a besoin de s'afficher,
2. dès qu'on ouvre la carte, on réactive le flux normal des messages et du rendu cartographique.

### Étape 10.5 - Utiliser `displayedEvents` dans la liste

Le rendu de la liste doit ensuite s'appuyer sur `displayedEvents` au lieu de `visibleEvents` directement.

Exemple :

```tsx
<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	{displayedEvents.map((event) => (
		<li key={event.id} className="border rounded p-4">
			<div className="font-bold text-lg mb-1">{event.title}</div>
			<div className="text-sm text-gray-500 mb-2">
				{event.address?.city ?? "Adresse indisponible"} — {event.status}
			</div>
			<div className="mb-2">{event.description}</div>
			<div className="text-xs text-gray-400">
				{event.start_date.toLocaleDateString()} — {event.end_date.toLocaleDateString()}
			</div>
		</li>
	))}
</ul>
```

Ainsi :

1. la page reste utile même sans ouvrir la carte,
2. si aucun filtre spatial n'est actif, la liste affiche tous les événements,
3. si une ville ou une distance est saisie, la liste se réduit même si la carte reste fermée,
4. l'ouverture de la carte ajoute uniquement la visualisation cartographique.

### Étape 10.6 - Adapter le message de liste à ce nouveau comportement

Le message de liste ne doit plus dépendre directement de `isMapVisible`.

Il faut donc prévoir la logique suivante :

1. si aucun filtre spatial n'est actif, la liste se base sur `events`,
2. si un filtre spatial est actif, la liste se base sur `visibleEvents`,
3. le message `Aucun événement trouvé dans un rayon de ...` ne doit apparaître que quand un filtre spatial est actif.

Autrement dit, `buildListStatusMessage(...)` doit recevoir une information décrivant l'activation du filtre spatial, pas seulement la visibilité de la carte.

Exemple cohérent avec l'état actuel du code :

```ts
return buildListStatusMessage({
	isEventsLoading: isLoading,
	isEventsError: isError,
	eventsErrorMessage: error?.message,
	displayedEventsCount: displayedEvents.length,
	radiusMeters: mapRadiusMeters,
	showRadiusEmptyMessage: isSpatialFilterActive,
});
```

### Étape 10.7 - Résultat attendu de cette étape

À la fin de cette étape, le comportement cible est :

1. la page charge avec la liste complète des événements si aucun filtre spatial n'est actif,
2. la carte n'est pas visible au départ,
3. si l'utilisateur saisit une ville ou modifie la distance, la liste est déjà filtrée,
4. l'utilisateur clique sur le bouton `Carte` s'il veut voir le cercle et les marqueurs,
5. la carte apparaît avec l'origine, le cercle et `visibleEvents`,
6. la liste reste cohérente avec le même sous-ensemble d'événements.

---

## Étape 11 - Contrat logique recommandé pour cette phase

Pour cette étape de transition, le contrat utile n'est pas encore un contrat back final.

Le plus utile est de poser un petit contrat front explicite pour l'origine active :

```ts
type MapSearchOrigin = {
	lat: number;
	lon: number;
	source: "profile" | "city-filter";
};
```

Ce type n'est pas obligatoire immédiatement dans le code, mais il clarifie bien la logique fonctionnelle :

1. une origine possède toujours `lat` et `lon`,
2. elle peut venir soit du profil, soit de la ville filtrée,
3. le reste de la carte consomme ensuite cette origine sans se soucier de sa provenance.

Pour les marqueurs événements, le contrat actuel peut rester simple :

```ts
type EventMapMarker = {
	id: number;
	title: string;
	lat: number;
	lon: number;
};
```

---

## Étape 12 - Ce qu'il faudra envoyer plus tard au back

Une fois la logique UI validée, le back pourra recevoir directement le point géocodé et le rayon.

Exemple cible :

```ts
{
	latitude: effectiveOrigin.lat,
	longitude: effectiveOrigin.lon,
	distanceKm: mapRadiusMeters / 1000,
}
```

Mais pour l'instant, ce n'est pas la première étape.

La première étape est bien :

1. utiliser la ville du filtre comme origine quand elle existe,
2. garder 5 km par défaut,
3. filtrer localement la liste et la carte à partir de cette origine,
4. laisser l'utilisateur ouvrir la carte seulement lorsqu'il en a besoin.

## Conclusion

Pour votre besoin actuel, la bonne séquence n'est pas de repartir d'une architecture trop large.

La bonne séquence est :

1. l'utilisateur saisit une ville dans `FilterLocation`,
2. cette ville est géocodée via `geocodeCity(...)`,
3. ses coordonnées remplacent l'origine issue du profil,
4. l'utilisateur ajuste ensuite la distance avec `FilterDistance`,
5. le rayon vaut `5_000` par défaut tant qu'aucune distance n'est choisie,
6. les événements sont filtrés localement à partir de cette origine et de ce rayon,
7. la carte et la liste affichent le même sous-ensemble d'événements.

Cette version du flux est la plus cohérente avec votre besoin immédiat et prépare proprement le futur passage au filtrage back.

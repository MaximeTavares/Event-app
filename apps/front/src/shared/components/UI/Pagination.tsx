import Button from './Button';

// Voir la documentation src/docs/create-pagination-generic.md
type PaginationProps = {
	currentPage?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
	className?: string;
};

/**
 * Affiche une pagination générique pilotée par le composant parent.
 *
 * Utilisation : la page parente conserve currentPage et totalPages,
 * puis passe une fonction onPageChange pour relancer la requete avec
 * les bons paramètres page et limit.
 */
export default function Pagination({
	currentPage = 1,
	totalPages = 1,
	onPageChange,
	className = '',
}: PaginationProps) {
	const canPaginate = Boolean(onPageChange) && totalPages > 1;

	return (
		<div
			className={`flex flex-wrap items-center justify-center gap-3 ${className}`.trim()}
		>
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

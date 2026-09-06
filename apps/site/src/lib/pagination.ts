/** Items per page for writing and selected work lists. */
export const PAGE_SIZE = 10;

export function pageCount(total: number, pageSize = PAGE_SIZE): number {
	return Math.max(1, Math.ceil(Math.max(0, total) / pageSize));
}

/** Pagination controls stay disabled until the list exceeds one page. */
export function paginationEnabled(total: number, pageSize = PAGE_SIZE): boolean {
	return total > pageSize;
}

export function clampPage(page: number, totalPages: number): number {
	if (!Number.isFinite(page) || page < 1) return 1;
	return Math.min(Math.floor(page), Math.max(1, totalPages));
}

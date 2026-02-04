export function getLastUpdatedFromUpdates(
    updates?: Date[] | null,
): Date | undefined {
    if (!updates || updates.length === 0) {
        return undefined;
    }

    return updates.reduce((latest, update) => {
        if (update.getTime() > latest.getTime()) {
            return update;
        }

        return latest;
    }, updates[0]);
}

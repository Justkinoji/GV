export enum Rating {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5
}

export const ratingValues = Object.values(Rating).filter(value => typeof value === 'number') as number[];

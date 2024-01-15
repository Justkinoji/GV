interface AchievementInput {
    name: string,
    image: string,
    description: string,
    criteria: {
        field: string,
        count: number
    }[],
    bonusPoints: number
}

export { AchievementInput };
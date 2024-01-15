export const webStatsTypeDefs = `
type PercentStatistic {
    total: Int!
    percent: Int!
}

type SectionStatistic {
    name: String!
    total: Int!
}

type WebSiteStatisticResponse {
    buyers: PercentStatistic!
    sellers: PercentStatistic!
    offers: PercentStatistic!
    sells: [SectionStatistic!]
}

type Query {
    getWebSiteStatistic: WebSiteStatisticResponse
}
`
;

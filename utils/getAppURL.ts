export const getAppURL = async(): Promise<string> => {

    return process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'defaultProductionURL'
        : process.env.LOCALHOST_URL || 'defaultTestURL';
}
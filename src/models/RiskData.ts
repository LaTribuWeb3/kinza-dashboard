export interface KinzaRiskParameters {
    [symbol: string]: {
        [quote: string]: KinzaRiskParameter;
    };
}

export interface KinzaRiskParameter {
    ltv: number;
    bonus: number;
    visible: true;
}
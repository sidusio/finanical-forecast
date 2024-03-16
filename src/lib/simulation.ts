/**
 * Assumptions
 * - The interest rate is constant
 * - The yearly savings is constant, and is added gradually throughout the year
 * - The tax is constant
 * - The tax is paid yearly
 *
 */

export interface YearState {
	year: number;
	iskSavings: number;
	compoundedInflation: number;
	cashFlow: number;
	//incomePensionRights: number;
	//premiumPensionRights: number;
	//servicePensionSavings: number;
}

export interface Parameters {
	inflationRate: number;
	iskInterestRate: number;
	iskTax: number;
	cashFlows: TimeBoundCashFlow[];
}

export interface TimeBoundCashFlow {
	startYear: number; // Inclusive
	endYear: number; // Exclusive
	yearlyNetCashFlow: number;
	//publicPensionContributing: boolean;
	//servicePensionContribution: number;
}

export interface Scenario {
	parameters: Parameters;
	startState: YearState;
	endYear: number;
}

export function defaultScenario(): Scenario {
	const currentYear = new Date().getFullYear();
	return {
		parameters: {
			inflationRate: 0.025,
			iskInterestRate: 0.08,
			iskTax: 0.01086,
			cashFlows: [
				{
					startYear: currentYear,
					endYear: currentYear + 8,
					yearlyNetCashFlow: 38500 * 12
					// publicPensionContributing: true,
					// servicePensionContribution: 4.5
				},
				{
					startYear: currentYear,
					endYear: currentYear + 8,
					yearlyNetCashFlow: 2755 * 12
					// publicPensionContributing: false,
					// servicePensionContribution: 100
				},
				{
					startYear: currentYear,
					endYear: currentYear + 8,
					yearlyNetCashFlow: -2755 * 12
					// publicPensionContributing: false,
					// servicePensionContribution: 0
				},
				{
					startYear: currentYear,
					endYear: currentYear + 50,
					yearlyNetCashFlow: -15000 * 12
					// pensionContributing: false,
					// publicPensionContributing: false,
					// servicePensionContribution: 0
				}
			]
		},
		startState: {
			year: currentYear,
			iskSavings: 1000000,
			compoundedInflation: 1,
			cashFlow: 0
		},
		endYear: 2100
	};
}

function simulateYear(state: YearState, params: Parameters): YearState {
	const newYear = state.year + 1;

	const compoundedInflation = state.compoundedInflation * (1 + params.inflationRate);
	const compoundedInflationYearlyAverage =
		state.compoundedInflation * (1 + params.inflationRate / 2);

	const yearlyCashFlows = params.cashFlows.filter(
		(cf) => cf.startYear <= newYear && cf.endYear > newYear
	);
	const yearlyCashFlow = yearlyCashFlows.reduce((acc, cf) => acc + cf.yearlyNetCashFlow, 0);
	const yearlyCashFlowPostInflation = yearlyCashFlow * compoundedInflationYearlyAverage;

	// const publicPensionContributingCashFlows = yearlyCashFlows.filter(cf => cf.publicPensionContributing);
	// const publicPensionContributingCashFlow = publicPensionContributingCashFlows.reduce((acc, cf) => acc + cf.yearlyNetCashFlow, 0);

	// const yearlyIncomePensionRights = publicPensionContributingCashFlow * 0.16; // TODO: This should be calculated
	// const yearlyPremiumPensionRights = publicPensionContributingCashFlow * 0.025;

	const iskSavingsYearlyAverage = state.iskSavings + yearlyCashFlowPostInflation / 2;
	const iskInterest = iskSavingsYearlyAverage * params.iskInterestRate;
	const iskTax = iskSavingsYearlyAverage * params.iskTax;
	const newSavings = state.iskSavings + yearlyCashFlowPostInflation + iskInterest - iskTax;

	return {
		year: state.year + 1,
		iskSavings: Math.floor(newSavings),
		compoundedInflation: compoundedInflation,
		cashFlow: yearlyCashFlow
		// premiumPensionRights: state.premiumPensionRights,
		// servicePensionSavings: state.servicePensionSavings,
	};
}

export function simulate({ endYear, startState, parameters }: Scenario): YearState[] {
	const results = [startState];
	for (let i = 0; i + startState.year < endYear; i++) {
		const newState = simulateYear(results[i], parameters);
		results.push(newState);
	}
	return results;
}

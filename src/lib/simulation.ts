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

export function simulateYears(years: number, state: YearState, params: Parameters): YearState[] {
	const results = [state];
	for (let i = 0; i < years; i++) {
		const newState = simulateYear(results[i], params);
		results.push(newState);
	}
	return results;
}

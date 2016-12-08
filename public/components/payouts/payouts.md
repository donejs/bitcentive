@parent bitcentive
@module {can.Component} bitcentive/components/payouts <bit-payouts>

Displays a table of payout amounts for the current month, by contributor.

@signature `<bit-payouts contribution-month="{ ContributionMonth }">`

@body
The component will request all contribution months previous to the "current contributionMonth" (assigned as an attribute) and run calculate and display payout amounts for each contributor.

## Use
```
<bit-payouts {contribution-month}="selectedContributionMonth" />
```

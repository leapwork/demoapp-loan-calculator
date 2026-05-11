# LeapTrust Bank Loan Calculator Demo App

LeapTrust Bank is a frontend-only loan calculator demo built by Leapwork for practicing test automation on realistic banking and lending workflows.

The app includes product selection, a mortgage calculator, a car loan calculator, progressive disclosure for advanced loan details, payment estimates, validation, disabled estimate states, and prequalification placeholder modals that appear after a valid estimate.

## Hosted Demo

Try the hosted app:

[https://demoapps.leapwork.ai/loancalculator/](https://demoapps.leapwork.ai/loancalculator/)

Leapwork's full demo app catalog is available at:

[https://demoapps.leapwork.ai/](https://demoapps.leapwork.ai/)

The catalog also provides supporting materials such as requirements PDFs and Gherkin test cases in Markdown format.

## Test Automation Practice

Useful test scenarios include product selection, calculator navigation, required field validation, mortgage minimum down payment handling, mortgage down payment auto-fill and auto-correction, estimated mortgage rate updates based on credit score, car-loan slider behavior, credit-score-driven APR changes, advanced options, loan term changes, tax and insurance adjustments, PMI warning behavior, monthly payment calculations, disabled and enabled call-to-action states, prequalification modal behavior, and responsive layout checks.

## Application Type

This is a static frontend application built with plain HTML, CSS, and JavaScript. There is no backend, database, API, framework build step, or real payment processing.

## Local Preview

Open `index.html` directly in a browser:

```text
index.html
```

No local server is required.

## Demo Data

The app does not use demo user accounts. Testers enter loan details directly in the calculators.

Example mortgage values:

| Home price | Down payment | Credit score | Term | Notes |
| --- | --- | --- | --- | --- |
| `$425,000` | `$85,000` | `Excellent (740+)` | `30 years` | Valid estimate with a stronger rate |
| `$425,000` | `$42,500` | `Good (700-739)` | `30 years` | Valid estimate with PMI warning |
| `$425,000` | _leave blank initially_ | `Average (660-699)` | `30 years` | Entering the home price can seed the 5% minimum down payment |

Example car loan values:

| Vehicle price | Down payment | Trade-in value | Credit score | Term | Notes |
| --- | --- | --- | --- | --- | --- |
| `$20,000` | `$1,000` | `$0` | `Excellent (720-850)` | `72 months` | Default valid estimate |
| `$36,500` | `$5,500` | `$2,000` | `Good (660-719)` | `60 months` | Valid estimate with updated APR |
| `$79,000` | `$1,000` | `$0` | `Good (660-719)` | `72 months` | Useful for exercising the full slider range and higher fee bracket |

## Supporting Materials

Sample requirements PDFs and Gherkin test cases are available through the Leapwork demo apps site:

[https://demoapps.leapwork.ai/](https://demoapps.leapwork.ai/)

Detailed requirements for this app are available in `REQUIREMENTS.md`.

## Important Notes

- This is a demo app, not a production banking or lending system.
- Data is simulated and stored only in the browser session.
- Prequalify and Apply now do not submit a real application or call external services.
- Estimates are illustrative and do not include all real-world lending costs.

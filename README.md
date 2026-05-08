# LeapTrust Bank Mortgage Calculator Demo App

LeapTrust Bank is a frontend-only loan calculator demo built by Leapwork for practicing test automation on realistic banking and lending workflows.

The app includes product selection, a mortgage calculator, a car loan calculator, progressive disclosure for advanced loan details, payment estimates, validation, disabled estimate states, and an Apply now button that becomes available after a valid estimate.

## Hosted Demo

Try the hosted app:

[https://demoapps.leapwork.ai/loancalculator/](https://demoapps.leapwork.ai/loancalculator/)

Leapwork's full demo app catalog is available at:

[https://demoapps.leapwork.ai/](https://demoapps.leapwork.ai/)

The catalog also provides supporting materials such as requirements PDFs and Gherkin test cases in Markdown format.

## Test Automation Practice

Useful test scenarios include product selection, calculator navigation, required field validation, minimum down payment handling, mortgage down payment auto-correction, advanced options, loan term changes, tax and insurance adjustments, PMI warning behavior, monthly payment calculations, disabled and enabled Apply now states, and responsive layout checks.

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

| Home price | Down payment | Interest rate | Term | Notes |
| --- | --- | --- | --- | --- |
| `$425,000` | `$85,000` | `6.75%` | `30 years` | Valid estimate with 20% down |
| `$425,000` | `$42,500` | `6.75%` | `30 years` | Valid estimate with PMI warning |
| `$425,000` | `$10,000` | `6.75%` | `30 years` | Down payment is corrected to the 5% minimum on blur |

Example car loan values:

| Vehicle price | Down payment | Interest rate | Term | Notes |
| --- | --- | --- | --- | --- |
| `$36,500` | `$5,500` | `7.49%` | `60 months` | Valid estimate |
| `$36,500` | `$1,000` | `7.49%` | `60 months` | Invalid down payment |
| `$36,500` | `$5,500` | `7.49%` | `72 months` | Shows long-term notice |

## Supporting Materials

Sample requirements PDFs and Gherkin test cases are available through the Leapwork demo apps site:

[https://demoapps.leapwork.ai/](https://demoapps.leapwork.ai/)

Detailed requirements for this app are available in `REQUIREMENTS.md`.

## Important Notes

- This is a demo app, not a production banking or lending system.
- Data is simulated and stored only in the browser session.
- Apply now does not submit a real application or call external services.
- Estimates are illustrative and do not include all real-world lending costs.
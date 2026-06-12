
Last update on: 01/01/2026

## 1. Objective and Economic Interest

Plakar SAS is dedicated to developing a secure, open-source, and highly versatile data resilience ecosystem. This program is designed to incentivize the global development and security community to actively contribute to the Plakar ecosystem. By rewarding targeted feature implementations and high-impact vulnerability discoveries, we aim to accelerate our roadmap and maintain world-class security standards.

The economic and strategic interests of this program include:

* **Accelerating Feature Innovation:** Expanding Plakar utility by encouraging the community to build specific capabilities and integration packages.
* **Optimizing Engineering Costs:** Leveraging global developer talent to scale development efficiently across our public open-source repositories and related dependencies.
* **Enhancing Security and Resilience:** Identifying and resolving software vulnerabilities proactively before they can affect our users.
* **Community Enrichment:** Building a highly engaged ecosystem of open-source contributors, independent developers, and security researchers.

## 2. Technical Scope and Eligibility Rules

This program is open to individuals and legal entities worldwide, with the strict exception of individuals residing in, or legal entities established in, countries or territories subject to European Union (EU) or French economic sanctions, trade embargoes, or comprehensive financial restrictions. Furthermore, any individual or entity listed on official EU or French asset-freeze and international sanctions registries is strictly ineligible to participate or receive financial rewards.

### Program Exclusions

Employees of Plakar SAS, as well as freelancers, independent contractors, or consultants currently under active contract or agreement with Plakar SAS, are strictly excluded from participating in this program and are not eligible to receive any financial rewards or public recognition under this policy.

### Reward Eligibility Rules

* **Security Scope:** Financial rewards are strictly limited to vulnerabilities classified as Critical or High based on standard metrics. Lower severity findings (Medium or Low) do not qualify for financial payouts but receive public recognition and thanks.
* **Features and Integrations Scope:** Financial rewards are strictly limited to the specific development tasks, features, and integration packages listed in the official Plakar Bounty Roadmap on our website ([the Bounty Roadmap][bounty-roadmap]). Unlisted feature suggestions do not qualify for financial payouts.
* **Upstream and Downstream Projects:** Certain development tasks targeting approved upstream or downstream open-source projects are eligible for rewards, provided they are explicitly framed and listed within the official Bounty Roadmap on our website ([the Bounty Roadmap][bounty-roadmap]).
* **Precedence of the Official Roadmap:** The official Bounty Roadmap on the Plakar website ([the Bounty Roadmap][bounty-roadmap]) takes precedence and dictates the definitive payout amounts if any discrepancy arises with the general ranges announced in this policy.
* **Licensing Requirement:** All contributions (including source code, documentation, and integration packages) must be submitted under the same open-source license as the respective target Plakar repository. By participating in this program, contributors explicitly agree to license their work under these terms.

### Safe Harbor (Legal Sanctuary)

Plakar SAS values the work of security researchers who help protect our users. If you conduct your security research and vulnerability disclosure activities in strict accordance with the rules, scope, and restrictions outlined in this policy, Plakar SAS considers your research to be authorized.

Plakar SAS formally commits not to initiate legal actions, civil lawsuits, or criminal complaints against you regarding your research. This safe harbor explicitly covers potential claims under French penal code provisions regarding fraudulent access, tampering, or remaining within an automated data processing system.

### General Participation Criteria

* Participants must act in good faith and follow responsible disclosure practices.
* Feature contributions must align with Plakar architectural guidelines and pass code quality reviews.
* For security vulnerabilities, public disclosure without explicit prior authorization from Plakar SAS is strictly prohibited and results in immediate disqualification.

## 3. Submission and Evaluation Procedure

To maintain transparency and satisfy corporate accounting requirements under French law, all submissions must follow a structured validation workflow.

### For Feature Contributions and Integrations

1. **Notification (Optional):** Before developing major features or integrations, contributors may notify the team by sending a brief functional outline or issue draft to bounty@plakar.io to check roadmap alignment. Plakar SAS does not guarantee exclusivity, and multiple participants may work on the same task independently.
2. **Implementation:** Submit a Pull Request (PR) to the relevant public repository, referencing the specific targeted item from the Bounty Roadmap available on our website ([the Bounty Roadmap][bounty-roadmap]).
3. **Review and Merge:** The Plakar maintainer team will review the code.
4. **Claiming the Reward (Claim):** Once the PR is approved and merged, the contributor must explicitly claim their bounty by sending an email to bounty@plakar.io. The reward is strictly attributed to the first valid, complete, and merged Pull Request.

### For Bug and Vulnerability Reports

1. **Reporting:** Send a detailed description along with reproduction steps securely via email to both security@plakar.io and bounty@plakar.io.
2. **Triage:** The engineering team will assess the impact and verify if the vulnerability meets the Critical or High classification criteria within five business days.

### Corporate Record Keeping

Plakar SAS permanently retains all technical exchanges, feature specifications, vulnerability reports, and reward decisions. Under French legal frameworks, this documentation is mandatory to justify corporate expenses and confirm the reality of the services delivered to the company.

## 4. Reward Scales

Rewards are separated into two distinct grids based on the contribution type. The official Bounty Roadmap on the Plakar website ([the Bounty Roadmap][bounty-roadmap]) remains the final authority for specific task pricing.

### Security Vulnerability Rewards

Security vulnerabilities are evaluated and classified objectively according to the Common Vulnerability Scoring System (CVSS v3/v4) standard metrics. Only vulnerabilities meeting the Critical or High thresholds are eligible for financial compensation.

| Severity Level | Technical Description & CVSS Metrics | Reward Range |
| :--- | :--- | :--- |
| **Critical** | CVSS Score: 9.0 to 10.0. Vulnerabilities causing unauthorized data decryption, absolute data loss, or remote code execution. | €1,000 to €2,500+ |
| **High** | CVSS Score: 7.0 to 8.9. Flaws in immutability logic, deduplication bypasses, or broken access controls. | €500 to €1,000 |
| **Medium** | CVSS Score: 4.0 to 6.9. Logic errors under specific edge cases or minor data exposure risks. | Recognition & Public Thanks |
| **Low** | CVSS Score: 0.1 to 3.9. Minor display anomalies, cosmetic UI bugs, or low-risk validation omissions. | Recognition & Public Thanks |

### Feature and Integration Rewards

Only development tasks explicitly listed in our official Bounty Roadmap on the Plakar website ([the Bounty Roadmap][bounty-roadmap]) are eligible for financial rewards.

| Contribution Type | Technical Description | Reward Range |
| :--- | :--- | :--- |
| **Integration** | Development of a full, turnkey Integration Package (providing source, destination, storage connectors) for an enterprise system listed on the Plakar website ([the Bounty Roadmap][bounty-roadmap]). | €500 to €1,000 (depending on difficulty) |
| **Feature** | Implementation of architectural components, performance optimizations, or functional tools listed on the Plakar website (including listed upstream/downstream project developments). | €250 to €500 (depending on difficulty) |

## 5. Invoicing, Payout, and Tax Compliance

All financial rewards are processed and paid from France by Plakar SAS. Payout workflows depend strictly on the legal and tax status of the beneficiary.

### General Payout Conditions

* **Payment Timeframe:** Validated rewards will be executed via bank wire transfer within 30 days following the formal approval and validation of the commercial invoice or the individual signed certificate.
* **Transfer Fees:** Plakar SAS will absorb all standard bank wire transfer fees associated with processing and issuing the bounty payout.

### For Registered Businesses and Freelancers

If you participate as a company, sole trader, or registered freelancer, you must issue a valid commercial invoice before payment can be executed.

* **Invoice Details:** Invoices must be addressed to Plakar SAS (149 avenue du Maine, 75014 Paris, France, RCS Paris 933 509 754).
* **Value Added Tax (VAT):**
    * French entities must include the standard French VAT.
    * European Union entities (outside France) must utilize the reverse charge mechanism and display their intra-community VAT number.
    * International entities outside the European Union must invoice without VAT, in compliance with applicable export regulations.

### For Private Individuals

If you participate as an individual contributor without a registered business, the payout is processed under non-commercial corporate expense guidelines.

* **Accounting Treatment:** The payout is handled as a gross corporate charge (TTC). Plakar SAS cannot deduct or recover VAT on this transaction.
* **Mandatory Certificate (Attestation):** To receive the bounty payout, individual contributors must provide a signed certificate. The template provided in Appendix A must be fully completed and signed. No funds will be wired without this valid document.
* **Tax Responsibility:** This reward constitutes taxable income for the recipient. The beneficiary is explicitly informed that they are solely responsible for declaring this income to their local tax authorities. Plakar SAS will issue a payment confirmation document upon request to support individual tax declarations.

---

## Appendix A: Honor Certificate Template for Individuals

Please send this completed and signed document to accounting@plakar.io with a copy to bounty@plakar.io when claiming your reward.

**Subject: Statement of Honor regarding the Plakar Bounty Program Payout**

I, the undersigned:
* **Full Name:** [Your first and last name]
* **Date of Birth:** [DD/MM/YYYY]
* **Primary Tax Residence Address:** [Your full address, Postal Code, City, Country]
* **Contact Email Address:** [Your email address]

Directly concerning the following contribution:
* **Reward Object / Contribution Reference:** [Specify the merged Pull Request URL, the internal bounty entry URL on the Plakar website (for example [the Bounty Roadmap][bounty-roadmap] with the relevant item or anchor), or a validated Vulnerability ID]
* **Approved Reward Amount:** [Specify the exact amount, e.g., €500]

Declares on my honor the following statements:
1. I am participating in the Plakar SAS bounty program as a private individual (natural person) and not under any registered professional structure or commercial enterprise.
2. I certify that I do not hold any VAT-registered status or self-employed registration related to the development or activity of the rewarded contribution.
3. I acknowledge that I have been formally informed that the bounty reward paid by Plakar SAS for the specified contribution and approved amount constitutes taxable income in my country of tax residence.
4. I certify that it is my sole and complete responsibility to declare the entirety of this income to the competent tax authorities of my place of residence.
5. I certify that the banking information provided for the wire transfer (IBAN/BIC or international account details) is accurate and belongs to a bank account opened under my own name.

In witness whereof, I provide this statement to serve and be used where applicable.

Signed at: [Your City]  
On: [Current Date]

**Signature of the Beneficiary:** [Your Signature]

[bounty-roadmap]: /legal-notice/bounties/


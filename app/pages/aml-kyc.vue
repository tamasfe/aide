<script setup lang="ts">
const url = useRequestURL();

const { t } = useI18n();

useHead({
  title: t("page.aml_kyc"),
});
</script>

<template>
  <div>
    <!-- <AppPage
      :title="$t('page.aml_policy')"
      version="2.0"
      date="September 1, 2024"
      :show-print-button="true"
    >
      <h4>1. Objective of the Policy</h4>

      <p>{{ url.host }} is fully committed to preventing money laundering and combating the financing of terrorism across all jurisdictions in which it operates. This policy outlines the measures and procedures implemented to mitigate risks, safeguard the company’s reputation, and comply with local and international AML regulations.</p>

      <h4>2. Obligations</h4>

      <ul>
        <li><strong>Appointment of Money Laundering Reporting Officer (MLRO):</strong> {{ url.host }} will appoint a senior officer as the designated MLRO, responsible for fulfilling duties as required by laws, regulations, and guidance notes. The MLRO will oversee the company's AML strategies, report suspicious activities, and ensure compliance with relevant legal frameworks.</li>
        <li><strong>Reporting Suspected Money Laundering:</strong> All instances of suspected money laundering must be reported to the MLRO. Employees must not convey suspicion to the customer and must await further instructions from the relevant authority.</li>
        <li><strong>Customer Identification and Verification (KYC):</strong> {{ url.host }} will implement a comprehensive "Know Your Customer" (KYC) policy. The company will take all reasonable steps to establish and verify the identity of its customers through document verification, automated tools, and risk assessment procedures.</li>
        <li><strong>Maintaining a Secure Player List:</strong> {{ url.host }} will maintain a secure, up-to-date list of all registered players, ensuring that player data is stored securely and accessed only by authorized personnel.</li>
        <li><strong>Document Retention:</strong> {{ url.host }} will retain all identification and transactional documentation in compliance with applicable laws and regulations. This includes maintaining records for the required duration and ensuring their secure storage.</li>
        <li><strong>No Cash Elements:</strong> The business will operate cashless transactions only, eliminating risks associated with counterfeit money.</li>
        <li><strong>Monitoring Account Transaction Histories:</strong> {{ url.host }} will implement systems to record and regularly review all account transactions. These systems will check for unusual betting patterns, social responsibility indicators, and potential fraud.</li>
        <li><strong>Monitoring High-Risk Customers:</strong> {{ url.host }} will maintain a register of high-risk customers and politically exposed persons (PEPs). These accounts will undergo enhanced due diligence (EDD) and be subject to increased scrutiny and more frequent checks.</li>
        <li><strong>Suspicious Transactions:</strong> All transactions will be monitored to prevent money laundering or terrorist financing activities. Suspicious transactions will be reported to the relevant authority without delay.</li>
        <li><strong>Fraud Detection and Response:</strong> If fraud is suspected, the risk and fraud department may require additional documentation from the player. The account will be suspended pending verification, and relevant authorities will be notified.</li>
      </ul>

      <h4>3. Staff Training and Compliance Awareness</h4>

      <ul>
        <li>
          <strong>Comprehensive Training Programs:</strong> {{ url.host }} will provide initial and ongoing AML training to all relevant staff. Training topics include:
          <ul>
            <li>Personal responsibilities regarding AML.</li>
            <li>Procedures for identifying and verifying customers.</li>
            <li>Monitoring customer activity and transaction patterns.</li>
            <li>Record-keeping and reporting unusual/suspicious transactions.</li>
            <li>Identifying and managing high-risk accounts, including PEPs.</li>
            <li>Enhanced due diligence for high-risk clients.</li>
          </ul>
        </li>
        <li><strong>Continuous Updates:</strong> Training programs will be regularly updated to reflect changes in global AML regulations and emerging risks.</li>
      </ul>

      <h4>4. Customer Due Diligence (CDD) and Enhanced Due Diligence (EDD)</h4>

      <ul>
        <li><strong>Risk-Based CDD Approach:</strong> {{ url.host }} will employ a risk-based approach to CDD, adjusting the level of verification based on the customer's risk profile. This includes verifying identity, address, and other relevant information.</li>
        <li>
          <strong>Enhanced Due Diligence for High-Risk Customers:</strong> For customers identified as high risk, including PEPs, {{ url.host }} will conduct EDD, which may involve:
          <ul>
            <li>Additional verification of identity and source of funds.</li>
            <li>Continuous monitoring of transactions.</li>
            <li>In-depth reviews of the customer's financial history and background.</li>
          </ul>
        </li>
      </ul>

      <h4>5. Transaction Monitoring and Reporting</h4>

      <ul>
        <li><strong>Real-Time Transaction Monitoring:</strong> {{ url.host }} will use real-time transaction monitoring systems configured with predefined risk scenarios to detect suspicious activities. These systems will flag transactions that deviate from typical patterns or exceed certain thresholds.</li>
        <li><strong>Suspicious Activity Reports (SARs):</strong> All suspicious transactions must be reported to the MLRO, who will file a Suspicious Activity Report (SAR) with the relevant authority. SARs must be filed promptly and handled confidentially.</li>
      </ul>

      <h4>6. Record-Keeping and Data Protection</h4>
      <ul>
        <li><strong>Secure Record Retention:</strong> {{ url.host }} will retain all records related to customer identification, transactions, and other AML-related activities for the maximum duration required by applicable laws. All records will be stored securely, with access restricted to authorized personnel.</li>
        <li><strong>Compliance with Data Protection Laws:</strong> {{ url.host }} will ensure that all customer data is handled in compliance with relevant data protection regulations, including GDPR and other applicable laws.</li>
      </ul>

      <h4>7. Regular Audits and Policy Review</h4>
      <ul>
        <li><strong>Internal Audits:</strong> {{ url.host }} will conduct regular internal audits of its AML procedures to ensure compliance and identify areas for improvement. These audits will be documented and reviewed by senior management.</li>
        <li><strong>Policy Updates:</strong> The AML policy will be reviewed and updated regularly to reflect changes in regulatory requirements, technological advancements, and operational practices.</li>
      </ul>

      <h4>8. Cooperation with Authorities</h4>
      <ul>
        <li><strong>Collaboration with Law Enforcement:</strong> {{ url.host }} commits to fully cooperating with relevant administrative, enforcement, and judicial authorities in their efforts to prevent and detect criminal activities. The company will provide necessary information and support during investigations.</li>
      </ul>

      <h4>9. Politically Exposed Persons (PEP)</h4>
      <ul>
        <li><strong>Identification and Monitoring of PEPs:</strong> {{ url.host }} is required by law to identify and monitor politically exposed persons (PEPs), their family members, and close associates. Enhanced due diligence will be conducted for PEPs to assess and mitigate any risks associated with these individuals.</li>
        <li><strong>Definition of a PEP:</strong> A PEP is an individual who holds or has held a prominent public position, including senior government officials, members of parliament, judges, military officers, and senior executives of state-owned corporations.</li>
        <li><strong>Monitoring Family Members and Close Associates:</strong> {{ url.host }} will also monitor family members and close associates of PEPs, ensuring that any risks associated with these individuals are properly managed.</li>
      </ul>

      <h4>10. Customer Declarations</h4>
      <ul>
        <li><strong>Legitimacy of Funds:</strong> Customers must declare that all funds deposited and used on {{ url.host }} originate from legitimate sources and are not connected to any fraudulent activities, money laundering, or other illicit activities.</li>
        <li><strong>Right to Investigate and Retain Funds:</strong> {{ url.host }} reserves the right to investigate the source of funds and to retain any customer funds suspected of being connected to illicit or fraudulent activities.</li>
      </ul>

      <h4>11. Deposit and Withdrawal Procedures</h4>
      <ul>
        <li><strong>Currency for Transactions:</strong> Deposits and withdrawals will only be processed in approved currencies as defined by {{ url.host }}.</li>
        <li><strong>Minimum Deposit Amount:</strong> The minimum deposit amount is set at the discretion of {{ url.host }} and will be clearly communicated to players.</li>
        <li><strong>Verification of Payment Accounts:</strong> Customers must ensure that the payment accounts used for transactions are in their name. {{ url.host }} reserves the right to verify ownership of these accounts.</li>
        <li><strong>Withdrawal Methods:</strong> Withdrawals must be made using the same method as the deposit whenever possible. If the deposit method does not allow for withdrawals, alternative methods such as bank transfers will be used.</li>
        <li>
          <strong>Identity Verification for Withdrawals:</strong> For the first withdrawal request, customers must provide:
          <ul>
            <li>A government-issued photo ID with date of birth.</li>
            <li>Proof of address (e.g., a utility bill or bank statement).</li>
            <li>Proof of ownership of the payment account.</li>
          </ul>
        </li>
        <li><strong>Use of Player Accounts:</strong> Player accounts must not be used as bank accounts. In cases of deposits or withdrawals without gaming activity, {{ url.host }} reserves the right to request explanations before processing the withdrawal.</li>
      </ul>
    </AppPage> -->

    <AppPage
      :title="$t('kyc_policy.title')"
      version="2.0"
      date="2025-02-19"
    >
      <p class="whitespace-pre-wrap">
        {{ $t("kyc_policy.content_1", { host: url }) }}
      </p>

      <h4>{{ $t("kyc_policy.subtitle_2") }}</h4>
      <p class="whitespace-pre-wrap">
        {{ $t("kyc_policy.content_2") }}
      </p>

      <h4>{{ $t("kyc_policy.subtitle_3") }}</h4>
      <p class="whitespace-pre-wrap">
        {{ $t("kyc_policy.content_3") }}
      </p>
    </AppPage>
  </div>
</template>

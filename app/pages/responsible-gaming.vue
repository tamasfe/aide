<script setup lang="ts">
const { t } = useI18n();
const url = useRequestURL();

useHead({
  title: t("page.responsible_gaming"),
});
</script>

<template>
  <AppPage
    :title="$t('page.responsible_gaming')"
    version="2.0"
    date="September 1, 2024"
  >
    <h4>1. Commitment to Responsible Gaming</h4>

    <p>{{ url.host }} is committed to providing an excellent and enjoyable gaming experience while recognizing our responsibility to prevent and mitigate problematic gambling behaviors. We encourage all players to engage in gaming as a form of entertainment and to be mindful of their gaming habits.</p>

    <h4>2. Guidelines for Responsible Gaming</h4>

    <p>To ensure a safe and enjoyable gaming experience, we advise all players to consider the following guidelines:</p>

    <ul>
      <li><strong>Play for Entertainment:</strong> Engage in gaming for enjoyment, not as a means to make money.</li>
      <li><strong>Avoid Chasing Losses:</strong> Understand that losses are part of gaming and avoid trying to recover them immediately.</li>
      <li><strong>Set Personal Limits:</strong> Establish both time and financial limits for yourself before you start gaming.</li>
      <li><strong>Maintain Balance:</strong> Ensure that gambling does not interfere with your daily responsibilities and obligations.</li>
      <li><strong>Gamble Within Your Means:</strong> Only gamble with money you can afford to lose.</li>
      <li><strong>Take Regular Breaks:</strong> Regular breaks can help keep your gaming experience enjoyable and within control.</li>
    </ul>

    <h4>3. Self-Assessment: Is Your Gaming Healthy?</h4>

    <p>If you answer "YES" to any of the following questions, we strongly advise you to consider taking proactive steps to prevent gambling from negatively impacting your life:</p>

    <ul>
      <li>Does gambling affect your work or academic performance?</li>
      <li>Has gambling caused conflicts with family or friends?</li>
      <li>Do you often return to gambling to try to win back your losses?</li>
      <li>Have you borrowed money or sold possessions to gamble?</li>
      <li>Do you view gambling as a source of income?</li>
      <li>Do you find it challenging to limit the time or money spent on gambling?</li>
    </ul>

    <h4>4. Resources for Support</h4>

    <p>For those who may be struggling with gambling issues, we recommend reaching out to the following reputable organizations that offer support and resources:</p>

    <ul>
      <li><strong>Gamblers Anonymous</strong></li>
      <li><strong>Gambling Therapy</strong></li>
      <li><strong>GamCare</strong></li>
    </ul>

    <p>These organizations provide confidential advice and support to help individuals regain control over their gambling habits.</p>

    <h4>5. Self-Exclusion and Cooling-Off Periods</h4>

    <p>If you are concerned about your gambling behavior, {{ url.host }} offers tools to help you manage or take a break from gaming:</p>

    <ul>
      <li><strong>Self-Exclusion:</strong> You can request to exclude yourself from your gaming account for a minimum of 30 days. During this period, your account will be locked, and no promotional material will be sent to you.</li>
      <li><strong>Cooling-Off Period:</strong> A 7-day cooling-off period is also available, allowing you to take a short break from gaming.</li>
    </ul>

    <p>To request self-exclusion or a cooling-off period, please contact our experienced Customer Support team, who are available to assist you at any time. We also recommend contacting other gambling platforms where you have an account to request self-exclusion there as well.</p>

    <h4>6. Monitoring and Intervention</h4>

    <p>{{ url.host }} utilizes advanced monitoring tools to detect and assess potentially problematic gambling behaviors. This includes real-time analysis of gaming patterns, spending habits, and self-assessment data. If our system identifies risky behavior, we may reach out to offer support, provide resources, or suggest self-exclusion options. Our aim is to ensure a safe and responsible gaming environment for all players.</p>

    <h4>7. Preventing Underage Gambling</h4>

    <p>{{ url.host }} strictly prohibits underage gambling. Players must be of legal gambling age in their jurisdiction (at least 18+) to create an account and play. It is the responsibility of the player to ensure they meet the legal age requirements of their location. To assist in preventing underage gambling, we advise parents and guardians to:</p>

    <ul>
      <li><strong>Protect Access:</strong> Use strong passwords for computers, mobiles, and tablets.</li>
      <li><strong>Supervise Devices:</strong> Do not leave devices unattended while logged into your account.</li>
      <li><strong>Secure Account Information:</strong> Ensure all account details and credit cards are inaccessible to minors.</li>
      <li><strong>Use Filtering Software:</strong> Install filtering software (e.g., Net Nanny) to block access to gambling sites and other inappropriate content.</li>
    </ul>
  </AppPage>
</template>

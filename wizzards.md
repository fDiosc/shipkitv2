# ShipKit Onboarding Wizards Strategy 🧙‍♂️✨

This document outlines the strategic implementation of "Wizards" (step-by-step guides) to ensure users extract maximum value from ShipKit during their first access.

## 🎯 Global Strategy: The "Always-Helpful" Sidebar
For every major section, we propose a **Contextual Help / Restart Wizard** button.
- **Visual**: A small, subtle floating `(?)` or `Help` button at the bottom-right of relevant sections.
- **Function**: Re-triggers the onboarding flow for that specific context if the user feels lost.

---

## 🏗️ 1. The "First Landing" Wizard
**Location**: `/dashboard/landings` (Modal de Criação)

| Metric | Detail |
| :--- | :--- |
| **Value** | Ensuring the AI creates a surgical, high-converting copy by inputting the right context. |
| **Summary** | A 3-step guide through the `NewLandingModal`. It explains: <br>1. Why **Description** needs to be outcome-focused and more detail better for the AI creation of the page, including prices if the user wnats to add, for example. <br>2. How **Target Audience** changes the AI's "dialect". <br>3. Why **Product Stage** dictates the call-to-action (Waitlist vs. Buy Now). |
| **Trigger** | Automatically pops up when the "New Landing" button is clicked for the first time. |

---

## 🎨 2. The "Creator Masterclass" Wizard
**Location**: `/editor/[id]`

| Metric | Detail |
| :--- | :--- |
| **Value** | Overcoming the "Blank Canvas" or "Complex Editor" fear. |
| **Summary** | A highlight tour of the Craft.js workspace: <br>1. **The Toolbar**: Dragging new elements into the page. <br>2. **Contextual Settings**: How to click an element to edit colors/text in the sidebar. <br>3. **Project Settings**: Configuring Cal.com and SEO within the editor. <br>4. **Responsive Check**: Using the topbar toggles to see mobile/tablet views. |
| **Trigger** | Pops up upon the first entry into any editor session. |

---

## 🔌 3. The "Integrations Hub" Wizard
**Location**: `/dashboard/settings`

| Metric | Detail |
| :--- | :--- |
| **Value** | Connecting the "brain" (ShipKit) to the "arms" (Cal.com, Stripe). |
| **Summary** | An interactive guide focusing on: <br>1. **Global Default**: Setting your Cal.com link once for all pages. <br>2. **Verification**: How to test if the integration is correctly mapped to your profile. |
| **Trigger** | First visit to the Settings tab or when selecting a Cal.com block in the editor without a link set. |

---

## 📊 4. The "Growth Insights" Wizard
**Location**: `/dashboard/analytics` & `/dashboard/leads`

| Metric | Detail |
| :--- | :--- |
| **Value** | Closing the loop: Proving that ShipKit works. |
| **Summary** | A guide on data interpretation: <br>1. **Conversion Funnel**: Explaining the relationship between views and leads. <br>2. **Leads Export**: How to download your data for CRM automation. <br>3. **Filtering**: Analyzing performance per specific landing page. |
| **Trigger** | First time a user hits 10+ page views or when they visit the Analytics tab for the first time. |

---

## 🚀 Implementation Priority
1.  **Visual Editor Wizard**: Highest impact (reduces churn due to complexity).
2.  **First Landing Wizard**: Critical for AI quality.
3.  **Integrations Wizard**: Critical for functional value.
4.  **Analytics Wizard** : Retention-focused.

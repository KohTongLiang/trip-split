<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1jktdGEpNVHPRSfE2Db4UGhGWS504Zdaa

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


### New features (2025-10)

- Groups (modular expense histories): create, rename, delete, and pick members.
- Per-expense split: choose who shares each expense, including single-person transactions.
- Local storage persistence for groups and selected group.

How to use:
- Start the app (`npm run dev`) and open it in your browser.
- In the left column, use "Groups" to create/select a group and choose its members.
- Use "Add Expense" to record a transaction:
  - Set description, amount, currency, and payer.
  - Choose "Split among" to select participants. Use "Only payer" for a personal expense.
- The settlement plan updates based on the selected group’s members and expenses.

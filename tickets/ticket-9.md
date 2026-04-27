## 🐞 Bug: Session timeout not resetting on user activity

**Labels:** `bug`, `authentication`  
**Assignees:** (optional)

### Description  
Users are being logged out even while actively using the application. The session timeout mechanism does not reset when user activity occurs (e.g., clicks, keypresses, API calls), causing unintended session expirations.

### Steps to Reproduce  
1. Log in to the application  
2. Continuously interact with the app (clicks, typing, navigation, etc.) for 20+ minutes  
3. Observe session expiration despite ongoing activity  

### Expected Behavior  
The session timeout should reset on any valid user interaction, preventing logout while the user is active.

### Actual Behavior  
Session expires after the configured timeout regardless of user activity.

### Acceptance Criteria  
- [ ] Session timer resets on:
  - [ ] Click events  
  - [ ] Keypress events  
  - [ ] API calls / network activity  
- [ ] Idle users are still logged out after the configured timeout  
- [ ] Unit tests verify session reset behavior  
- [ ] No performance degradation from activity tracking  


---

## ✨ Feature: Add CSV export to Reports page

**Labels:** `feature`, `enhancement`  

### Description  
Users need the ability to export report data as a CSV file for external analysis in spreadsheet tools like Excel or Google Sheets.

### Requirements  
- Add an “Export CSV” button on the Reports page  
- Export only the currently filtered dataset (respect active filters/search)  
- File naming format: `report-YYYY-MM-DD.csv`  
- Ensure UTF-8 encoding with BOM for Excel compatibility  

### Acceptance Criteria  
- [ ] Export button is visible and accessible on the Reports page  
- [ ] Clicking the button downloads a CSV file  
- [ ] Export includes only filtered/visible data (not full dataset)  
- [ ] File format:
  - [ ] Correct filename format  
  - [ ] UTF-8 with BOM encoding  
- [ ] Works correctly in:
  - [ ] Chrome  
  - [ ] Firefox  
  - [ ] Safari  
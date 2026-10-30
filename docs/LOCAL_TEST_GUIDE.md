# Try the local build

Open http://127.0.0.1:8502 while the current server is running. Start with a new, disposable session. Use non-sensitive references and invented learner data during the pilot.

## Five-minute first try

1. Enter a goal such as understanding basic equations. Optional settings contain language, level, tone, and an interest.
2. Choose the starter reference and preview it. Select **Propose my plan**. This makes a real request to Nemotron through Nebius.
3. Check the three-topic plan. Edit an outcome or request changes. Teaching must remain blocked until **Accept this plan**.
4. Open the first lesson. Use **Show the next worked step**, or adjust the explanation. Then select **Try it myself**.
5. For `3x + 5 = 17`, deliberately try `12` and explain that you subtracted 5 but stopped. The tutor should ask about a step before providing help.
6. Give the diagnostic response, read the help and checked solution, then try the changed question `4x + 3 = 23` independently. Its checked answer is 5.
7. Close/reopen the same session URL. It should restore the next action. Keep that URL or the session code in **Your session**. Opening the root URL starts a separate session; it does not list other learners.
8. Optionally download a Markdown checkpoint. Declining the download changes nothing about saved progress.

## Feedback we need from you

- Is the next action obvious on each screen? Did anything compete with the current question?
- Is the pace comfortable, and can you find preferences without hunting?
- Does the diagnostic address the step you actually missed?
- Is the Indonesian wording natural enough to pilot? Live checks preserved the math but found awkward phrases, so it needs a native reader's review.

## Manual PDF check

Start another disposable profile. Choose **Upload a PDF**, select a short text-based reference, and inspect the extracted preview. A scanned/blank or oversized PDF should give an actionable message and allow pasted text. Automated parsing tests passed, but the complete browser upload could not be verified because the automation extension lacks file-URL permission. Ordinary manual upload in the app does not require granting that extension permission.

The source fixture `app/local_results/qa_reference.pdf` is a synthetic local test file, excluded from Git. Do not upload private classroom documents or conversations.

## Limits

- This is a local, three-topic prototype. The six seed questions are a small starter set. Repeated questions are weaker evidence than fresh transfer problems.
- Review uses real dates in Asia/Jakarta, starts after one day, and uses prototype interval rules. Tests of future dates are simulated software tests, not retention evidence.
- Review currently appears between learning units. Randomized placement inside a mixed quiz is still pending; there is no claim that the whole review milestone is complete.
- Anyone holding a session URL/code can access that disposable profile on this installation. The server binds to 127.0.0.1. Do not expose it publicly or use sensitive profiles without choosing and implementing proper hosted access controls.
- The development meter estimates this helper's calls against $2. It is not a Nebius account cap. Judge/demo credit and actual account expiry must still be checked in Nebius.
- No public deployment, Git push, submission, or real learner pilot was performed during this build.

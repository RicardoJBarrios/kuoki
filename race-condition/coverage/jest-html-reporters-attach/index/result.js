window.jest_html_reporters_callback__({"numFailedTestSuites":0,"numFailedTests":0,"numPassedTestSuites":2,"numPassedTests":20,"numPendingTestSuites":0,"numPendingTests":0,"numRuntimeErrorTestSuites":0,"numTodoTests":0,"numTotalTestSuites":2,"numTotalTests":20,"startTime":1654439872487,"success":false,"testResults":[{"leaks":false,"numFailingTests":0,"numPassingTests":17,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":1654439875695,"runtime":2677,"slow":false,"start":1654439873018},"skipped":false,"testFilePath":"/home/runner/work/kuoki/kuoki/packages/race-condition/src/lib/race-condition-free-subscription.spec.ts","testResults":[{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":2,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #add(key, subscriptionFn) adds if new key","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#add(key, subscriptionFn) adds if new key"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":2,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #add(key, subscriptionFn) subscribes if new key","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#add(key, subscriptionFn) subscribes if new key"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":2,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #add(key, subscriptionFn) do nothing if existing key and active subscription","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#add(key, subscriptionFn) do nothing if existing key and active subscription"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":1,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #add(key, subscriptionFn) replaces if existing key and closed subscription","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#add(key, subscriptionFn) replaces if existing key and closed subscription"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":0,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #add(key, subscriptionFn) subscribes again from replaced key","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#add(key, subscriptionFn) subscribes again from replaced key"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":2,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #add(key, subscriptionFn, args) replaces if existing key, diferent args and active subscription","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#add(key, subscriptionFn, args) replaces if existing key, diferent args and active subscription"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":2,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #add(key, subscriptionFn, args) replaces if existing key, diferent args and closed subscrption","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#add(key, subscriptionFn, args) replaces if existing key, diferent args and closed subscrption"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":1,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #add(key, subscriptionFn, args) do nothing if existing key, equal args and active subscription","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#add(key, subscriptionFn, args) do nothing if existing key, equal args and active subscription"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":1,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #add(key, subscriptionFn, args) replaces if existing key, equal args and closed subscription","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#add(key, subscriptionFn, args) replaces if existing key, equal args and closed subscription"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":2,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #add(key, subscriptionFn, args) uses deep equals for args","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#add(key, subscriptionFn, args) uses deep equals for args"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":2,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #get(key) returns the key Subscription","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#get(key) returns the key Subscription"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":0,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #get(key) returns undefined if no key","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#get(key) returns undefined if no key"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":1,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #unsubscribe(key) unsubscribe the key Subscription","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#unsubscribe(key) unsubscribe the key Subscription"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":1,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #unsubscribe(key) deletes the key","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#unsubscribe(key) deletes the key"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":1,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #unsubscribe(key) do nothing if no key","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#unsubscribe(key) do nothing if no key"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":1,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #unsubscribe(key, key) deletes multiple keys","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#unsubscribe(key, key) deletes multiple keys"},{"ancestorTitles":["RaceConditionFreeSubscription"],"duration":2,"failureDetails":[],"failureMessages":[],"fullName":"RaceConditionFreeSubscription #unsubscribe() unsubscribes all subscriptions","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"#unsubscribe() unsubscribes all subscriptions"}],"displayName":{"color":"white","name":"race-condition"},"failureMessage":null},{"leaks":false,"numFailingTests":0,"numPassingTests":3,"numPendingTests":0,"numTodoTests":0,"perfStats":{"end":1654439876424,"runtime":698,"slow":false,"start":1654439875726},"skipped":false,"testFilePath":"/home/runner/work/kuoki/kuoki/packages/race-condition/src/lib/race-condition-free.decorator.spec.ts","testResults":[{"ancestorTitles":["@RaceConditionFree"],"duration":9,"failureDetails":[],"failureMessages":[],"fullName":"@RaceConditionFree uses RaceConditionFreeSubscription","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"uses RaceConditionFreeSubscription"},{"ancestorTitles":["@RaceConditionFree"],"duration":2,"failureDetails":[],"failureMessages":[],"fullName":"@RaceConditionFree uses independent RaceConditionFreeSubscription","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"uses independent RaceConditionFreeSubscription"},{"ancestorTitles":["@RaceConditionFree"],"duration":2,"failureDetails":[],"failureMessages":[],"fullName":"@RaceConditionFree workds with multiple instances","invocations":1,"location":null,"numPassingAsserts":0,"status":"passed","title":"workds with multiple instances"}],"displayName":{"color":"white","name":"race-condition"},"failureMessage":null}],"wasInterrupted":false,"config":{"bail":0,"changedFilesWithAncestor":false,"collectCoverage":true,"collectCoverageFrom":[],"coverageDirectory":"/home/runner/work/kuoki/kuoki/docs/race-condition/coverage/lcov-report","coverageProvider":"babel","coverageReporters":["html","lcov"],"detectLeaks":false,"detectOpenHandles":false,"errorOnDeprecated":false,"expand":false,"findRelatedTests":false,"forceExit":false,"json":false,"lastCommit":false,"listTests":false,"logHeapUsage":false,"maxConcurrency":5,"maxWorkers":1,"noStackTrace":false,"nonFlagArgs":[],"notify":false,"notifyMode":"failure-change","onlyChanged":false,"onlyFailures":false,"passWithNoTests":true,"projects":[],"reporters":[["default",{}],["/home/runner/work/kuoki/kuoki/node_modules/jest-html-reporters/index.js",{"publicPath":"docs/race-condition/coverage","filename":"index.html","pageTitle":"Race Condition Tests","expand":true,"hideIcon":true}]],"rootDir":"/home/runner/work/kuoki/kuoki/packages/race-condition","runTestsByPath":false,"skipFilter":false,"testFailureExitCode":1,"testPathPattern":"","testSequencer":"/home/runner/work/kuoki/kuoki/node_modules/@jest/test-sequencer/build/index.js","updateSnapshot":"new","useStderr":false,"watch":false,"watchAll":false,"watchman":true,"coverageLinkPath":"lcov-report/lcov-report/index.html"},"endTime":1654439876464,"_reporterOptions":{"publicPath":"docs/race-condition/coverage","filename":"index.html","expand":true,"pageTitle":"Race Condition Tests","hideIcon":true,"testCommand":"npx jest","openReport":false,"failureMessageOnly":false,"enableMergeData":false,"dataMergeLevel":1,"inlineSource":false},"attachInfos":{}})
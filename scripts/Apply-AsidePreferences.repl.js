// Run ONLY inside Aside's REPL on the destination Windows PC.
// This is not a Node/PowerShell script. Requires Aside globals: aside, fs, console.
// Set options before pasting this file:
// var asideTransferOptions = { profilePath: 'C:/full/path/profiles/aside.preferences.json', apply: false };
// Preview first. Change apply to true only after reviewing it. Models are NEVER auto-applied.
(async () => {
  if (typeof asideTransferOptions !== 'object' || !asideTransferOptions ||
      typeof asideTransferOptions.profilePath !== 'string' ||
      typeof asideTransferOptions.apply !== 'boolean') {
    throw new Error('Set asideTransferOptions with an absolute profilePath and boolean apply first.');
  }
  const filePath = asideTransferOptions.profilePath;
  if (!/^[A-Za-z]:[\\/]/.test(filePath)) throw new Error('Use an absolute Windows profile path on the destination PC.');
  if (typeof aside === 'undefined' || typeof fs === 'undefined') throw new Error('Run inside Aside REPL, not Node or PowerShell.');
  const profile = JSON.parse(await fs.readFile(filePath,'utf8'));
  if (profile.format !== 'mac-to-windows/aside-preferences-v1') throw new Error('Unsupported profile format.');
  const b = x => typeof x === 'boolean';
  const n = x => typeof x === 'number' && Number.isFinite(x) && x >= 0 && x <= 100000000;
  const t = x => typeof x === 'string' && x.length <= 100;
  const schema = {
    compaction: { enabled:b, reserveTokens:n, keepRecentTokens:n, thresholdPercent:n },
    retry: { enabled:b, maxRetries:n, baseDelayMs:n, maxDelayMs:n },
    followUpBehavior:t,
    sidepanelSessionOnTabChange:t,
    sidebarRecentChatLimit:t,
    timezone:t,
    agentTabs:{closeAfterIdleMinutes:n},
    agentTaskNotifications:{needsAttention:b,taskCompletions:b,routineCompletions:b},
    completionSound:{enabled:b},
    memory:{enabled:b,episodicRetentionDays:n,dreamingMinHours:n,dreamingMinSessions:n}
  };
  if (!profile.settings || Array.isArray(profile.settings) || typeof profile.settings !== 'object') throw new Error('Missing settings object.');
  const before = {};
  const patches = {};
  for (const [key,value] of Object.entries(profile.settings)) {
    if (!Object.prototype.hasOwnProperty.call(schema,key)) throw new Error('Non-allowlisted key: '+key);
    const rule = schema[key];
    if (typeof rule === 'function') {
      if (!rule(value)) throw new Error('Invalid preference value: '+key);
    } else {
      if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('Invalid preference group: '+key);
      for (const [nested,v] of Object.entries(value)) {
        if (!Object.prototype.hasOwnProperty.call(rule,nested) || !rule[nested](v)) throw new Error('Non-allowlisted or invalid preference: '+key+'.'+nested);
      }
    }
    const current=aside.settings.get(key);
    if (current === undefined) throw new Error('Destination Aside does not support: '+key);
    before[key]=JSON.parse(JSON.stringify(current));
    patches[key]=typeof rule==='function'?value:{...current,...value};
  }
  const changed=Object.keys(patches).filter(key=>JSON.stringify(before[key])!==JSON.stringify(patches[key]));
  console.log({ mode:asideTransferOptions.apply?'APPLY':'PREVIEW_ONLY', changeKeys:changed, models:'Not applied; sign in and select available models separately.', untouched:['credentials','permissions','sandbox','payment','communication','context capture','routine devices','routines','projects','memory content','sessions'] });
  if (!asideTransferOptions.apply || changed.length===0) return;
  const attempted=[];
  try {
    for (const key of changed) {
      attempted.push(key);
      aside.settings.set(key,patches[key]);
      const accepted=aside.settings.get(key);
      const desired=profile.settings[key];
      const matches=typeof schema[key]==='function'?JSON.stringify(accepted)===JSON.stringify(desired):Object.entries(desired).every(([k,v])=>JSON.stringify(accepted?.[k])===JSON.stringify(v));
      if (!matches) throw new Error('Setting did not read back as requested: '+key);
    }
    console.log({status:'APPLIED_AND_READ_BACK',keys:changed});
  } catch (error) {
    const rollbackFailed=[];
    for (const key of attempted.reverse()) {
      try { aside.settings.set(key,before[key]); } catch { rollbackFailed.push(key); }
    }
    console.log({status:'FAILED_ROLLBACK_ATTEMPTED',rollbackFailed});
    throw error;
  }
})();

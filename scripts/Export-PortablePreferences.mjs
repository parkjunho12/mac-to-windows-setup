#!/usr/bin/env node
// macOS source only. Exports allowlisted preferences, never complete application data.
// Run with a maintained Node 22.13+ or Node 24: node scripts/Export-PortablePreferences.mjs --out /safe/new/folder
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { DatabaseSync } from 'node:sqlite';

if (process.platform !== 'darwin') throw new Error('Export on the original Mac, not the new Windows PC.');
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--out' || !path.isAbsolute(args[1])) {
  throw new Error('Usage: node scripts/Export-PortablePreferences.mjs --out /absolute/new/folder');
}
const out = args[1];
if (fs.existsSync(out)) throw new Error('Output folder must not already exist. Nothing overwritten.');
const home = os.homedir();
const aside = JSON.parse(fs.readFileSync(path.join(home, '.aside/u/0/settings.json'), 'utf8'));
const db = new DatabaseSync(path.join(home, 'Library/Application Support/orca/profiles/local-default/profile-state.db'), { readOnly: true });
let orca;
try {
  const row = db.prepare("SELECT payload FROM profile_state_documents WHERE domain='settings'").get();
  if (!row) throw new Error('Current Orca settings domain not found. No legacy JSON fallback.');
  orca = JSON.parse(row.payload);
} finally { db.close(); }

function fields(source, table) {
  const result = {};
  for (const [key, validator] of Object.entries(table)) {
    if (!Object.hasOwn(source, key)) continue;
    if (!validator(source[key])) throw new Error(`Unexpected preference type/value: ${key}`);
    result[key] = source[key];
  }
  return result;
}
const bool = v => typeof v === 'boolean';
const num = v => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100000000;
const text = v => typeof v === 'string' && v.length <= 100 && !/[\r\n\u0000]/.test(v);
const asideSafe = {
  compaction: fields(aside.compaction, { enabled: bool, reserveTokens: num, keepRecentTokens: num, thresholdPercent: num }),
  retry: fields(aside.retry, { enabled: bool, maxRetries: num, baseDelayMs: num, maxDelayMs: num }),
  ...fields(aside, { followUpBehavior: text, sidepanelSessionOnTabChange: text, sidebarRecentChatLimit: text, timezone: text }),
  agentTabs: fields(aside.agentTabs, { closeAfterIdleMinutes: num }),
  agentTaskNotifications: fields(aside.agentTaskNotifications, { needsAttention: bool, taskCompletions: bool, routineCompletions: bool }),
  completionSound: fields(aside.completionSound, { enabled: bool }),
  memory: fields(aside.memory, { enabled: bool, episodicRetentionDays: num, dreamingMinHours: num, dreamingMinSessions: num })
};
const modelFields = { provider: text, modelId: text, thinkingLevel: text, fastMode: bool };
const modelReferences = {
  defaultModel: fields(aside.defaultModel, modelFields),
  modelCategories: Object.fromEntries(['fast','standard','deep','visual'].filter(k => aside.modelCategories?.[k]).map(k => [k,fields(aside.modelCategories[k],modelFields)]))
};
const orcaRules = {};
for (const k of ['theme','uiLanguage','appFontFamily','editorFontFamily','terminalFontFamily','terminalGpuAcceleration','terminalLigatures','terminalCursorStyle','terminalThemeDark','terminalThemeLight','sourceControlViewMode','diffDefaultView','branchPrefix','defaultTuiAgent','terminalShortcutPolicy']) orcaRules[k]=text;
for (const k of ['editorAutoSaveDelayMs','terminalFontSize','terminalFontWeight','terminalFontWeightBold','terminalLineHeight','terminalScrollSensitivity','terminalFastScrollSensitivity','terminalInactivePaneOpacity','terminalActivePaneOpacity','terminalDividerThicknessPx']) orcaRules[k]=num;
for (const k of ['editorAutoSave','editorMinimapEnabled','editorWordWrap','terminalCursorBlink','terminalUseSeparateLightTheme','terminalRightClickToPaste','rightSidebarOpenByDefault','diffWordWrap','diffShowWhitespace','diffCollapseUnchangedRegions','nestWorkspaces','agentStatusHooksEnabled','tabAutoGenerateTitle','confirmClosePinnedTab','keepComputerAwakeWhileAgentsRun']) orcaRules[k]=bool;
const orcaSafe = fields(orca,orcaRules);
const capturedAt = new Date().toISOString();
const excluded = ['credentials','cookies','accounts','private keys','SSH targets','sessions','transcripts','memories','projects','routine prompts','permissions and trust grants','payment/communication settings','custom commands/environment','hooks','device identifiers'];
const payloads = {
  'aside.preferences.json': { format: 'mac-to-windows/aside-preferences-v1', capturedAt, settings: asideSafe, modelReferences, excluded },
  'orca.preferences.json': { format: 'mac-to-windows/orca-preferences-v1', capturedAt, source: 'profile-state.db/settings (read-only)', observed: orcaSafe, windowsOverrides: { terminalFontFamily: 'Consolas' }, manualWindowsSetup: { workspaceDirectory: 'Select a newly cloned local or WSL project path in the UI.', runtime: 'Choose WSL2 Ubuntu-24.04 for Linux projects; do not inherit macOS paths.', shell: 'Choose the matching WSL distribution in Orca Settings.' }, excluded }
};
// Pattern checks are deliberately limited. A human privacy review is still required before publication.
const secretChecks = [/-----BEGIN .*PRIVATE KEY-----/, /\bgh[pousr]_[A-Za-z0-9]{20,}\b/, /\bgithub_pat_[A-Za-z0-9_]{20,}\b/, /\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{24,}\b/, /\b\d{6}-[1-4]\d{6}\b/, /https?:\/\/[^\s/@]+:[^\s/@]+@/, /\/Users\//, /100\.\d+\.\d+\.\d+/];
for (const [name,value] of Object.entries(payloads)) {
  const textValue=JSON.stringify(value,null,2)+'\n';
  if (secretChecks.some(re=>re.test(textValue))) throw new Error(`Public export rejected by safety check: ${name}`);
}
fs.mkdirSync(out,{recursive:true,mode:0o700});
for (const [name,value] of Object.entries(payloads)) fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});
console.log(`Exported ${Object.keys(asideSafe).length} Aside preference groups and ${Object.keys(orcaSafe).length} Orca preferences to ${out}.`);
console.log('Model references are review-only. No credentials, complete settings files, or live application settings were copied or modified.');
console.log('Manual privacy review is required before publishing; pattern checks are not comprehensive.');

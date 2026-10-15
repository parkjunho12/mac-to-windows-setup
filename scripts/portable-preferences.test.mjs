// node --test scripts/portable-preferences.test.mjs
// Uses fixtures and a fake Aside API only. Never reads or mutates live app settings.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const source = await fs.readFile(new URL('./Apply-AsidePreferences.repl.js',import.meta.url),'utf8');
const originalProfile = JSON.parse(await fs.readFile(new URL('../profiles/aside.preferences.json',import.meta.url),'utf8'));
const orcaProfile = JSON.parse(await fs.readFile(new URL('../profiles/orca.preferences.json',import.meta.url),'utf8'));
const clone=x=>JSON.parse(JSON.stringify(x));
function fixture(profile=clone(originalProfile),opts={}) {
  const settings=clone(originalProfile.settings);
  settings.timezone='UTC';
  settings.memory.enabled=!profile.settings.memory.enabled;
  settings.compaction.modelThresholdTokens={fixture:12345};
  settings.permission={sandbox:{enabled:true}};
  settings.defaultModel={provider:'keep-this',modelId:'keep-this'};
  settings.credentials={canary:'not-an-auth-value'};
  const initial=clone(settings);
  const calls=[];
  let failed=false;
  const context={
    asideTransferOptions:{profilePath:opts.path??'C:/fixture/profiles/aside.preferences.json',apply:opts.apply??false},
    console:{log(){}},
    fs:{async readFile(){return JSON.stringify(profile)}},
    aside:{settings:{
      get(key){return clone(settings[key]);},
      set(key,value){
        calls.push(key);
        if(opts.failOn===key&&!failed){failed=true;throw new Error('fixture write failure');}
        settings[key]=clone(value);
        if(opts.readbackMismatch===key&&!failed){failed=true;settings[key]='incorrect fixture value';}
      }
    }}
  };
  return {settings,initial,calls,run:()=>vm.runInNewContext(source,context)};
}

test('exported field counts and Windows font adaptation',()=>{
  assert.equal(Object.keys(originalProfile.settings).length,10);
  assert.equal(Object.keys(orcaProfile.observed).length,40);
  assert.equal(orcaProfile.observed.terminalFontFamily,'SF Mono');
  assert.equal(orcaProfile.windowsOverrides.terminalFontFamily,'Consolas');
  for(const forbidden of ['credentials','permission','routineDeviceId','mcp','paymentUse','communication','contextAwareness']) {
    assert.equal(Object.hasOwn(originalProfile.settings,forbidden),false);
    assert.equal(Object.hasOwn(orcaProfile.observed,forbidden),false);
  }
});
test('preview never writes',async()=>{
  const f=fixture(); await f.run(); assert.deepEqual(f.calls,[]); assert.deepEqual(f.settings,f.initial);
});
test('apply merges and reads back only allowed preferences',async()=>{
  const f=fixture(undefined,{apply:true}); await f.run();
  assert.equal(f.settings.timezone,originalProfile.settings.timezone);
  assert.equal(f.settings.memory.enabled,originalProfile.settings.memory.enabled);
  assert.deepEqual(f.settings.compaction.modelThresholdTokens,{fixture:12345});
  assert.deepEqual(f.settings.permission,f.initial.permission);
  assert.deepEqual(f.settings.defaultModel,f.initial.defaultModel);
  assert.deepEqual(f.settings.credentials,f.initial.credentials);
  assert.deepEqual(f.calls,['timezone','memory']);
});
test('unknown top-level key is rejected before writing',async()=>{
  const p=clone(originalProfile);p.settings.permission={sandbox:{enabled:false}};
  const f=fixture(p,{apply:true}); await assert.rejects(f.run(),/Non-allowlisted key/); assert.deepEqual(f.calls,[]);
});
test('unknown nested key is rejected before writing',async()=>{
  const p=clone(originalProfile);p.settings.memory.secret='fixture';
  const f=fixture(p,{apply:true}); await assert.rejects(f.run(),/Non-allowlisted or invalid/); assert.deepEqual(f.calls,[]);
});
test('wrong scalar type is rejected before writing',async()=>{
  const p=clone(originalProfile);p.settings.retry.maxRetries='many';
  const f=fixture(p,{apply:true}); await assert.rejects(f.run(),/Non-allowlisted or invalid/); assert.deepEqual(f.calls,[]);
});
test('non-Windows destination path is rejected before writing',async()=>{
  const f=fixture(undefined,{apply:true,path:'/fixture/profile.json'});
  await assert.rejects(f.run(),/absolute Windows/);assert.deepEqual(f.calls,[]);
});
test('failed setting write restores all attempted groups',async()=>{
  const f=fixture(undefined,{apply:true,failOn:'memory'});
  await assert.rejects(f.run(),/fixture write failure/);assert.deepEqual(f.settings,f.initial);
});
test('readback mismatch triggers rollback',async()=>{
  const f=fixture(undefined,{apply:true,readbackMismatch:'timezone'});
  await assert.rejects(f.run(),/did not read back/);assert.deepEqual(f.settings,f.initial);
});

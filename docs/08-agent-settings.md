# 08. Orca·Aside 환경설정 가져오기

## 무엇을 실제로 가져올 수 있나

공개 가능한 실제 설정값은 [profiles](../profiles/README.md)에 담았습니다. 원본 앱 설정을 복사한 파일이 아니라 허용 목록으로 새로 만든 **이전용 프로필**입니다.

- Aside: 압축·재시도·알림·시간대·후속 요청·메모리 동작 설정 등 10개 그룹.
- Orca: 현재 SQLite 설정 원본의 40개 항목. 오래된 `orca-data.json` 대신 `profile-state.db`의 settings 도메인을 읽었습니다.
- 새 PC의 로그인 정보나 기존 설정을 통째로 덮어쓰지 않습니다.
- 사용자 스킬·메모리 본문·과거 대화·자동화 프롬프트·SSH·프로젝트 레지스트리·CLI 훅은 제외했습니다. 실제 업무정보가 섞여 있어 공개 저장소로 이전할 대상이 아닙니다.

## 1. 새 Windows PC에 앱 설치·로그인

- Aside: https://aside.com/download
- Orca: https://www.onorca.dev/download
- GitHub 저장소 ZIP을 새 PC에서 압축 해제. 이후 Windows 경로를 사용합니다.
- Claude/Codex 등 공급자 계정은 새로 로그인. Mac의 OAuth·암호화 키·cookies·auth.json은 옮기지 않습니다.

## 2. Aside: 미리보기 → 확인 → 적용

다음은 **PowerShell이나 Node가 아닌, Windows Aside의 REPL**에서 실행하는 도우미입니다. 사용자가 직접 REPL에 입력할 필요 없이 Aside에게 이 파일을 읽고 실행하도록 요청할 수 있습니다.

1. 로컬 `profiles/aside.preferences.json`과 `scripts/Apply-AsidePreferences.repl.js`를 읽기.
2. 실제 폴더 경로로 옵션 설정. 아래 경로는 예시이므로 바꿔야 합니다.

```javascript
var asideTransferOptions = {
  profilePath: 'C:/Users/<Windows사용자>/Downloads/mac-to-windows-setup-main/profiles/aside.preferences.json',
  apply: false
};
```

3. `Apply-AsidePreferences.repl.js`의 내용을 REPL에 실행. `PREVIEW_ONLY`와 `changeKeys`를 사용자에게 보고.
4. 변경 목록을 확인받은 뒤 `asideTransferOptions.apply = true`로 바꾸고 같은 도우미를 다시 실행.
5. `APPLIED_AND_READ_BACK`의 키를 확인하고 설정 화면에서도 대조. 실패 시 복원 시도 결과를 보고.

도우미는 허용되지 않은 키·하위 키·값 유형·잘못된 프로필·존재하지 않는 대상 설정을 거부합니다. 기존 그룹의 다른 항목은 보존합니다. 결제·메시지 전송·권한·sandbox·화면/입력 수집·루틴 실행 기기는 건드리지 않습니다.

메모리 **기능 설정**을 적용해도 과거 메모리 **내용**이 옮겨지는 것은 아닙니다. 현재 설정은 episodicRetentionDays 0이므로 기간 의미는 대상 버전의 UI 설명을 확인하고, 임의로 '삭제'나 '무제한'이라고 해석하지 않습니다.

### 모델은 로그인 후 별도 적용

프로필의 `modelReferences`에 조사 당시 기본 모델과 deep 카테고리 값이 있습니다. 도우미는 이를 자동 설정하지 않습니다.

- 기본: `openai-codex / gpt-6.1-sol / high`, fastMode false.
- deep: `claude-code / claude-fable-5-1 / high`, fastMode false.
- 새 PC에서 공급자 로그인과 현재 모델 목록을 먼저 확인. 목록에 없으면 임의 대체하지 말고 사용자에게 알림.
- 지원되는 모델임을 확인한 뒤 Settings UI 또는 `aside.settings.set`으로 해당 항목만 적용. 카테고리 변경은 기존 다른 카테고리를 보존.
- 이는 2026-10-15 관찰값이지 영구 고정 모델 요청이 아닙니다.

## 3. Orca: 실제 값 묶음을 공식 설정 화면에 적용

Orca 공식 문서·공개 소스에서 일반 설정 JSON의 import API/명령은 확인하지 못했습니다. 따라서 **DB를 직접 덮어쓰는 가짜 자동 가져오기 대신 설정 화면에서 값만 재현**합니다. Windows에서 UI 자동화가 가능한 에이전트가 있으면 아래 항목을 입력하고 저장 결과를 확인할 수 있습니다. 불가능하면 동일 값을 사람이 설정합니다.

| 설정 화면 | 맥에서 확인한 값 | Windows 적용 |
| --- | --- | --- |
| Appearance | Theme system, Language system, UI font Geist | 기본 동일. 글꼴이 없으면 앱 기본값 |
| Editor | Auto Save off, Minimap off, Word Wrap on | 동일 |
| Terminal | Font 14, SF Mono, Weight 500/700, Line height 1 | **SF Mono 대신 Consolas**. Windows에서 미리보기 확인 |
| Terminal | Block cursor, Blink on, GPU auto, Ligatures auto | 동일. 지원 안 되는 항목은 건너뛰고 보고 |
| Terminal | Dark: Ghostty Default Style Dark / Light: Builtin Tango Light | 제공되는 동일 테마가 있으면 선택, 없으면 기본 테마 유지 |
| Diff | Inline, Word Wrap off, Whitespace off, Collapse unchanged off | 동일 |
| Agents | Default TUI claude, Status hooks on, Tab auto title off | 새 기기 CLI 감지·로그인 후 선택 |
| Workspace | Nest workspaces on, Branch prefix git-username | 동일. 실제 저장 경로는 새로 지정 |
| Terminal | Shortcut policy orca-first, Right-click paste off | Windows 단축키와 충돌 여부 확인 |
| General | Keep awake while agents run false | 원본 동일. 실행 호스트 정책은 별도 판단 |

나머지 실제 값은 [orca.preferences.json](../profiles/orca.preferences.json)의 `observed`를 참조합니다. `observed`는 원본 관찰값, `windowsOverrides`는 Windows용 변경 제안입니다. 원본의 macOS 경로·Mac Option 키·TCC·승인/신뢰 상태는 이 프로필에 없습니다.

### Windows에서 추가로 해야 할 실행환경 설정

**터미널 셸과 Project Runtime은 별개입니다.**

1. WSL2 Ubuntu-24.04 설치·초기화 확인.
2. Orca Settings → General → Project Runtime에서 WSL 및 실제 배포판 선택.
3. Settings → Repository → Project Runtime에서 해당 Linux 프로젝트가 의도한 runtime을 쓰는지 확인.
4. Settings → Terminal → Default shell도 WSL·같은 배포판으로 선택.
5. 기존 터미널을 자동 변환했다고 생각하지 말고 **새 터미널**을 열어 확인.

```bash
uname -s
pwd
command -v git
command -v node
node --version
claude --version
codex --version
```

`Linux`와 새 WSL 경로가 나오는지 확인합니다. Windows-native 프로젝트라면 그 프로젝트만 Windows runtime으로 두고 해당 셸·CLI를 검증합니다. 지원 버전에 따라 UI 이름이 달라질 수 있습니다.

### Orca CLI·훅은 Windows에서 새 설치

Orca 설정의 CLI 등록 기능으로 Windows용 CLI를 설치합니다. 확인:

```text
orca status --json
orca agent hooks status --json
```

상태 훅이 필요하고 새 기기의 권한을 확인했을 때만:

```text
orca agent hooks on --json
```

Mac의 `~/.orca/agent-hooks/*.sh`, `.claude/settings.json`의 Mac 경로 훅, Codex의 trusted_hash/permission 설정을 복사하지 않습니다. 각 CLI와 Orca가 새 환경에서 설치한 훅을 사용합니다.

## 4. 새 프로젝트 등록

소스는 GitHub에서 새 clone하고, `node_modules` 등을 재설치한 다음 Orca에 해당 경로를 추가합니다. 기존 worktree ID·SSH target·탭·실행 중 프로세스·개인 대화는 프로필에 없습니다. 이전 작업을 놓치지 않으려면 [프로젝트 복원](03-projects.md)과 별도 미커밋 백업 확인이 필요합니다.

## 5. Mac에서 나중에 다시 추출할 때

Mac에서 유지보수 중인 Node 22.13+ 또는 24로 실행합니다. 출력 폴더는 존재하지 않아야 합니다.

```bash
node scripts/Export-PortablePreferences.mjs --out /absolute/new/export-folder
```

현재 도구는 관찰한 **local-default Orca 프로필과 Aside 계정 0만** 읽습니다. 다중 계정을 자동 순회하지 않습니다. Orca SQLite를 readOnly로 열며 legacy JSON으로 폴백하지 않습니다. 출력은 여전히 공개 전 검토해야 하며 자동 push하지 않습니다. 원본 설정·앱·DB는 변경하지 않습니다.

## 금지하는 '한 번에 복사'

- `%APPDATA%/orca`나 `~/.aside` 전체 덮어쓰기.
- `profile-state.db`를 Mac에서 Windows로 덮어쓰거나 `orca profile state rollback`을 일반 설정 import로 사용하기.
- 오래된 `orca-data.json`을 최신 상태라고 가정하기.
- Mac의 전체 권한·sandbox-off·Yolo·trust grants를 Windows에 자동 적용하기.
- 개인 대화·루틴 프롬프트·메모리·사용자 스킬을 공개 GitHub에 업로드하기.

## 확인 상태

프로필은 맥의 실제 파일/현재 SQLite에서 추출했고, 내보내기·적용 도우미를 로컬 모의 환경에서 검사했습니다. **새 Windows PC의 실제 적용·UI 동작·로그인은 아직 검증하지 않았습니다.**

공식 근거:
- https://www.onorca.dev/docs/settings
- https://www.onorca.dev/docs/cli/reference
- https://github.com/stablyai/orca/blob/v1.4.224/src/main/persistence/profile-state/legacy-json/README.md
- https://github.com/stablyai/orca/blob/v1.4.224/src/renderer/src/components/settings/DefaultWindowsProjectRuntimeSetting.tsx
- https://github.com/stablyai/orca/blob/v1.4.224/src/renderer/src/components/settings/RepositoryWindowsRuntimeSection.tsx
- https://github.com/stablyai/orca/blob/v1.4.224/src/cli/specs/profile-state.ts

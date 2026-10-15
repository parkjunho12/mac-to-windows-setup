# 03. 실제 프로젝트 복원

조사한 로컬 저장소의 origin·package.json·잠금 파일 기준입니다. origin은 현재 배포 대상·정본 저장소라는 보장이 없으며, 오래된 clone일 수 있습니다. **최신 원격 브랜치와 프로젝트 README/CI를 다시 확인**한 뒤 개발합니다.

## 우선 복원할 프로젝트

| 업무 | 조사한 로컬 폴더 | 확인한 원격 | 확인한 요구·복원 방식 |
| --- | --- | --- | --- |
| 행복한요양원 admin | `~/happy_admin` | `nokyang-prod:/opt/happy` (서버 origin) | engines Node >=18, pnpm >=8, pnpm lock. 서버 복제를 기본 경로로 쓰지 말고 GitHub 정본부터 확인 |
| 요양원 SaaS | `~/work/nursing-home-saas` 등 | `Park-Koh/nursing-home-saas` | 루트 런타임 요구는 이번 수집에서 미확인. 프로젝트별 문서 확인 |
| Type Saju/나를 읽다 | `~/Claude/Projects/saju` | `Park-Koh/narul-ilda` | npm lock, Next 15. 기본 Node 22에서 검사하되 CI 요구 우선 |
| Ripple | `~/Claude/Projects/insta-ads-app` | `Park-Koh/ripple` | npm lock, Next 16.3.0. Node engines 미명시, CI/문서 확인 |
| startup-tips | `~/Claude/Projects/startup-tips` 및 `~/work/startup-tips` | `Park-Koh/startup-tips` | Node >=20.11, npm lock. 두 로컬 사본의 미커밋 작업 각각 확인 |
| Park & Koh 사이트 | `~/Claude/Projects/park-koh` | `Park-Koh/park-koh.com` | npm lock, Next 16.3.0. CI/문서 확인 |
| SeeON 프런트 | `~/Claude/Projects/SeeON-Front` | `SeniorAILab/SeeON-Front` | **.nvmrc 24 / engines 24.x / pnpm 10.32.1** |
| 기존 낙상 AI 프로젝트 | `~/Documents/05_SeniorAILab/eldercare-fall-ai` | `GoBeromsu/eldercare-fall-ai` | **Node >=24 / pnpm 10.32.1**. SeeON과 같은 저장소로 가정하지 않음 |
| Senior AI Lab 사이트 | `~/Claude/Projects/Senior CareMindAI` | `SeniorAILab/senior-ai-lab-site` | npm lock, Next 14.2.15. 최신 브랜치 요구 확인 |
| JobAgent | `~/Claude/Projects/job-agent-india` | `parkjunho12/job-agent-india` | 이번 조사에서 루트 package.json 미확인. 하위 앱·README 확인 |
| 다시, 봄 | `~/Claude/Projects/senior-dating-app` | origin 없음 | backend engines Node >=20.11. Android gradlew 존재. **원격 정본과 미푸시 코드를 먼저 확보** |

`parkjunho12/happy-nursing-home-jsx`도 GitHub에 비공개 저장소로 존재합니다. 기존 운영 workflow가 이 저장소를 사용했으므로 `Park-Koh/nursing-home-saas`와 임의로 동일 취급하지 말고, 현재 운영 코드/배포 설정을 비교해 정본을 선택합니다.

WORLD PUSH 등 이번 경로 조사에서 정본 저장소를 특정하지 못한 서비스는 새 PC에서 이름만 보고 새 프로젝트를 만들지 말고 기존 배포 대시보드·로컬 작업 위치를 확인합니다.

## Mac에서 이동 전에: 미커밋 작업 확인

각 작업 폴더에서 **읽기 전용**으로:

```bash
git status --short
git branch --show-current
git log -1 --oneline
git remote -v
git worktree list
```

- GitHub clone은 커밋·푸시된 파일만 가져옵니다. 미추적 파일, ignore된 `.env`, 로컬 DB, unpushed commit은 별도입니다.
- worktree·다른 브랜치·중복 폴더에만 있는 작업도 확인합니다. `.git` 전체를 Windows로 덮어쓰기보다 변경사항을 안전하게 보관합니다.
- 비밀이 섞인 작업을 그대로 commit/push하지 않습니다. patch, `git bundle`(커밋만 포함), 별도 암호화 백업 중 알맞은 방식을 고릅니다.
- 이 문서 작성 과정에서는 프로젝트를 commit/push하거나 정리하지 않았습니다.

## Windows의 WSL에서: 새 clone과 의존성 재설치

npm 프로젝트 예시:

```bash
mkdir -p ~/src
cd ~/src
gh repo clone Park-Koh/narul-ilda
cd narul-ilda
nvm use 22   # 최신 README/CI가 다른 버전을 요구하면 그 버전 우선
npm ci
npm run     # 실제 제공 스크립트 확인
```

SeeON 프런트:

```bash
cd ~/src
gh repo clone SeniorAILab/SeeON-Front
cd SeeON-Front
nvm install
nvm use
npm install -g pnpm@10.32.1
pnpm install --frozen-lockfile
pnpm run   # 제공 명령 확인 후 typecheck/test/build 실행
```

**`node_modules`, `.venv`, `.next`, `dist`, `.gradle`, Mac ARM 네이티브 모듈·심볼릭 링크를 복사하지 않습니다.** lock 파일은 유지하고 해당 OS에서 다시 설치합니다. `npm ci`가 실패해도 바로 lock 파일을 지우거나 `npm install --force`하지 말고 Node 버전·선택 의존성·프로젝트 지침부터 확인합니다.

## 환경변수·DB·배포

1. `.env.example`과 최신 README에서 필요한 변수 이름만 확인.
2. 실제 값은 비밀관리자·승인된 서버 접근·암호화 전송으로 별도 전달. 이 환경 저장소에는 넣지 않음.
3. **로컬 개발용** DB·테스트 API 키로 구성. 운영 DB·실결제 키를 기본값으로 넣지 않음.
4. 명령의 `predev`/`prebuild`/`postinstall`도 실행될 수 있으므로 DB/외부 호출 여부부터 확인. 자동 seed/reset/migrate를 실행하지 않음.
5. 정적 검사 → 단위 테스트 → 로컬 빌드 → 개발서버를 검증. 실제 고객 결제·게시·청구·운영 배포는 별도 승인 작업.
6. admin 개발은 기존의 worktree → 테스트 → 승인 범위에 맞는 push/배포 절차 유지. 환경 이전을 이유로 main이나 운영 DB를 바꾸지 않음.

## Android / DB를 쓰는 다시, 봄

Android Studio·SDK·AVD는 Windows에 새 설치합니다. Mac의 AVD 이미지, `/Users/mac/Library/Android/sdk` 경로, JBR 경로를 그대로 쓰지 않습니다. Gradle 프로젝트 요구 JDK에 맞추고 `local.properties`를 새 SDK 경로로 재작성합니다. Windows 에뮬레이터와 WSL 백엔드 연결은 방화벽·바인딩·네트워크를 따로 점검합니다. Android 서명키·keystore는 별도 암호화 이전하고 GitHub에 넣지 않습니다.

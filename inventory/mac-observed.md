# 실제 Mac 조사 근거

조사일: 2026-10-15 KST. 읽기 전용 조사이며 설정 내용·인증정보·실제 어르신 기록은 수집해 저장하지 않았습니다.

## 확인된 사실

- macOS 26.6.2, Apple Silicon arm64. 새 Windows PC의 CPU 아키텍처는 확인하지 못함.
- `/Applications`에서 Aside, Chrome, Cursor, Docker, 카카오톡, 한컴 HWP, Microsoft Office, Tailscale, Slack, Android Studio, 여러 영상·연구 앱 설치를 확인.
- Homebrew에 `node@22 22.21.1`, Python 3.13/3.14, PostgreSQL 14/15, gh, FFmpeg, Tesseract, Pandoc, Ghostscript, pyenv 등 설치.
- Homebrew PostgreSQL 15 서비스는 조사 시점 `started`. 14는 `none`. 실제 DB 목록·데이터는 열람하지 않음.
- Mac의 `claude --version`: 2.1.267, `codex --version`: 0.154.0, `aside --version`: 1.26.916.1741. Windows 고정 설치 버전 요구사항이 아니라 관찰값.
- 셸에 Oh My Zsh, pyenv, Conda 초기화와 Homebrew·TeX·사용자 bin 경로가 있음. Windows에 그대로 복사하지 않음.
- 중요한 PATH 차이: 이 작업 도구의 기본 Node는 Aside 런타임 v26 계열이고, `/opt/homebrew/bin/node`는 v22.21.1. 기본 `npm`의 전역 prefix도 Aside 런타임을 가리켜 사용자 전역 npm 패키지 목록을 정확히 추정할 수 없었음. Windows에서는 에이전트 내장 Node를 개발용으로 쓰지 않도록 명시.
- `~/.local/bin`에 aside, kmsg, kmsg-upstream. Mac 자동화 관련 LaunchAgent 및 PostgreSQL 15 LaunchAgent 존재.
- Cursor/VS Code 확장 디렉터리에서 Python, Pyright/Pylance, Jupyter, Prettier, Remote SSH, Docker, 한국어, IntelliJ 키맵 등의 설치 흔적 확인. 오래된 버전 흔적도 있어 현재 활성·호환 상태는 확인하지 않음.
- GitHub CLI 활성 계정은 `parkjunho12`. repo 목록에서 개인·업무 저장소를 확인. 계정 비밀은 복사하지 않음.
- 프로젝트 파일에서 SeeON-Front의 Node 24 / pnpm 10.32.1, eldercare-fall-ai의 Node >=24 / pnpm 10.32.1을 확인. 모든 프로젝트를 Node 22로 통일하면 안 됨.

## Aside 루틴의 조사 시점 상태

| 루틴 | 상태 | 표시된 일정(KST) |
| --- | --- | --- |
| 행복한요양원 데일리 브리핑 | active | 매일 07:00 / 13:00 / 21:00 |
| 케어포·admin 아침 대조 및 급여기록 점검 | paused | 매일 07:30 |
| 주간 급여제공 기록지 점검 | paused | 일요일 15:00 |
| WORLD PUSH · 타입사주 정기 홍보 | active | 월·수·금 12:00 |
| ReadMe 광고 효과 점검 | active | 표시 RRULE 기준 1·14·21일 10:00, 2026-11-01 종료 |

루틴 이름·상태·일정만 확인했습니다. **active는 실행 성공 증거가 아니며 paused를 임의로 재개하지 않습니다.** 이 문서는 라이브 상태 대시보드가 아닙니다. 이후 상태가 바뀔 수 있습니다.

## 조사 방법

- `sw_vers`, `uname -m`, 앱/도구 디렉터리 목록, `brew list --versions`, `brew services list`.
- CLI 버전, GitHub 계정 상태·저장소 메타데이터.
- 주요 프로젝트의 package.json, 잠금 파일 존재 여부, .nvmrc. 실제 전체 소스나 .env는 업로드하지 않음.
- Aside 읽기 전용 프로젝트·루틴 API.
- WinGet 공식 저장소에서 설치 스크립트의 12개 패키지 ID 디렉터리 존재 확인. 이는 새 PC에서 설치 성공을 보장하지 않음.
- 공식 제품·Microsoft·Docker 문서. 링크는 `docs/07-sources.md`.

## 아직 모르는 것

새 PC의 Windows 버전·에디션·CPU·RAM·디스크·GPU·가상화 지원·기존 앱·관리자 권한·라이선스, 실제 데이터 용량, DB 백업 범위, 미커밋 작업 전체 목록, Windows에서 Aside 도구/스킬 동등 지원, 루틴 동기화·실행 호스트 동작. 설치 전에 해당 항목을 확인해야 합니다.

## 업로드 전 검증

- 로컬 문서 링크 17개 대상 파일 존재 확인, 전체 13개 파일에서 주요 토큰·개인키·주민번호 형태 검사: 발견 없음. 자동 검사는 모든 비밀 유형을 보장하지 않아 생성 파일 목록도 별도 검토.
- macOS 임시 PowerShell 7.6.7에서 두 스크립트 파서 오류 0건.
- Core/Dev/Media 미리보기 3종 정상. `-Install`의 비-Windows 차단, 상태 점검의 비-Windows 차단, 잘못된 Profile 거부 동작 확인.
- 별도 읽기 전용 리뷰에서 차단 이슈 없음.
- Windows 실제 설치·로그인·PowerShell 5.1 실행·ARM 설치는 시험하지 않았음.

## Orca·Aside 설정 묶음 추가 조사

- Orca 앱 관찰 버전 1.4.217. 현재 원본인 `profile-state.db`의 settings 도메인을 SQLite readOnly로 읽어 환경설정 40개만 추출. 오래된 legacy JSON은 내보내기 원본으로 사용하지 않음.
- Aside settings.json에서 비밀·권한·개인정보가 없는 10개 그룹을 추출. 기본 모델·deep 카테고리는 참고 항목으로만 보관하고 자동 적용에서 제외.
- 공개 프로필에는 로그인·키·쿠키·SSH target·프로젝트 ID·대화·메모리 본문·업무 스킬·개인 Mac 경로를 넣지 않음. SF Mono의 Windows 대체값은 Consolas로 별도 표시.
- Aside 적용 도우미는 실제 API 대신 격리된 모의 API로 9개 테스트 통과: 미리보기 무변경, 허용값 병합, 권한·모델 보존, 알 수 없는 키·유형·경로 거부, 쓰기 실패·읽기 확인 실패 복원.
- 내보내기 도구 실제 실행 성공, 기존 출력 폴더 덮어쓰기 거부 확인, JS 구문 검사 통과. 현재 20개 파일과 로컬 링크 31개 검사 및 공개 프로필 별도 검토에서 차단 항목 없음. 정규식 검사가 모든 비밀정보를 탐지하는 것은 아님.
- 공식 Orca 문서·v1.4.224 소스 조사에서 일반 설정 파일 import를 확인하지 못했으므로 Orca UI 적용으로 안내. Windows Project Runtime과 터미널 shell이 별도임을 명시.
- 새 PC에는 접속·설치·설정 적용하지 않았으며, 원본 Mac 환경설정과 DB도 변경하지 않음.

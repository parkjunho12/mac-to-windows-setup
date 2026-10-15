# 06. 완료 체크리스트와 문제 해결

체크박스는 **새 PC에서 실제 확인한 뒤에만** 표시합니다. 이 저장소 업로드 완료와 환경 이전 완료는 다릅니다.

## 1. 장치·업무

- [ ] Windows 11 에디션·x64/ARM64·RAM·여유 공간·가상화 확인.
- [ ] 업데이트·드라이버·Windows Hello·화면 잠금·암호화·복구키 보관 확인.
- [ ] Chrome·Aside·카카오톡 본인 계정 로그인과 기기 인증 확인.
- [ ] 한글/Office 라이선스와 대표 HWP/XLSX/PPTX/PDF 실제 열기·편집·출력 확인.
- [ ] 한글 폰트·복합기·스캐너·업무 보안모듈 확인.
- [ ] 케어포/admin/희망이음 등 조회·첨부 다운로드·인쇄 확인. 제출/실거래는 별도 승인.
- [ ] Tailscale 기존 조직 연결과 필요한 장치만 접근 가능 확인.
- [ ] 필요한 업무 문서·원본 미디어·메모 첨부·오프라인 파일 확인.

## 2. 개발

- [ ] `wsl -l -v`에서 배포판 VERSION 2.
- [ ] `~/src`에 프로젝트, Windows OneDrive 밖에 작업 소스 위치.
- [ ] Cursor가 WSL에 연결되고 터미널 `uname -s`가 Linux.
- [ ] Node 22/24 전환, SeeON pnpm 10.32.1 확인.
- [ ] WSL GitHub 인증과 필요한 조직 저장소 읽기 권한 확인.
- [ ] 프로젝트별 lock 기반 의존성 재설치, 새 .venv, OS별 네이티브 모듈 재생성.
- [ ] 로컬 .env가 개발 DB·테스트 키인지 확인, 운영 데이터 접근하지 않음.
- [ ] Docker engine·compose·WSL 통합 확인, WSL 내부 Engine 중복 설치 없음.
- [ ] 필요한 로컬 DB 복원 후 테이블·행 수·주요 조회·시간대 확인.
- [ ] 프로젝트별 정적 검사·단위 테스트·빌드·개발서버 성공.
- [ ] Git 줄바꿈·실행권한 변경만으로 대량 diff가 생기지 않음.
- [ ] Mac의 미커밋/미푸시·다른 worktree·중복 clone 작업 보존 확인.
- [ ] Claude/Codex 새 인증과 최소 권한 설정 확인.

## 3. 자동화·백업

- [ ] Mac 전용 kmsg·AppleScript·Notes 작업을 목록화하고 실행 호스트 확정.
- [ ] Aside의 지원 동기화 범위, 실제 루틴 실행 기기 확인.
- [ ] 기존 paused 상태 유지, 새 PC 중복 자동 실행 없음.
- [ ] 읽기 전용 단일 실행 결과를 Mac과 대조, 실패 알림·절전·로그아웃·시간대 확인.
- [ ] 백업 개수/크기/중요 해시와 실제 파일 열림 확인.
- [ ] 유일한 원본이 옛 맥에만 남아 있지 않음.
- [ ] 업무자가 새 PC로 실제 업무를 마치고 철수 승인하기 전 맥 초기화 금지.

## 빠른 읽기 전용 점검

Windows PowerShell에서:

```powershell
.\scripts\Test-WindowsSetup.ps1
```

이 스크립트는 장치 정보·명령 존재·WSL 목록만 확인합니다. 앱 로그인·기능 정상·테스트 성공을 보장하지 않고 비밀파일도 열지 않습니다.

WSL Ubuntu에서 별도로:

```bash
uname -s
command -v node
node --version
npm --version
python3 --version
git --version
gh auth status
docker version
docker compose version
```

nvm 기본 22 상태에 pnpm이 없어도 Node 24에만 설치했다면 정상일 수 있습니다. `nvm use 24 && pnpm --version`으로 확인합니다.

## 흔한 문제

- **WSL 설치 실패:** Windows 업데이트·가상화·재시작·조직 정책을 확인. Defender/보안 부팅을 무조건 끄지 않음.
- **node가 Windows/에이전트 경로:** Windows 셸과 WSL 혼용 여부, `.bashrc` nvm 로드, `command -v node`, `npm config get prefix` 확인. 무작정 PATH 전체 덮어쓰기 금지.
- **빌드가 네이티브 모듈 오류:** Mac `node_modules`를 복사했는지, CPU/Node 버전/lock·선택 의존성 확인. 새 clone 폴더에서 재설치.
- **Docker 연결 실패:** Docker Desktop 실행, WSL 통합, Linux containers 모드 확인. 컨테이너/볼륨 삭제부터 하지 않음.
- **`/bin/bash^M` 또는 전체 diff:** CRLF 문제. 저장소 `.gitattributes`와 WSL Git `core.autocrlf input` 확인. 파일 전체를 일괄 재저장해 커밋하지 않음.
- **GitHub 조직 repo 안 보임:** 로그인 계정·조직 멤버십·SSO/초대 여부 확인. 저장소가 없다고 단정하지 않음.
- **업무사이트 인증/출력 실패:** Windows 지원 브라우저·보안모듈·팝업·한컴/PDF 연결·복합기 드라이버 확인.
- **카카오톡 수집 안 됨:** Windows 앱 로그인과 Mac용 kmsg 호환은 별개. Mac 유지 또는 재구현 필요.

## 되돌리기

이 저장소 스크립트는 기존 앱·자료를 삭제하거나 자동 재부팅하지 않습니다. 앱 설치 실패 시 성공/실패 목록을 확인하고 실패 항목만 원인을 조사합니다. 설치된 앱이 불필요하면 Windows 설정 → 앱에서 개별 제거합니다.

이전 작업 중 문제가 생기면 옛 맥을 원본으로 유지하고 실패한 새 환경에서만 재시도합니다. `wsl --unregister`, DB reset, Docker volume prune, 디스크 포맷 등 데이터 삭제 명령은 백업·복원 확인과 별도 승인 없이 사용하지 않습니다.

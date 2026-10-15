# 맥 → Windows 새 PC 환경 구축

> 박준호 업무·개발 환경 기준 / 조사일: 2026-10-15 KST / 공개용 선별 자료

**목표는 맥을 복제하는 것이 아니라, Windows에서 같은 업무를 할 수 있게 만드는 것입니다.**

현재 맥의 앱·Homebrew·프로젝트 설정·Aside 루틴을 읽어 작성했습니다. 새 PC에는 접속하지 않았으므로 CPU, Windows 에디션, RAM, 설치 완료 여부는 아직 모릅니다. 아래는 **구축 가이드와 설치 보조 도구**이며, 새 PC에 설치했다는 뜻이 아닙니다.

## Orca·Aside 설정도 가져오려면

**[실제 환경설정 묶음과 가져오기 안내](profiles/README.md)**를 먼저 보세요. 맥에서 추출한 Aside 10개 설정 그룹, Orca 40개 설정 항목과 Aside 적용 도우미를 추가했습니다. 로그인·대화·메모리 본문·SSH·업무 스킬은 공개 묶음에서 제외했습니다. Orca는 공식 설정 UI에서 값을 재현하는 방식이며 DB를 덮어쓰지 않습니다.

## 권장 구성

- **Windows 11 직접 실행:** Aside, Orca, Chrome, Cursor, 카카오톡, 한글, Word/Excel/PowerPoint, 업무사이트, Tailscale.
- **WSL2 Ubuntu 24.04:** Git, Node 22/24, Python, 개발용 CLI와 프로젝트 소스. 맥 터미널 업무를 여기로 옮깁니다.
- **Docker Desktop + WSL 통합:** 컨테이너와 개발 DB. 맥의 Docker 이미지/볼륨을 통째로 복사하지 않습니다.
- **기존 맥 당분간 유지:** kmsg 카카오톡 수집, AppleScript/Apple Notes 등 macOS 전용 자동화. Windows에서 동등 동작을 확인하기 전에는 끄지 않습니다.

## 먼저 설치할 것

1. Windows Update, 드라이버, Microsoft 계정·Windows Hello, 디스크 암호화와 복구키 보관.
2. Chrome, Aside, 카카오톡, 한컴오피스, Microsoft 365, Tailscale.
3. PowerToys, Windows Terminal, PowerShell 7, Cursor, Git, GitHub CLI.
4. 개발할 때 WSL2, Node 22/24, Python, Docker Desktop 추가.
5. 영상·Android·연구 도구는 실제 작업이 있을 때 추가. 설치돼 있던 모든 맥 앱을 따라 설치할 필요는 없습니다.

## 실행 순서

### 1. [앱 대응표](docs/01-apps.md)에서 필수·선택 구분

Mac 전용 앱을 Windows 실행 파일로 복사하지 않습니다. 각 제품의 Windows 설치 파일과 라이선스가 필요합니다.

### 2. 새 PC에서 이 저장소 받기

저장소 페이지 → **Code → Download ZIP** → 압축 해제. 공개 저장소라 ZIP 다운로드에 GitHub 로그인이 필요 없습니다. Git/GitHub CLI를 설치한 뒤에는 clone해도 됩니다. 업무용 비공개 프로젝트에는 별도 로그인이 필요합니다.

PowerShell에서 압축 해제한 폴더로 이동합니다. 스크립트를 먼저 읽고, 다운로드 차단 표식을 해제합니다.

```powershell
Get-Content .\scripts\Install-WindowsApps.ps1
Unblock-File .\scripts\Install-WindowsApps.ps1

# 목록만 출력. 설치하지 않음.
.\scripts\Install-WindowsApps.ps1 -Profile Core

# Core 앱 실제 설치. UAC·제품 약관은 화면에서 확인.
.\scripts\Install-WindowsApps.ps1 -Profile Core -Install

# 개발 도구 추가. Docker 이용 조건과 WSL 준비사항은 개발 문서 확인.
.\scripts\Install-WindowsApps.ps1 -Profile Dev -Install
```

실행 정책으로 막히면 해당 창에서만 `Set-ExecutionPolicy -Scope Process RemoteSigned` 후 다시 실행합니다. 회사 정책으로 막혔다면 우회하지 말고 관리자에게 문의합니다. 시스템 전체 정책, Defender, 방화벽을 끄지 않습니다.

스크립트는 **Windows 11 x64만 자동 설치 대상**입니다. ARM PC는 별도 호환성 검토가 필요합니다. Core에는 유료 Office/한글, 계정 로그인, Aside 설치는 포함되지 않습니다. 해당 제품은 공식 사이트에서 수동 설치합니다. Dev는 Core를 포함하지 않는 추가 묶음입니다.

### 3. [개발 환경](docs/02-development.md)과 [프로젝트 복원](docs/03-projects.md) 진행

명령 블록마다 **Windows PowerShell / WSL Bash / Mac** 실행 위치가 다릅니다. 섞지 마세요. Node와 Python은 기본적으로 WSL 안에 설치하고 Windows PATH와 혼합하지 않습니다.

### 4. [데이터·계정 이전](docs/04-data-security.md)

소스는 GitHub에서 새로 받고, 미커밋 작업과 업무 문서는 별도 암호화 백업합니다. `.env`, 인증서, SSH 개인키, 브라우저 프로필, Aside 전체 폴더는 GitHub에 올리지 않습니다.

### 5. [자동화 전환](docs/05-automation.md) 및 [최종 체크리스트](docs/06-verification.md)

업무·개발·백업·자동화가 모두 확인될 때까지 기존 맥을 초기화하지 않습니다. 루틴 중복 실행도 막아야 합니다.

## 문서 구성

- [01 앱 대응표와 맥 같은 사용감](docs/01-apps.md)
- [02 WSL2·Docker·Node·Python 설치](docs/02-development.md)
- [03 실제 프로젝트별 복원](docs/03-projects.md)
- [04 데이터·계정·인증서·보안](docs/04-data-security.md)
- [05 Aside·카카오톡·맥 전용 자동화](docs/05-automation.md)
- [06 완료 검증·문제 해결·되돌리기](docs/06-verification.md)
- [설치 보조 스크립트](scripts/Install-WindowsApps.ps1): 기본은 미리보기, 명시적으로 실행할 때만 설치.
- [Windows 상태 점검](scripts/Test-WindowsSetup.ps1): 읽기 전용, 비밀번호·토큰·파일 내용을 읽지 않음.
- [조사 근거와 한계](inventory/mac-observed.md)
- [공식 자료](docs/07-sources.md)
- [08 Orca·Aside 환경설정 가져오기](docs/08-agent-settings.md)
- [실제 설정 프로필](profiles/README.md)

## 이번 작업에서 하지 않은 것

새 PC 원격접속, 실제 설치, 데이터 이동, 서버 키 등록, 배포, DB 변경, 루틴 이전·재개·중지, 맥 초기화는 하지 않았습니다. 스크립트는 맥에서 구문·정적 검사했으며 Windows 실제 설치 시험은 아직입니다. 이 저장소에는 환경 설명과 새로 작성한 스크립트만 있고 실제 업무 데이터·계정 비밀·전체 설정 백업은 없습니다.

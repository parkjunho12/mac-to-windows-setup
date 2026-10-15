# 07. 공식 자료·참고 링크

조사일: 2026-10-15. 아래는 공식 제품/개발자 문서입니다. 설치 때에는 최신 요구사항을 다시 확인합니다. 현재 Mac 관찰값과 제품의 일반 지원 범위는 구분했습니다.

## Windows / 개발 환경

- WSL 설치: https://learn.microsoft.com/en-us/windows/wsl/install
- WSL 개발 환경: https://learn.microsoft.com/en-us/windows/wsl/setup/environment
- WSL 파일시스템 위치: https://learn.microsoft.com/en-us/windows/wsl/filesystems
- WSL FAQ·CPU 지원: https://learn.microsoft.com/en-us/windows/wsl/faq
- WinGet 설치 명령·정확한 ID·source 선택: https://learn.microsoft.com/en-us/windows/package-manager/winget/install
- WinGet 공식 manifest: https://github.com/microsoft/winget-pkgs
- PowerToys 설치: https://learn.microsoft.com/en-us/windows/powertoys/install
- PowerToys 키 리매핑 제약: https://learn.microsoft.com/en-us/windows/powertoys/keyboard-manager
- Docker WSL 통합·중복 Engine 주의: https://docs.docker.com/desktop/features/wsl/
- Docker Windows 시스템/ARM 요구: https://docs.docker.com/desktop/setup/install/windows-install/
- Docker Desktop 이용 조건: https://docs.docker.com/subscription/desktop-license/
- nvm 공식 저장소·v0.40.8 릴리스: https://github.com/nvm-sh/nvm/releases/tag/v0.40.8
- Cursor Windows 다운로드: https://cursor.com/download
- PostgreSQL pg_dump: https://www.postgresql.org/docs/current/app-pgdump.html

## AI / Mac 전용 도구

- Aside Windows 공식 다운로드: https://aside.com/download
- Claude Code 시스템·Windows/WSL 설치·샌드박스 차이: https://code.claude.com/docs/en/setup
- Codex Windows 지원: https://developers.openai.com/codex/windows
- Codex WSL: https://developers.openai.com/codex/windows/wsl
- Codex 공식 CLI: https://github.com/openai/codex
- kmsg 원개발자 저장소(macOS Accessibility 기반, 카카오 공식 도구 아님): https://github.com/channprj/kmsg
- AppleScript·Apple Events 구조: https://developer.apple.com/library/archive/documentation/LanguagesUtilities/Conceptual/MacAutomationScriptingGuide/HowMacScriptingWorks.html
- iCloud 메모 웹 접근: https://support.apple.com/guide/icloud/set-up-notes-mm8685520792/icloud

## 공식 설치 진입점

- Chrome: https://www.google.com/chrome/
- Microsoft 365: https://www.microsoft.com/microsoft-365
- 한컴: https://www.hancom.com/
- 카카오톡: https://www.kakaocorp.com/page/service/service/KakaoTalk
- Tailscale: https://tailscale.com/download/windows
- Android Studio: https://developer.android.com/studio

## 설치 스크립트의 ID 검증 범위

공식 `microsoft/winget-pkgs`의 각 패키지 디렉터리 존재를 GitHub API로 확인했습니다.

`Google.Chrome`, `Microsoft.PowerToys`, `Tailscale.Tailscale`, `7zip.7zip`, `Microsoft.WindowsTerminal`, `Microsoft.PowerShell`, `Anysphere.Cursor`, `Git.Git`, `GitHub.cli`, `Docker.DockerDesktop`, `VideoLAN.VLC`, `Gyan.FFmpeg`.

패키지 디렉터리 존재는 새 PC의 OS·아키텍처·설치권한·네트워크·라이선스 충족을 보장하지 않습니다. 스크립트는 실행 시에도 `winget show --id ... --exact --source winget`를 먼저 확인합니다.

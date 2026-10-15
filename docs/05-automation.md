# 05. Aside와 macOS 전용 자동화

## 핵심 결론

**Aside Windows 지원은 공식 확인됐지만, 맥에서 쓰는 모든 도구·설정·자동화가 동등하게 동작한다는 뜻은 아닙니다.** 기존 맥을 유지한 채 하나씩 검증하는 것이 안전합니다.

| 현재 요소 | Windows 전환 방법 | 현재 판정 |
| --- | --- | --- |
| Aside 브라우저의 웹사이트 작업 | Windows Aside 설치, 각 사이트 재로그인, 읽기 작업부터 검증 | 제품 Windows 지원 확인, 실제 작업 미검증 |
| AGENTS/SOUL·사용자 스킬의 순수 문서 | 개인정보·비밀 제거 후 필요한 부분만 검토/이전 | 파일별 검토 필요, 본 작업에서는 실제 설정 미이전 |
| Aside 메모리·프로젝트·루틴·과거 세션 | 제품의 지원 동기화/이전 방식 확인, 일부 항목만 재구성 | 로그인만으로 모두 이전되는지 미확인 |
| kmsg/kmsg-upstream 카카오톡 수집 | 기존 맥 유지, Windows 재구현 또는 승인된 다른 수집 경로 별도 검토 | macOS Accessibility 기반. 그대로 실행 불가 |
| AppleScript / osascript / System Events / cliclick | Windows용 UI Automation·PowerShell 등으로 개별 재설계 | 자동 변환 불가, 별도 개발 |
| Apple Notes 직접 읽기 | iCloud 웹 접근 또는 문서 내보내기, 자동화 별도 구현 | 웹 접근과 기존 자동화는 다름 |
| launchd / LaunchAgents / plist | 지원되는 앱 루틴 또는 Windows Task Scheduler | 스케줄·로그·재시도·실행계정 재설정 |
| Mac 전용 PDF/영상·폰트 경로 | WSL 도구나 Windows 실행 파일로 경로 변경 | 원본 출력과 대조 필요 |
| HWP 생성 스킬의 로컬 바이너리 | HWP 도구·템플릿·폰트의 Windows/WSL 호환 검토 | 현재 번들 실행 파일 호환 미확인 |
| 에이전트 권한·sandbox 예외 | Windows 기본 보호에서 시작, 필요한 범위만 승인 | Mac의 sandbox-off 설정 이식 금지 |

## 특히 수정해야 할 경로·명령

- `/Users/mac/...` → Windows `%USERPROFILE%\...` 또는 WSL `/home/<user>/...`.
- `/opt/homebrew/bin/...` → WSL 패키지/버전 관리자 경로.
- Mac `.app` 내부 실행 파일 → Windows `.exe` 또는 Linux 실행 파일.
- `open` → Windows `Start-Process` 또는 WSL `explorer.exe` 등 용도별 변경.
- `pbcopy/pbpaste` → Windows 클립보드 기능, WSL 연동은 별도 확인.
- `launchctl` → Task Scheduler/제품 지원 루틴.
- `xattr`, `sw_vers`, Apple Events/TCC 권한 처리는 Windows 개념으로 재설계. Mac quarantine 우회 절차를 Windows 보안 해제로 바꾸지 않음.
- 모든 텍스트 치환을 일괄 수행하지 않음. 각 스킬이 실행하는 OS·경로·의존성·로그인·권한을 개별 시험.

## 요양원 루틴 전환 순서

조사 당시 데일리 브리핑은 active, 아침 대조와 주간 점검은 paused였습니다. 자세한 시점 상태는 [조사 기록](../inventory/mac-observed.md)을 봅니다. **paused를 새 PC 설정 중 자동으로 재개하면 안 됩니다.** active 역시 성공적으로 수집됐다는 의미는 아닙니다.

1. Windows에 Aside 설치·로그인. 기존 프로젝트·루틴이 나타나는지, 실제 어느 기기에서 실행되는지 제품 상태 확인.
2. 처음에는 Windows 쪽 자동 실행을 만들지 않고 케어포/admin 읽기 테스트만 수행.
3. 스킬별 의존성 확인: 브라우저 전용 / WSL / Windows native / macOS 전용으로 분리.
4. kmsg 의존 카카오톡 브리핑은 현재 맥에서 유지. Windows 카카오톡을 설치했다고 CLI 수집까지 된 것으로 처리하지 않음.
5. 필요한 경우 Mac에서 읽기 전용 수집한 결과를 승인된 방식으로 전달하는 중간 구성을 검토. 개인정보가 있어 GitHub 경유 금지. 이 중간 구성은 아직 구현하지 않음.
6. 캘린더·스케줄은 Asia/Seoul, 절전·잠금·앱 로그아웃 상태에서 검증. Task Scheduler로 로그인 화면/잠금을 우회하지 않음.
7. 동일 날짜·대상에 대해 결과와 로그를 대조. 수집 실패를 '새 내용 없음'으로 보고하지 않음.
8. 중복 게시·중복 청구·중복 기록저장을 막기 위해 루틴당 실행 호스트를 하나로 지정. 계정 동기화로 기존 루틴이 양쪽에서 실행될 가능성부터 확인.
9. 전환 승인 후에만 기존 실행을 중지하고 새 실행을 활성화. 며칠간 정상 동작과 실패 알림을 확인한 뒤 맥 철수 여부 결정.

이 문서는 전환 계획입니다. 루틴 저장·이전·재개·중지 또는 실제 기록 수정은 하지 않았습니다.

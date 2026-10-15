# 01. 앱 대응표와 맥 같은 사용감

## 가장 먼저: 업무와 기본 도구

| 현재 Mac에서 확인 | Windows에서 사용할 것 | 우선순위·주의 |
| --- | --- | --- |
| Aside.app | [Aside Windows](https://aside.com/download) | 필수. 새로 설치·로그인. Mac 전용 도구까지 동일하다는 뜻은 아님 |
| Google Chrome | Chrome Windows | 필수. 본인 계정의 동기화 항목을 선택, 회사·개인 프로필 분리 |
| KakaoTalk | 카카오톡 Windows | 필수. PC 인증·대화 복원 가능 범위 직접 확인. Mac 로컬 DB 복사 금지 |
| Hancom Office HWP | Windows용 한컴오피스 | 필수. HWP 편집·인쇄·보안모듈 검사, Mac 라이선스 재사용 여부 확인 |
| Word / Excel / PowerPoint | Microsoft 365 Windows | 필수. 계정 구독 확인, 매크로·폰트·인쇄 레이아웃 점검 |
| Tailscale | Tailscale Windows | 필수. 기존 조직 계정 로그인, 공유 PC 여부에 따라 접근 통제 |
| Cursor | Cursor Windows | 개발 필수. 설정 동기화 또는 검토 후 일부 설정 이전, WSL 원격 연결 검증 |
| iTerm2 + zsh + Homebrew | Windows Terminal + WSL Bash + apt/nvm | 개발 필수. Homebrew 경로·Mac 바이너리는 가져오지 않음 |
| Spectacle | Windows Snap + PowerToys FancyZones | 권장. 창 배치와 화면 분할 |
| Spotlight | Windows 검색 또는 PowerToys Run/Command Palette | 권장. 사용할 런처 하나를 선택, 단축키 충돌 점검 |
| Finder / Preview | 탐색기 / Edge PDF·사진 앱·필요 시 Acrobat | 기본 대체. PDF 편집은 별도 제품 |
| Keychain / Apple Passwords | 기존 암호 관리자 또는 iCloud Passwords 지원 경로 | 자동이전 아님. 내보낸 비밀번호 CSV를 GitHub에 넣지 않음 |

## 프로젝트와 필요에 따라 설치

| 현재 Mac에서 확인 | Windows 대응 | 선택 기준 |
| --- | --- | --- |
| Docker Desktop | Docker Desktop Windows, WSL2 통합 | 개발 컨테이너. 회사 사용 라이선스 조건 검토 |
| PostgreSQL 14/15 | 프로젝트별 Docker PostgreSQL 또는 WSL PostgreSQL | 로컬 15가 실행 중인 것을 확인. 데이터는 논리 백업·복원 |
| Claude.app / Claude Code | Claude Windows / WSL Claude Code | 데스크톱과 CLI는 별개. CLI는 WSL 중심으로 구성 |
| Codex CLI | WSL Codex CLI, 필요 시 native Windows | 공식 Windows 지원 존재. 이 가이드는 프로젝트 위치에 맞춰 WSL 선택 |
| Slack / Zoom / WeChat / WhatsApp / Todoist | 각 제품 Windows 버전 | 실제 쓰는 것만 설치, 새 기기 로그인 확인 |
| OneDrive | Windows OneDrive | 동기화 완료·오프라인 보관 확인. Git 작업 폴더 동기화는 피함 |
| CapCut / Audacity / Movavi / VLC | 각 제품 Windows 버전 | 영상·오디오 작업 때. 프로젝트 미디어 링크와 라이선스 재연결 |
| FFmpeg / Tesseract / Pandoc / Ghostscript | WSL 패키지 또는 필요한 Windows 버전 | 문서·영상 자동화 때. 실행 위치와 폰트 경로 변경 |
| Android Studio | Windows Android Studio | Android SDK·AVD 새 설치. 에뮬레이터는 Windows 쪽 실행 |
| IntelliJ / PyCharm | 해당 Windows 버전 | Cursor와 중복 필요성 확인 |
| Zotero / Mendeley | Windows 버전 | 계정 동기화·첨부파일 별도 확인 |
| MATLAB / TeX / Webots / Packet Tracer / Wireshark | 제품별 Windows 버전, TeX는 MiKTeX/TeX Live | 연구 작업 시에만. 플러그인·라이선스·GPU 별도 점검 |
| AnyDesk / VPN 앱 | 조직에서 승인한 Windows 버전 | 필요할 때만. VPN 여러 개 동시 실행 피함 |
| Sourcetree | Windows Sourcetree 또는 Cursor Git | 선택. GitHub CLI와 역할 다름 |
| 은행·공공기관 보안모듈 | 해당 업무사이트가 안내하는 Windows 모듈 | Mac의 AhnLab·AnySign·Veraport 등을 복사하지 않음 |
| Apple Notes / Safari / Notability | iCloud 웹·Chrome·Windows 지원 문서 도구 | 완전한 1:1 대체 아님. 메모·첨부·서식·자동화는 별도 검증 |

기존 설치는 사용 빈도 증거가 아닙니다. 위의 선택 도구를 전부 설치할 필요는 없습니다.

## 익숙한 조작으로 맞추기

- 복사·붙여넣기·실행취소: `Cmd+C/V/Z` → `Ctrl+C/V/Z`.
- 앱 전환: `Cmd+Tab` → `Alt+Tab`. 창 전환 방식은 다름.
- 화면 캡처: `Cmd+Shift+4` → `Win+Shift+S`.
- 파일 검색: `Cmd+Space` → `Win` 검색 또는 선택한 PowerToys 런처 단축키.
- 작업 보기·가상 데스크톱: `Win+Tab`, `Win+Ctrl+←/→`.
- 창 분할: `Win+←/→`, `Win+Z` 또는 FancyZones.
- 터미널 복사·붙여넣기: `Ctrl+Shift+C/V`. `Ctrl+C`는 실행 중 명령 중단일 수 있음.
- 한영 전환: Windows 언어·키보드 설정에서 한영키/오른쪽 Alt와 실제 키보드 배열을 확인. Mac 키보드면 Windows·Alt 위치를 먼저 확인.
- 탐색기에서 **파일 확장명 표시** 활성화. 숨김 파일은 필요 시 표시.
- 트랙패드 스크롤 방향·멀티모니터 배율·기본 다운로드 폴더를 조정.

PowerToys Keyboard Manager로 일부 키만 바꿀 수 있지만 **Alt/Win/Ctrl 전체 교환은 기본 권장하지 않습니다.** 로그인 화면·관리자 창에는 적용되지 않거나 앱 단축키와 충돌할 수 있습니다.

## 업무사이트 점검

Chrome과 Aside 각각에서 필요한 계정으로 로그인합니다. 케어포·admin·희망이음·사회복무포털·교육사이트의 조회, 파일 다운로드, 팝업, HWP/PDF 출력, 인증서 선택을 확인합니다. 테스트를 위해 실제 청구·제출·기록저장을 누르지 않습니다. 복합기 드라이버와 스캐너 프로그램은 제조사 Windows 버전으로 새 설치합니다.

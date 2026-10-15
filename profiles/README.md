# Orca·Aside 실제 환경설정 가져오기

2026-10-15의 **실제 맥 설정에서 선별 추출한 값**입니다. 단순 설치 목록이 아닙니다. 저장소가 공개되어 있으므로 로그인·계정·개인정보·업무 내용은 포함하지 않습니다.

## 들어 있는 것

- [aside.preferences.json](aside.preferences.json): 컨텍스트 압축, 재시도, 후속 요청, 새 탭 세션, 알림, 완료음, 시간대, 메모리 동작 등 **10개 설정 그룹**. 기본 모델·카테고리는 별도 참고 항목.
- [orca.preferences.json](orca.preferences.json): 현재 `profile-state.db`에서 읽은 테마·언어·글꼴·편집기·터미널·diff·에이전트 표시 등 **40개 항목**. Windows 글꼴 대체값 포함.
- [Aside 적용 도우미](../scripts/Apply-AsidePreferences.repl.js): Windows Aside REPL에서 미리보기 후 허용된 설정만 API로 병합·읽기 확인. 기본 미리보기, 실패 시 변경분 복원 시도.
- [Mac 추출 도구](../scripts/Export-PortablePreferences.mjs): 재사용 가능한 허용 목록 방식. 원본 설정을 수정하지 않고 새로운 폴더에만 내보냄.
- [자세한 가져오기 순서](../docs/08-agent-settings.md).

## Windows에서 가장 쉬운 시작

이 저장소를 ZIP으로 받아 압축을 푼 뒤 **새 Windows PC의 Aside**에 아래처럼 요청합니다. 저장한 폴더 위치를 함께 알려주세요.

> 이 폴더의 profiles/README.md와 docs/08-agent-settings.md를 읽고 Orca·Aside 환경설정을 옮겨줘. Aside는 Apply-AsidePreferences.repl.js로 변경 목록을 먼저 보여주고 내가 확인하면 적용해줘. 모델은 로그인 후 현재 사용 가능한 목록에서 맞춰줘. Orca는 프로필 JSON의 값을 공식 설정 화면에 반영하되 Windows 글꼴·프로젝트 실행환경을 구분하고, DB나 전체 설정 파일은 덮어쓰지 마. 계정 로그인·업무 데이터·루틴은 자동 이전하지 마.

이 요청문을 붙이는 것만으로 파일 접근이나 설치가 끝나는 것은 아닙니다. 새 PC Aside가 로컬 폴더를 읽고 필요한 앱에 접근할 수 있어야 합니다.

## 자동 적용과 수동 적용의 차이

- **Aside:** 지원 API를 통한 설정 적용 도우미 제공. 이 맥에서는 모의 테스트만 했고 새 PC 실제 적용은 아직입니다.
- **Orca:** 일반 환경설정 파일의 공식 import API/명령은 확인되지 않아 **값 묶음 + 공식 설정 화면 적용** 방식입니다. `orca settings import` 같은 존재 미확인 명령을 만들지 않았습니다.
- 전체 설정·대화 기록·사용자 스킬·메모리·작업 폴더·SSH는 이 묶음에 포함되지 않습니다. 전체 이전이 끝났다고 보고하지 마세요.

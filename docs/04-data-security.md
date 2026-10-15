# 04. 데이터·계정·인증서 이전

## 분류가 먼저

### 새로 설치하거나 로그인할 것

앱, OS별 개발 도구, 브라우저, 확장, Windows 드라이버, SSH 키, GitHub·Google·Microsoft·Claude·OpenAI·Aside·Tailscale 계정. 앱 설치는 로그인·라이선스 활성화 완료가 아닙니다.

### 별도 안전하게 옮길 것

- 업무 문서·계약·회계·홍보 원본·사진/영상·문서 템플릿·폰트 라이선스.
- GitHub에 없는 소스·미푸시 커밋·미커밋/미추적 파일.
- `.env`, API 키, 인증서, Android 서명키 등은 **비밀자료 전용 암호화 경로**.
- 로컬 DB는 아래처럼 논리 백업. 데이터디렉터리·Docker 볼륨·Mac 앱 캐시를 복제하지 않음.
- Apple Notes의 필요한 메모·첨부. iCloud 계정 메모는 웹에서 접근 가능하나 '나의 Mac' 로컬 메모나 기존 AppleScript 접근까지 보장되지는 않음.

### 그대로 복사하지 않을 것

`/Applications`, Homebrew Cellar, `/opt/homebrew`, `node_modules`, `.venv`, 브라우저 프로필/쿠키, 키체인 DB, 전체 `.aside`, `.claude`, `.codex`, `Library`, `.ssh`, 인증 토큰, Mac `.dmg/.app`, AVD/에뮬레이터 이미지.

이 폴더들에 이력·설정·비밀이 혼재합니다. 필요한 문서·검토한 규칙 파일만 선별하고 프로그램은 재설치합니다.

## 데이터 전송 권장

- 암호화 외장 저장장치 또는 승인된 암호화 전송 경로를 사용. Mac/Windows 공용 파일시스템과 **양쪽에서 복호화 가능한 암호화 방식**을 미리 시험합니다. APFS 전용 암호화 볼륨은 Windows에서 바로 열리지 않을 수 있습니다.
- OneDrive 등을 쓰면 업무 개인정보의 조직 허용 범위와 계정 소유를 먼저 확인. 동기화 완료 후 새 PC 오프라인에서도 파일이 열리는지 확인합니다.
- 일반 개인 GitHub 저장소를 어르신·직원 개인정보 백업 장소로 쓰지 않습니다. **Private여도 비밀 백업용이 아닙니다.**
- RDP 공유폴더를 통한 Mac→Windows 복사도 가능하지만 새 PC의 접속 가능·폴더 리디렉션을 확인한 뒤 사용합니다. 이 작업에서 연결이나 전송은 하지 않았습니다.
- 백업은 접근 제한하고, 개수·크기·중요 파일 해시와 실제 열림을 비교합니다. USB 포맷·기존 자료 삭제는 복원 확인 전 금지.

Mac 해시 예시와 Windows 대응(각 OS에서 동일 파일을 대상으로):

```bash
# Mac
shasum -a 256 '<file>'
```

```powershell
# Windows
Get-FileHash -Algorithm SHA256 '<file>'
```

원본과 SHA256 값이 같으면 해당 파일 바이트가 동일합니다. 이것만으로 전체 폴더·앱 동작 복원이 입증되는 것은 아닙니다.

## 계정·암호·인증서

- 암호 관리자 또는 제품 동기화를 우선 사용. 비밀번호를 CSV로 평문 내보내는 방식은 피하고, 불가피하면 암호화 임시 저장 후 가져오기 검증·폐기.
- Microsoft/Google의 새 기기 인증·복구 수단·패스키를 점검. Mac 전용 로컬 패스키가 Windows에 자동 이전된다고 가정하지 않음.
- Chrome 동기화와 Aside 웹 로그인은 서로 별개. 금융·업무사이트의 세션은 새로 인증합니다.
- 공동·금융인증서는 발급기관의 공식 가져오기/재발급 기능 사용. 인증서 암호·OTP·보안카드·주민번호는 GitHub/문서/채팅에 쓰지 않습니다.
- 한컴·Microsoft 365·Movavi·MATLAB 등은 제품별 Windows 사용권·기기 수 확인. Mac 사용권을 곧바로 해제하지 않습니다.
- 공유 PC에는 사용자별 Windows 계정, 자동 잠금, Windows Hello, 승인된 디스크 암호화 적용. 복구키는 장치와 다른 안전한 곳에 보관.
- SSH는 새 기기용 공개키를 필요한 서버에만 등록. Mac의 모든 키를 복사하지 않습니다. 운영서버 접근 권한은 별도 확인.
- Tailscale은 기존 계정으로 로그인하고 새 장치가 승인됐는지 확인. 가입키를 저장소에 넣지 않습니다. RDP 3389를 인터넷 공유기에 포트포워딩하지 않습니다.

## PostgreSQL 이전

조사 시점 Mac PostgreSQL 15가 실행 중입니다. **DB 이름·데이터·백업 필요 여부는 아직 조사하지 않았습니다.** 필요한 로컬 DB와 권한을 확인한 뒤, 로컬용 DB만 별도 백업합니다.

예시 템플릿이며 그대로 실행할 값이 아닙니다:

```bash
# Mac, 소스 PostgreSQL과 호환되는 pg_dump 사용. 비밀번호는 명령줄에 적지 않음.
pg_dump -Fc -h <source-host> -U <source-user> -d <source-db> -f <encrypted-backup-location>/local.dump

# WSL 또는 개발용 DB 컨테이너: 대상은 반드시 비운 새 로컬 DB
pg_restore --no-owner --no-acl -h <local-host> -U <local-user> -d <new-local-db> <local.dump>
```

- pg_dump major는 소스 서버보다 오래된 버전을 쓰지 않음. 같은 major로 옮기는 것을 우선.
- 앱 role·extension(pgvector 등)·시퀀스·문자 인코딩·타임존·행 수·주요 조회를 확인.
- `pg_dump` 한 DB는 클러스터 역할·다른 DB까지 백업하지 않음. 필요한 역할은 최소 권한으로 새 구성.
- 운영 DB에 restore하지 않고 `--clean`/reset 명령도 기본 사용하지 않음.
- 실제 개인정보가 든 dump는 이 저장소에 절대 넣지 않음.

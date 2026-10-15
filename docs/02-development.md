# 02. Windows + WSL2 개발 환경

## 0. 새 PC부터 확인

Windows 설정 → 시스템 → 정보에서 Windows 11, Home/Pro, x64/ARM64, 메모리·디스크 여유를 확인합니다. 작업 관리자 → 성능 → CPU의 가상화 상태도 확인합니다. WSL2는 Home에서도 가능하지만 **Windows 기본 RDP 서버로 접속받는 용도는 Pro 이상 여부를 확인**해야 합니다.

ARM64도 WSL 자체는 지원합니다. 다만 Docker Windows ARM 버전, npm 네이티브 모듈, 보안모듈, Android 에뮬레이터 등의 지원은 각각 검증해야 합니다. 이 저장소의 앱 자동 설치는 x64에 한정합니다.

메모리·CPU를 아직 모르므로 `.wslconfig`의 메모리 제한을 임의로 지정하지 않습니다.

## 1. Windows PowerShell: WSL 설치

관리자 PowerShell에서:

```powershell
wsl --install -d Ubuntu-24.04
```

안내가 나오면 재시작합니다. Ubuntu를 열어 Linux 사용자·비밀번호를 만듭니다. 이 암호는 Microsoft 계정·Windows PIN과 별개입니다.

다시 PowerShell에서:

```powershell
wsl --update
wsl --status
wsl -l -v
```

`Ubuntu-24.04`가 VERSION **2**인지 확인합니다. 배포판 이름이 다르면 이후 명령에서 실제 이름을 사용합니다. 1인 경우에만 `wsl --set-version Ubuntu-24.04 2`로 전환합니다.

## 2. WSL Ubuntu Bash: 공통 도구

이후 Linux 명령은 Windows PowerShell이 아니라 **Ubuntu 터미널**에서 실행합니다.

```bash
sudo apt update
sudo apt install -y build-essential git curl ca-certificates unzip zip \
  python3 python3-venv python3-pip libpq-dev pkg-config gh
mkdir -p ~/src
```

파일은 `/home/<linux-user>/src`에 둡니다. OneDrive 안이나 `/mnt/c/Users/...`에 Node 프로젝트를 두지 않는 구성을 기본으로 합니다. 탐색기에서는 `\\wsl$` 또는 Ubuntu에서 `explorer.exe .`로 접근합니다. WSL 내부 파일을 AppData의 배포판 저장소 경로에서 직접 편집하지 않습니다.

문서·영상 자동화가 필요할 때만:

```bash
sudo apt install -y ffmpeg tesseract-ocr tesseract-ocr-kor pandoc \
  poppler-utils ghostscript fonts-noto-cjk
```

HWP 편집·은행 보안모듈은 WSL 패키지로 대체하지 않고 Windows 앱에서 처리합니다.

## 3. WSL Bash: Node 22와 24 분리

Homebrew Node를 복사하지 않고 nvm으로 Linux Node를 설치합니다. 아래 nvm 태그는 조사 시점 공식 최신 릴리스입니다. 원격 설치 코드를 바로 실행하는 대신 태그를 고정해 가져오고 검토합니다.

```bash
# ~/.nvm이 이미 있으면 덮어쓰지 말고 기존 설치를 확인
if [ ! -e "$HOME/.nvm" ]; then
  git clone --branch v0.40.8 --depth 1 https://github.com/nvm-sh/nvm.git "$HOME/.nvm"
fi
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm install 22
nvm install 24
nvm alias default 22
nvm use 22
node --version
npm --version
command -v node
```

새 터미널에서도 쓰려면 `~/.bashrc`에 다음을 **한 번만** 추가합니다.

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

프로젝트에 `.nvmrc`가 있으면 해당 폴더에서 `nvm install && nvm use`. SeeON 관련 프로젝트는 Node 24를 사용합니다. 다른 프로젝트는 engines·CI·README를 확인하고 기본 22에서 검증합니다. 버전 조건이 없다는 이유로 22 호환을 확정하지 않습니다.

pnpm 고정 프로젝트는 Node 24를 선택한 다음:

```bash
nvm use 24
npm install -g pnpm@10.32.1
pnpm --version
```

nvm의 전역 npm 패키지는 Node 버전별로 다를 수 있습니다. npm prefix를 Mac의 Aside 런타임 경로로 설정하지 않습니다. `sudo npm install -g`도 사용하지 않습니다.

## 4. WSL Bash: Python

Ubuntu 24.04의 기본 Python은 3.12 계열입니다. 프로젝트의 `requires-python`·Dockerfile·CI를 먼저 확인합니다. Mac에 설치된 최신 Python 3.14를 모든 프로젝트에 강제하지 않습니다.

```bash
cd ~/src/<project>
python3 --version
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
# requirements.txt가 실제 있는 프로젝트에서만:
python -m pip install -r requirements.txt
```

`pyproject.toml`/`uv.lock` 기반이면 해당 프로젝트 방식과 요구 Python 버전에 맞춥니다. 다른 버전이 필요하면 pyenv/uv 등 버전 관리자를 별도 도입합니다. `.venv`, Conda 환경 폴더, Mac wheel은 복사하지 않습니다.

## 5. Docker Desktop: Windows에서 설치, WSL에서 사용

앱 스크립트의 Dev 묶음 또는 공식 사이트로 Docker Desktop을 설치합니다. 회사 사용의 구독 조건을 먼저 확인합니다. WSL을 업데이트하고 Docker Desktop을 실행한 뒤:

1. Settings → General → **Use the WSL 2 based engine**.
2. Settings → Resources → WSL Integration → `Ubuntu-24.04` 활성화.
3. Linux containers 모드인지 확인.
4. WSL 터미널에서 아래 명령 확인.

```bash
docker version
docker compose version
```

**Docker Desktop 통합을 쓸 때 WSL 안에 별도 `docker.io`/Docker Engine을 중복 설치하지 않습니다.** Docker 최소 WSL 요구는 2.1.5이며 최신 안정 버전 권장입니다. Windows ARM 다운로드는 조사 시점 Early Access여서 별도 검증합니다.

프로젝트 compose가 있으면 그것을 우선 사용합니다. Postgres는 프로젝트 요구 major 버전으로 맞추고, 호스트에 무조건 14와 15를 모두 설치하지 않습니다. 로컬용 계정·포트를 사용하고 운영 DB URL을 재사용하지 않습니다. 외부 노출이 불필요하면 포트 바인딩을 `127.0.0.1`로 제한합니다.

## 6. Cursor / Git / SSH

- Cursor는 Windows에 설치. 해당 버전의 WSL 원격 연결 기능·확장을 이용해 WSL의 `~/src`를 엽니다. 창이 WSL 컨텍스트인지 확인합니다.
- Cursor 통합 터미널에서 `uname -s`가 Linux, `command -v node`가 WSL nvm 경로인지 확인. Windows Node나 Mac `/Users/mac`가 나오면 먼저 수정합니다.
- Cursor에서 WSL 연결이 안 되면 Windows VS Code + 공식 WSL 확장을 검증용 대안으로 사용합니다. 확장 ID와 동작을 임의로 동일하다고 가정하지 않습니다.
- 설정 동기화로 편집 설정·키맵만 복원. `darwin-arm64` 확장 폴더를 복사하지 말고 각 OS/WSL 대상에 새 설치합니다.
- 우선 확장: 한국어, Python, Python 타입 검사, Prettier, Remote SSH, 필요한 Docker/Jupyter. Cursor 내장 기능과 중복되는 확장은 확인 후 설치합니다.

WSL Git 설정은 새 환경에 명시합니다.

```bash
git config --global user.name 'Junho Park'
git config --global user.email 'ghdlwnsgh25@gmail.com'
git config --global core.autocrlf input
# 실제 clone한 저장소의 .gitattributes를 우선 존중
gh auth login --hostname github.com --git-protocol https --web
gh auth setup-git
gh auth status
```

Windows GitHub 로그인과 WSL GitHub 로그인은 별개일 수 있습니다. 조직 `Park-Koh`·`SeniorAILab`의 접근/SSO도 확인합니다. SSH 서버 접속은 WSL 안에서 새 기기 키를 만들고 공개키만 서버에 등록합니다. 기존 개인키·SSH config 전체를 저장소에 올리지 않습니다.

## 7. AI 개발 CLI

**권장 실행 위치는 프로젝트와 같은 WSL**입니다. Windows native 지원이 없어서가 아니라 Linux 개발 도구와 경로를 일치시키기 위함입니다.

Claude Code는 공식 설치 스크립트를 파일로 내려받아 검토한 후 실행합니다.

```bash
curl -fsSL https://claude.ai/install.sh -o /tmp/claude-install.sh
less /tmp/claude-install.sh
bash /tmp/claude-install.sh
export PATH="$HOME/.local/bin:$PATH"
claude --version
claude doctor
```

Codex는 선택한 nvm Node에서:

```bash
nvm use 22
npm install -g @openai/codex
codex --version
```

각 도구를 처음 실행해 본인 계정으로 새 로그인합니다. Mac의 인증 토큰·키체인·auth.json을 복사하지 않습니다. Node 24 터미널에서 Codex가 없으면 버전별 설치 위치를 확인합니다.

native Windows Claude Code/Codex도 공식 지원됩니다. 다만 파일 위치·셸·권한·샌드박스가 다르므로 WSL 설치와 혼용하지 않습니다. Mac에서 사용한 권한 예외나 sandbox-off 설정도 자동 이식하지 않습니다.

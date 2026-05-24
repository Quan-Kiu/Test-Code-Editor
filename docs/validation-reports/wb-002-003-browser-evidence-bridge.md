# Browser Evidence Report

Status: partial
Generated: 2026-05-23T11:14:15.533Z
Project type: game,web3d
Normal URL: http://bridge.invalid/
Debug URL: not_run
Browser mode: headed
Localhost direct: blocked_in_chromium; upstream confirmed by server probe
Bridge used: yes
App source: real Vite preview server via CDP/fetch content bridge (http://127.0.0.1:4173); exact HTML/CSS/JS response bytes injected because navigation is blocked
Human playtest request allowed: no

## Summary

| Route | Viewport | Status | Screenshot | Component shots | Keyboard probe | Console errors | Network failures | Visible dev selectors | Forbidden player text | 3D diagnostics |
|---|---|---|---|---:|---|---:|---:|---:|---|---|
| player | desktop 1440x900 | partial | docs/validation-reports/wb-002-003-bridge-screenshots/player-desktop-1440x900.png | 7 | fail | 0 | 0 | 0 | no | canvas=1; size=1440x900; webgl=true; webgpu=false; context=WebGL2RenderingContext; glError=0; fallback=false; renderMode=webgl; ready=true |

## Details

### player - desktop 1440x900

- URL: http://bridge.invalid/
- Status: partial
- Screenshot evidence path: docs/validation-reports/wb-002-003-bridge-screenshots/player-desktop-1440x900.png
- Viewport coverage: 1440x900
- Screenshot review: required. Open the full-route and component screenshots and record observations in the screenshot review log from docs/browser-interaction-qa.md.
- Human-level composition review: required. Complete docs/composition-qa.md checks for first read, component rhythm, spatial balance, center-content preservation, visual dominance, visual noise, and user/player comprehension.
- Functional pass / composition fail: not_reviewed until the composition table is filled from screenshot inspection.
- Design comparison: required when DESIGN.md, docs/design-brief.md, mocks, or story design references exist.
- Console and network review: console clean; network clean.
- Keyboard focus probe: fail; screenshot=not_captured

#### Component/state screenshots

| Kind | Label | State | Evidence | Status | Notes |
|---|---|---|---|---|---|
| shell-main | Wobble Buddies Playground application | base | docs/validation-reports/wb-002-003-bridge-screenshots/components/player-desktop-01-shell-main-wobble-buddies-playground-application-base.png | pass |  |
| button | ▶ Play Solo Take on the playground. | base | docs/validation-reports/wb-002-003-bridge-screenshots/components/player-desktop-02-button-play-solo-take-on-the-playground-base.png | pass |  |
| button | ▶ Play Solo Take on the playground. | hover | docs/validation-reports/wb-002-003-bridge-screenshots/components/player-desktop-02-button-play-solo-take-on-the-playground-hover.png | pass |  |
| button | ▶ Play Solo Take on the playground. | focus | docs/validation-reports/wb-002-003-bridge-screenshots/components/player-desktop-02-button-play-solo-take-on-the-playground-focus.png | pass |  |
| button | ●● Local Co-op Grab a buddy together. | base | docs/validation-reports/wb-002-003-bridge-screenshots/components/player-desktop-03-button-local-co-op-grab-a-buddy-together-base.png | pass |  |
| button | ●● Local Co-op Grab a buddy together. | hover | docs/validation-reports/wb-002-003-bridge-screenshots/components/player-desktop-03-button-local-co-op-grab-a-buddy-together-hover.png | pass |  |
| button | ●● Local Co-op Grab a buddy together. | focus | docs/validation-reports/wb-002-003-bridge-screenshots/components/player-desktop-03-button-local-co-op-grab-a-buddy-together-focus.png | partial | locator.screenshot: Target page, context or browser has been closed
Browser logs:

<launching> /usr/bin/chromium --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --disable-infobars --disable-search-engine-choice-screen --disable-sync --enable-unsafe-swiftshader --no-sandbox --no-sandbox --disable-dev-shm-usage --ignore-gpu-blocklist --enable-webgl --enable-webgl2 --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --user-data-dir=/tmp/playwright_chromiumdev_profile-jQkLGB --remote-debugging-pipe --no-startup-window
<launched> pid=5391
[pid=5391][err] [5413:5413:0523/111347.030723:ERROR:base/files/file_path_watcher_inotify.cc:923] Failed to read /proc/sys/fs/inotify/max_user_watches
[pid=5391][err] [5412:5412:0523/111347.034419:ERROR:base/files/file_path_watcher_inotify.cc:923] Failed to read /proc/sys/fs/inotify/max_user_watches
[pid=5391][err] [5391:5418:0523/111347.059396:ERROR:base/files/file_path_watcher_inotify.cc:923] Failed to read /proc/sys/fs/inotify/max_user_watches
[pid=5391][err] [5391:5419:0523/111347.060003:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[pid=5391][err] [5391:5419:0523/111347.436650:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5419:0523/111347.436946:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[pid=5391][err] [5391:5419:0523/111347.437650:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[pid=5391][err] [5391:5417:0523/111347.437550:ERROR:net/base/address_tracker_linux.cc:242] Could not bind NETLINK socket: Permission denied (13)
[pid=5391][err] [5391:5419:0523/111347.556766:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111347.641955:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111347.642949:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111347.710508:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111347.726344:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[pid=5391][err] [5391:5391:0523/111347.726509:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111347.726676:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Failed to connect to socket /run/dbus/system_bus_socket: No such file or directory
[pid=5391][err] [5391:5391:0523/111347.791695:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.Properties.GetAll: object_path= /org/freedesktop/UPower/devices/DisplayDevice: unknown error type: 
[pid=5391][err] [5434:5480:0523/111347.814324:ERROR:base/files/file_path_watcher_inotify.cc:923] Failed to read /proc/sys/fs/inotify/max_user_watches
[pid=5391][err] [5391:5419:0523/111347.932756:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5419:0523/111347.932907:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5419:0523/111352.203815:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111352.204093:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111352.204244:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5419:0523/111352.204313:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111352.205111:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5391:0523/111352.205265:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111355.906194:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111355.906544:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111355.906776:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5419:0523/111355.906854:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111355.907002:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5391:0523/111355.907226:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111358.615053:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111358.615612:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111358.615902:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5419:0523/111358.615937:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111358.616404:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5391:0523/111358.616511:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111402.255580:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111402.256038:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111402.256219:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5419:0523/111402.256297:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111402.256788:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5391:0523/111402.256966:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111404.558062:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111404.558549:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111404.558863:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5419:0523/111404.558951:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111404.559330:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5391:0523/111404.559384:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111408.244874:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111408.245312:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111408.245448:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5419:0523/111408.245522:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111408.246005:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5391:0523/111408.246384:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111411.852259:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111411.892386:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111411.892754:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5419:0523/111411.892888:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111411.892924:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5391:0523/111411.893207:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111413.901383:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111413.902018:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5419:0523/111413.902219:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5419:0523/111413.902253:ERROR:dbus/bus.cc:406] Failed to connect to the bus: Could not parse server address: Unknown address type (examples of valid types are "tcp" and on UNIX "unix")
[pid=5391][err] [5391:5391:0523/111413.902511:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391][err] [5391:5391:0523/111413.902540:ERROR:dbus/object_proxy.cc:573] Failed to call method: org.freedesktop.DBus.NameHasOwner: object_path= /org/freedesktop/DBus: unknown error type: 
[pid=5391] <gracefully close start>
Call log:
  - taking element screenshot
  - waiting for fonts to load...
  - fonts loaded
  - attempting scroll into view action
    - waiting for element to be stable
 |

- 3D diagnostics: canvas=1; size=1440x900 client=1440x900; webgl=true; webgpu=false; context=WebGL2RenderingContext; vendor=Google Inc. (Google); renderer=ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver); glError=0; fallbackVisible=false; renderMode=webgl; sceneReady=true.

## Composition review log

Fill this table after opening the captured screenshots. Do not mark UI/browser pass while these fields are TBD/not_reviewed.

| Evidence | Route/state | Viewport | Intended dominance | Actual first read | Component rhythm | Spatial balance | Center-content preservation | Scene visual dominance | Visual noise | Comprehension | Status | Fix direction | Retest |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| docs/validation-reports/wb-002-003-bridge-screenshots/player-desktop-1440x900.png | player | desktop 1440x900 | TBD | TBD | not_reviewed | not_reviewed | not_reviewed | not_reviewed | not_reviewed | not_reviewed | partial | Fill human-level composition review from docs/composition-qa.md | not_run |

## Product-quality role applicability

Classify every role before claiming L2+ UI/game/product-quality pass. Use docs/role-gate-quality-map.md.

| Role | Applicability | Reason | Required evidence or not_applicable reason |
|---|---|---|---|
| Product Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| User Researcher | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Plan Quality Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Tech Lead | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| UX/Interaction Designer | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Visual Design Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Visual/Composition Director | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Frontend/UI Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Content/Copy Reviewer | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Accessibility Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| QA Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Exploratory Tester | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Performance Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Security Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Privacy Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Platform/SRE Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Release Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Agent Context Steward | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Game Design Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Human Playtest Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Support/Ops Reviewer | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| Analytics/Learning Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| 3D/Rendering Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |
| License/Compliance Owner | TBD | TBD | Link screenshot/command/finding or explain not_applicable |

## Product-quality role simulation

Fill this table before claiming L2+ UI/game/product-quality pass. Each active or consulted row needs a concrete concern and evidence, not generic approval.

| Role | Concrete concern | Evidence found | Status | Owner/fix |
|---|---|---|---|---|
| Product Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| User Researcher | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Plan Quality Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Tech Lead | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| UX/Interaction Designer | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Visual Design Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Visual/Composition Director | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Frontend/UI Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Content/Copy Reviewer | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Accessibility Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| QA Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Exploratory Tester | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Performance Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Security Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Privacy Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Platform/SRE Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Release Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Agent Context Steward | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Game Design Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Human Playtest Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Support/Ops Reviewer | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| Analytics/Learning Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| 3D/Rendering Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |
| License/Compliance Owner | TBD | Link screenshot/command/finding or explain not_applicable | partial | Fill from docs/role-thinking-protocols.md |

## Mandatory manual review handoff

This command captures real-browser evidence and non-destructive interaction probes. It does not replace story-specific functional tests, screenshot review, or human-level composition review. Before claiming UI/browser pass, complete the screenshot review log in docs/browser-interaction-qa.md, complete the composition review in docs/composition-qa.md, compare against design references when available, and retest matching screenshots after fixes.

## Game player-facing readiness

Player-facing readiness: fail
Agent self-play in player mode: not_run unless this command is paired with an interaction script or manual step log.
Human playtest request allowed: no

This command checks for visible debug markers in DOM text/selectors and captures screenshots. It cannot inspect visual text rendered inside a canvas; reviewers must still inspect screenshots/frame sequences against DESIGN.md. For web3d projects, missing canvas/WebGL/WebGPU, visible fallback UI, or non-zero WebGL error is failing evidence; scene-ready absence is partial evidence unless another stable-render signal is documented.

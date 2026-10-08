# GNOME Shell 51 validation

## Compatibility

The extension declares GNOME Shell 50 and 51 compatibility. GNOME 50 uses
`Shell.GLSLEffect`; GNOME 51 uses `Clutter.ShaderEffect`. The shared shader adapter
selects the available API and supplies named uniform updates to the effects.
The shader code is appended to Cogl's fragment output on both versions.

References:

- [GNOME Shell 51 porting guide](https://gjs.guide/extensions/upgrading/gnome-shell-51.html)
- [Clutter ShaderEffect API](https://mutter.gnome.org/clutter/class.ShaderEffect.html)

## Local validation, 2026-10-08

Tested on GNOME Shell/Mutter 51.0 with GJS 1.90.0, Wayland, and Intel graphics.
The test used an isolated session bus and temporary XDG data, configuration,
and cache directories. The installed desktop extension was not replaced.

The compositor ran with:

```sh
dbus-run-session -- gnome-shell --wayland --headless \
    --virtual-monitor 1280x800 --wayland-display rounded-test-51 --no-x11
```

Before starting, the temporary data directory contained the compiled extension
under `gnome-shell/extensions/rounded-window-corners@fxgn`, including compiled
schemas and non-TypeScript resources. The temporary configuration enabled the
extension. A temporary test-driver extension permitted Shell evaluation within
this isolated compositor. These test tools are not included in the extension.

Checks:

- TypeScript compilation and Biome CI checks.
- Extension startup and shader rendering on a GTK 4 test window.
- Desktop rounded corners and shadows, checked in a screenshot.
- Live border-width changes and window resizing.
- Overview entry and exit, including rounded previews and shadows.
- Workspace switching in both directions.
- Preferences opened and displayed their controls.
- Window picker returned `org.example.RoundedRuntime` for the test window and
  `window-not-found` for an overview actor.
- Disable removed the window effect; re-enable restored it.

Preferences emitted existing stylesheet-path and Adwaita layout warnings.
The isolated session also emitted desktop-service warnings. These were not
shader failures.

GNOME 50 was not runtime-tested. Its existing declaration and legacy shader API
remain in place. Xwayland, multiple monitors, fractional scaling, and
application-specific shadow clipping were not exercised by this local check.

## Manual regression checklist

Use a disposable nested session or install a build with `just install` and log
back in. For an isolated session, set temporary `XDG_DATA_HOME`,
`XDG_CONFIG_HOME`, and `XDG_CACHE_HOME` before configuring and launching it.

1. Open a window to which rounding applies. Check corners, borders, focused and
   unfocused shadows, resizing, maximizing, and restoring.
2. Enter and leave overview. Check preview corners and shadows.
3. Switch workspaces in both directions with windows present.
4. Open preferences, change corner and border settings, and check the result.
5. Pick a window from preferences and check the selected application.
6. Disable and re-enable the extension. Check that effects and shadows are
   removed and restored, and inspect Shell logs for errors.

/**
 * @file Clips shadows for windows.
 *
 * Needed because of this issue:
 * https://gitlab.gnome.org/GNOME/gnome-shell/-/issues/4474
 */

import {readShader} from '../utils/file.js';
import {createShaderEffect} from './shader_effect.js';

const [declarations, code] = await readShader(
    import.meta.url,
    'shader/clip_shadow.frag',
);

export const ClipShadowEffect = createShaderEffect(
    'ClipShadowEffect',
    declarations,
    code,
);

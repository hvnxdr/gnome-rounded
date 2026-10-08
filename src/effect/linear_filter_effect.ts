/**
 * @file Applies linear interpolation to a window. This is used to make windows
 * in the overview look better.
 */

import type Clutter from 'gi://Clutter';

import Cogl from 'gi://Cogl';
import GObject from 'gi://GObject';

import {createShaderEffect} from './shader_effect.js';

const ShaderEffect = createShaderEffect('LinearFilterShaderEffect', '', '');

export const LinearFilterEffect = GObject.registerClass(
    {},
    class extends ShaderEffect {
        vfunc_paint_target(node: Clutter.PaintNode, ctx: Clutter.PaintContext) {
            this.get_pipeline()?.set_layer_filters(
                0,
                Cogl.PipelineFilter.LINEAR_MIPMAP_LINEAR,
                Cogl.PipelineFilter.LINEAR,
            );
            super.vfunc_paint_target(node, ctx);
        }
    },
);

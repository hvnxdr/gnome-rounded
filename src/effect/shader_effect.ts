/** @file Adapts shader effects to the GNOME 50 and 51 shader APIs. */

import Clutter from 'gi://Clutter';
import Cogl from 'gi://Cogl';
import GObject from 'gi://GObject';
import Shell from 'gi://Shell';

// The project targets GNOME 50 types. GNOME 51 replaces this class's API.
type ModernShaderEffect = Clutter.OffscreenEffect & {
    // biome-ignore lint/style/useNamingConvention: GI method name.
    set_uniform_float: (
        name: string,
        components: number,
        values: number[],
    ) => void;
};
const ModernShaderEffect = Clutter.ShaderEffect as unknown as {
    new (): ModernShaderEffect;
};

type ShaderEffect = Clutter.OffscreenEffect & {
    setUniform: (name: string, values: number[]) => void;
};
type ShaderEffectConstructor = Omit<
    typeof Clutter.OffscreenEffect,
    'prototype'
> & {
    new (): ShaderEffect;
    prototype: ShaderEffect;
};

/** Create a registered base class with shared shader code and named uniforms. */
export function createShaderEffect(
    name: string,
    declarations: string,
    code: string,
): ShaderEffectConstructor {
    if (Shell.GLSLEffect) {
        return GObject.registerClass(
            {GTypeName: name},
            class extends Shell.GLSLEffect {
                readonly #uniforms = new Map<string, number>();

                vfunc_build_pipeline() {
                    this.add_glsl_snippet(
                        Cogl.SnippetHook.FRAGMENT,
                        declarations,
                        code,
                        false,
                    );
                }

                setUniform(name: string, values: number[]) {
                    let location = this.#uniforms.get(name);
                    if (location === undefined) {
                        location = this.get_uniform_location(name);
                        this.#uniforms.set(name, location);
                    }
                    this.set_uniform_float(location, values.length, values);
                }
            },
        ) as unknown as ShaderEffectConstructor;
    }

    return GObject.registerClass(
        {GTypeName: name},
        class extends ModernShaderEffect {
            vfunc_get_static_snippet() {
                // Append to Cogl's existing fragment output, as on GNOME 50.
                return Cogl.Snippet.new(
                    Cogl.SnippetHook.FRAGMENT,
                    declarations,
                    code,
                );
            }

            setUniform(name: string, values: number[]) {
                this.set_uniform_float(name, values.length, values);
            }
        },
    ) as unknown as ShaderEffectConstructor;
}

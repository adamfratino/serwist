import { z } from "zod";
import type {
  WebpackInjectManifestOptions,
  WebpackInjectManifestOptionsComplete,
  WebpackInjectManifestPartial,
  WebpackInjectManifestResolved,
  WebpackPartial,
  WebpackResolved,
} from "../types.js";
import { basePartial } from "./base.js";
import { injectPartial } from "./injectManifest.js";
import { optionalSwDestPartial } from "./swDest.js";

export const webpackPartial = z
  .object({
    chunks: z.array(z.string()).optional(),
    exclude: z
      .array(z.union([z.string(), z.instanceof(RegExp), z.function(z.tuple([z.any()]), z.boolean())]))
      .default([/\.map$/, /^manifest.*\.js$/]),
    excludeChunks: z.array(z.string()).optional(),
    include: z.array(z.union([z.string(), z.instanceof(RegExp), z.function(z.tuple([z.any()]), z.boolean())])).optional(),
    mode: z.string().nullable().optional(),
  })
  .strict("Do not pass invalid properties to WebpackPartial!") satisfies z.ZodType<WebpackResolved, z.ZodObjectDef, WebpackPartial>;

export const webpackInjectManifestPartial = z
  .object({
    compileSrc: z.boolean().default(true),
    swDest: z.string().optional(),
    webpackCompilationPlugins: z.array(z.any()).optional(),
  })
  .strict("Do not pass invalid properties to WebpackInjectManifestPartial!") satisfies z.ZodType<
  WebpackInjectManifestResolved,
  z.ZodObjectDef,
  WebpackInjectManifestPartial
>;

export const webpackInjectManifestOptions = basePartial
  .merge(webpackPartial)
  .merge(injectPartial)
  .merge(optionalSwDestPartial)
  .merge(webpackInjectManifestPartial)
  .strict("Do not pass invalid properties to WebpackInjectManifestOptions!") satisfies z.ZodType<
  WebpackInjectManifestOptionsComplete,
  z.ZodObjectDef,
  WebpackInjectManifestOptions
>;

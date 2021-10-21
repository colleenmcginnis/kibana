/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Logger } from 'src/core/server';
import type { DataRequestHandlerContext } from 'src/plugins/data/server';
import { GEOCENTROID_AGG_NAME, GEOTILE_GRID_AGG_NAME, RENDER_AS } from '../../common/constants';

function isAbortError(error: Error) {
  return error.message === 'Request aborted' || error.message === 'Aborted';
}

export async function getEsGridTile({
  logger,
  context,
  index,
  geometryFieldName,
  x,
  y,
  z,
  requestBody = {},
  requestType = RENDER_AS.POINT,
}: {
  x: number;
  y: number;
  z: number;
  geometryFieldName: string;
  index: string;
  context: DataRequestHandlerContext;
  logger: Logger;
  requestBody: any;
  requestType: RENDER_AS.GRID | RENDER_AS.POINT;
}): Promise<Buffer | null> {
  try {
    const path = `/${encodeURIComponent(index)}/_mvt/${geometryFieldName}/${z}/${x}/${y}`;

    const aggs: Record<string, unknown> = {};

    for (const key in requestBody.aggs[GEOTILE_GRID_AGG_NAME].aggs) {
      if (requestBody.aggs[GEOTILE_GRID_AGG_NAME].aggs.hasOwnProperty(key)) {
        if (key !== GEOCENTROID_AGG_NAME) {
          aggs[key] = requestBody.aggs[GEOTILE_GRID_AGG_NAME].aggs[key];
        }
      }
    }

    const fields = requestBody.fields;
    const body = {
      size: 0, // no hits
      grid_precision: 7,
      exact_bounds: false,
      extent: 4096, // full resolution,
      query: requestBody.query,
      grid_type: requestType === RENDER_AS.GRID ? 'grid' : 'centroid',
      aggs,
      fields,
      runtime_mappings: requestBody.runtime_mappings,
    };
    const tile = await context.core.elasticsearch.client.asCurrentUser.transport.request({
      method: 'GET',
      path,
      body,
    });
    return tile.body as unknown as Buffer;
  } catch (e) {
    if (!isAbortError(e)) {
      // These are often circuit breaking exceptions
      // Should return a tile with some error message
      logger.warn(`Cannot generate ES-grid-tile for ${z}/${x}/${y}: ${e.message}`);
    }
    return null;
  }
}

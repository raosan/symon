/**********************************************************************************
 *                                                                                *
 *    Copyright (C) 2021  SYMON Contributors                                      *
 *                                                                                *
 *   This program is free software: you can redistribute it and/or modify         *
 *   it under the terms of the GNU Affero General Public License as published     *
 *   by the Free Software Foundation, either version 3 of the License, or         *
 *   (at your option) any later version.                                          *
 *                                                                                *
 *   This program is distributed in the hope that it will be useful,              *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of               *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                *
 *   GNU Affero General Public License for more details.                          *
 *                                                                                *
 *   You should have received a copy of the GNU Affero General Public License     *
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.       *
 *                                                                                *
 **********************************************************************************/

import { Prisma } from ".prisma/client";

type query = {
  fields?: string;
  filter?: string;
  limit?: string;
  cursor?: string;
  search?: string;
  sort?: string;
};

type findManyArgs = {
  /**
   * Select specific fields to fetch from the row
   **/
  select?: Record<string, unknown> | null;
  /**
   * Filter, which row to fetch.
   **/
  where?: Record<string, unknown>;
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
   *
   * Determine the order of row to fetch.
   **/
  orderBy?: Record<string, unknown>;
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
   *
   * Sets the position for listing row.
   **/
  cursor?: Record<string, unknown>;
  /**
   * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
   *
   * Take `±n` row from the position of the cursor.
   **/
  take?: number;
};

type generatePrismaArgumentArgs = {
  searchableFields?: Array<string>;
  queryArgs?: query;
};

// generateStatement is generate statement for pagination, search, sort and filter
export function generatePrismaArguments({
  searchableFields,
  queryArgs,
}: generatePrismaArgumentArgs): findManyArgs {
  if (!queryArgs) {
    return {
      take: 10,
    };
  }

  const select = generateField(queryArgs.fields);
  const where = generateWhere(
    queryArgs.filter,
    queryArgs.search,
    searchableFields,
  );
  const orderBy = generateOrder(queryArgs.sort);
  const cursor = generateCursor(queryArgs.cursor);
  const take = generateTake(parseInt(queryArgs.limit ?? "10", 10));

  return {
    ...select,
    ...where,
    ...orderBy,
    ...cursor,
    ...take,
  };
}

function generateField(fields?: string) {
  if (!fields) {
    return {};
  }

  const select = fields
    .split(",")
    .map((field: string) => field.trim())
    .reduce((acc: Record<string, unknown>, curr: string): Record<
      string,
      unknown
    > => {
      acc[curr] = true;

      return acc;
    }, {});

  return { select };
}

function generateTake(take: number) {
  if (isNaN(take)) {
    return {
      take: 10,
    };
  }

  return { take };
}

function generateCursor(cursor?: string) {
  if (!cursor) {
    return {};
  }
  const cursorInt = parseInt(cursor, 10);

  return { skip: 1, cursor: { id: cursorInt } };
}

function generateOrder(order?: string) {
  if (!order) {
    return {};
  }

  const fields = order.split(",");
  const queryString = fields
    .map((field: string) => field.trim())
    .reduce((acc: Record<string, string>, curr: string): Record<
      string,
      string
    > => {
      const query = curr.split(" ");
      acc[query[0]] = query[1]?.toLowerCase() ?? "asc";

      return acc;
    }, {});

  return { orderBy: queryString };
}

function generateWhere(
  filters?: string,
  search?: string,
  searchableFields?: Array<string>,
) {
  const isSearchableFieldAvailable =
    searchableFields && searchableFields.length > 0;
  if (!filters && !search && !isSearchableFieldAvailable) {
    return {};
  }

  const whereQuery = generateFilter(filters);
  const searchQuery = generateSearch(searchableFields || [], search);
  const isFilterEmpty = whereQuery.length < 1 && searchQuery.length < 1;

  if (isFilterEmpty) {
    return {};
  }

  return {
    where: {
      AND: [...whereQuery, ...searchQuery],
    },
  };
}

function generateFilter(where?: string) {
  if (!where) {
    return [];
  }

  const filterQuery = where.split(" and ").map((filters: string) => {
    // TODO: Implement in, or, not, Precedence grouping ()
    const query = filters.split(" ");
    const field = query[0];
    const operator = query[1];
    const value = query
      .filter((_, index) => index > 1)
      .reduce((acc, curr, index) => {
        if (index === 0) {
          return curr;
        }

        return `${acc} ${curr}`;
      }, "");
    const filter: Record<string, unknown> = {};
    const operatorValue: Record<string, unknown> = {};

    // TODO: Change value based on data type
    operatorValue[operator] = transformFilterValue(value);
    filter[field] = operatorValue;

    return filter;
  });

  return filterQuery;
}

function transformFilterValue(value: string) {
  const isBool = value === "true" || value === "false";
  const integerValue = parseInt(value, 10);
  const isInteger = !isNaN(integerValue);

  if (isBool) {
    return value === "true" ? true : false;
  }
  if (isInteger) {
    return integerValue;
  }

  return value;
}

function generateSearch(
  searchableFields: Array<string>,
  q?: string,
): Record<string, Prisma.StringFilter>[] {
  if (!q) {
    return [];
  }

  const searchQuery = searchableFields.map(searchableFiled => {
    const search: Record<string, Prisma.StringFilter> = {};
    search[searchableFiled] = { contains: q };

    return search;
  });

  return searchQuery;
}

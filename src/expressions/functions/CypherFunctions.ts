/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Variable } from "../../references/Variable";
import { CypherASTNode } from "../../CypherASTNode";
import type { CypherEnvironment } from "../../Environment";
import type { Expr } from "../../types";

/** Represents a Cypher Function, all Cypher functions provided by the library extend from this class, and it can be used to use custom functions
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/)
 * @example
 * ```ts
 * const myFunction = new Cypher.Function("myFunction", [new Cypher.Literal("test"), new Cypher.Param("test2")]);
 * ```
 * _Cypher:_
 * ```cypher
 * myFunction("test", $param0)
 * ```
 */
export class CypherFunction extends CypherASTNode {
    protected name: string;
    private params: Array<Expr>;

    constructor(name: string, params: Array<Expr> = []) {
        super();
        this.name = name;
        this.params = params;
        for (const param of params) {
            if (param instanceof CypherASTNode) {
                this.addChildren(param);
            }
        }
    }

    /** @internal */
    public getCypher(env: CypherEnvironment): string {
        const argsStr = this.serializeParams(env);

        return `${this.name}(${argsStr})`;
    }

    protected serializeParams(env: CypherEnvironment): string {
        return this.params.map((expr) => expr.getCypher(env)).join(", ");
    }
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-coalesce)
 * @group Cypher Functions
 */
export function coalesce(expr: Expr, ...optionalExpr: Expr[]): CypherFunction {
    return new CypherFunction("coalesce", [expr, ...optionalExpr]);
}

// TODO: move point, distance and pointDistance to SpacialFunctions.ts

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/spatial/)
 * @group Cypher Functions
 * @category Spatial
 */
export function point(variable: Expr): CypherFunction {
    return new CypherFunction("point", [variable]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/4.3/functions/spatial/#functions-distance)
 * @group Cypher Functions
 * @category Spatial
 * @deprecated No longer supported in Neo4j 5. Use {@link pointDistance} instead.
 */
export function distance(lexpr: Expr, rexpr: Expr): CypherFunction {
    return new CypherFunction("distance", [lexpr, rexpr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/spatial/#functions-distance)
 * @group Cypher Functions
 * @category Spatial
 * @example Generated Cypher: `point.distance(point1, point2)`
 */
export function pointDistance(lexpr: Expr, rexpr: Expr): CypherFunction {
    return new CypherFunction("point.distance", [lexpr, rexpr]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-randomuuid)
 * @group Cypher Functions
 */
export function randomUUID(): CypherFunction {
    return new CypherFunction("randomUUID");
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-id)
 * @group Cypher Functions
 */
export function id(variable: Expr): CypherFunction {
    return new CypherFunction("id", [variable]);
}

/**
 * @see [Cypher Documentation](https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-elementid)
 * @group Cypher Functions
 */
export function elementId(variable: Expr): CypherFunction {
    return new CypherFunction("elementId", [variable]);
}

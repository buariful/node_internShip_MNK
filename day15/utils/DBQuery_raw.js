const { QueryTypes } = require("sequelize");
const db = require("../models");

class DBQuery {
  constructor(req) {
    this.req = req;
    // this.db = db;
    this.table = req.params.table;
    this.query = req.query;
    this.sql = "SELECT ";
  }

  includeQuery() {
    try {
      if (this.query.include && !this.query.exclude) {
        const include_str = this.query.include
          .split(",")
          .map((str) => `${this.table}.${str}`)
          .join(", ");
        return `${include_str} `;
      } else if (!this.query.include && this.query.exclude) {
        const { exclude } = this.req.query;
        const excludedColumns = exclude ? exclude.split(",") : [];
        const attributes = Object.keys(this.req.model.rawAttributes).filter(
          (attr) => !excludedColumns.includes(attr)
        );

        return `${attributes
          .map((attr) => `${this.table}.${attr}`)
          .join(", ")} `;
      } else {
        return `${this.table}.* `;
      }
    } catch (error) {
      console.log("includeQuery->>", error);
      return "* ";
    }
  }

  joinQuery() {
    try {
      // const db = this.req.app.get("db");
      const joinArr_mod = [];
      const queryJoinArr = Array.isArray(this.query.join)
        ? this.query.join
        : [this.query.join];

      queryJoinArr.map(async (join_tableName) => {
        const JoinModel = db[join_tableName];

        if (
          JoinModel &&
          join_tableName?.toLowerCase() !== this.table?.toLowerCase()
        ) {
          const associationWithMain =
            db[this.table].associations[join_tableName];
          const associationWithJoin =
            db[join_tableName].associations[this.table];

          /* ----- for getting source and foreingkey dynamically--- */
          let sourceKey, foreignKey;
          if (associationWithMain) {
            sourceKey = associationWithMain.sourceKey;
            foreignKey = associationWithMain.foreignKey;
          } else if (associationWithJoin) {
            sourceKey = associationWithJoin.foreignKey;
            foreignKey = associationWithJoin.sourceKey;
          }
          if (sourceKey && foreignKey) {
            joinArr_mod.push(`
            LEFT JOIN "${join_tableName}" AS "${join_tableName}"
            ON "${this.table}"."${sourceKey}" = "${join_tableName}"."${foreignKey}"
          `);
          }
        }
      });

      if (joinArr_mod.length) {
        return `${joinArr_mod.join(" ")}`;
      } else {
        return "";
      }
    } catch (error) {
      console.log("joinQuery->>", error);
      return "";
    }
  }

  filterQuery() {
    try {
      if (this.query.filter) {
        const filterArr_mod = [];
        const queryFilterArr = Array.isArray(this.query.filter)
          ? this.query.filter
          : [this.query.filter];

        queryFilterArr.map((str) => {
          const [field, operator, value] = str.split(",");

          if (operator === "is") {
            filterArr_mod.push(`${field} IS NULL`);
            return;
          }

          if ((field, operator, value)) {
            if (operator === "eq") {
              filterArr_mod.push(`${field} = ${value}`);
              return;
            }
            if (operator === "neq") {
              filterArr_mod.push(`${field} != ${value}`);
              return;
            }
            if (operator === "cs") {
              filterArr_mod.push(`${field} LIKE '%${value}%'`);
              return;
            }
            if (operator === "ncs") {
              filterArr_mod.push(`${field} NOT LIKE '%${value}'`);
              return;
            }
            if (operator === "sw") {
              filterArr_mod.push(`${field} LIKE '${value}%'`);
              return;
            }
            if (operator === "ew") {
              filterArr_mod.push(`${field} LIKE '%${value}'`);
              return;
            }
            if (operator === "lt") {
              filterArr_mod.push(`${field} < ${value}`);
              return;
            }
            if (operator === "le") {
              filterArr_mod.push(`${field} <= ${value}`);
              return;
            }
            if (operator === "gt") {
              filterArr_mod.push(`${field} > ${value}`);
              return;
            }
            if (operator === "bt") {
              const string_split = str.split(",");
              filterArr_mod.push(
                `${field} BETWEEN ${value} AND ${
                  string_split[string_split.length - 1]
                }`
              );
              return;
            }
            if (operator === "in") {
              const values = str.split(",").slice(2).join(",");
              filterArr_mod.push(`${field} IN (${values})`);
              return;
            }
          } else {
            return "";
          }
        });

        return `WHERE ${filterArr_mod.join(" AND ")} `;
      } else {
        return "";
      }
    } catch (error) {
      console.log("filterQuery->>", error);
      return "";
    }
  }

  orderQuery() {
    try {
      if (this.query.order) {
        const orderArr_mod = [];
        const queryOrderArr = Array.isArray(this.query.order)
          ? this.query.order
          : [this.query.order];

        queryOrderArr.map((query) => {
          const [field, direction] = query.split(",");
          if (field && !direction) {
            orderArr_mod.push(`${field}`);
          } else if (
            field &&
            direction &&
            (direction.toLowerCase() === "asc" ||
              direction.toLowerCase() === "desc")
          ) {
            orderArr_mod.push(`${field} ${direction}`);
          }
        });

        if (orderArr_mod.length) {
          return `ORDER BY ${orderArr_mod.join(", ")} `;
        } else {
          return "ORDER BY id DESC ";
        }
      } else {
        return "ORDER BY id DESC ";
      }
    } catch (error) {
      console.log("orderQuery->>", error);
      return "";
    }
  }

  limitQuery() {
    try {
      if (this.query.size && !this.query.page) {
        return `LIMIT ${this.query.size} `;
      } else {
        return "";
      }
    } catch (error) {
      console.log("orderQuery->>", error);
      return "";
    }
  }
  paginationQuery() {
    try {
      if (this.query.page) {
        const [page, customLimit] = this.query.page.split(",");
        const offset = (parseInt(page) - 1) * (customLimit || 10);
        const limit = customLimit ? parseInt(customLimit) : 10;
        return `LIMIT ${limit} OFFSET ${offset} `;
      } else {
        return "";
      }
    } catch (error) {
      console.log("orderQuery->>", error);
      return "";
    }
  }

  buildQuery() {
    const include_query_str = this.includeQuery();
    const join_query_str = this.joinQuery();
    const filter_query_Str = this.filterQuery();
    const order_query_Str = this.orderQuery();
    const limit_query_str = this.limitQuery();
    const pagination_query_str = this.paginationQuery();

    this.sql +=
      include_query_str +
      `FROM ${this.table} ` +
      join_query_str +
      filter_query_Str +
      order_query_Str +
      limit_query_str +
      pagination_query_str;
    console.log(this.sql);
    return this.sql;
  }
}

module.exports = DBQuery;

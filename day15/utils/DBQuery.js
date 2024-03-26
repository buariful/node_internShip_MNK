const { Op } = require("sequelize");
const db = require("../models");

class DBQuery {
  constructor(req) {
    this.req = req;
    this.table = req.params.table;
    this.id = req.params.id;
    this.query = req.query;
    // this.sql = "SELECT ";
  }

  includeQuery() {
    try {
      if (this.query.include && !this.query.exclude) {
        return this.query.include.split(",");
      } else if (!this.query.include && this.query.exclude) {
        const { exclude } = this.req.query;
        const excludedColumns = exclude ? exclude.split(",") : [];
        const attributes = Object.keys(this.req.model.rawAttributes).filter(
          (attr) => !excludedColumns.includes(attr)
        );

        return attributes;
      } else {
        return [];
      }
    } catch (error) {
      console.log("includeQuery->>", error);
      return [];
    }
  }

  joinQuery() {
    try {
      const join = [];
      const queryJoinArr = Array.isArray(this.query.join)
        ? this.query.join
        : [this.query.join];

      queryJoinArr.map(async (join_tableName) => {
        const JoinModel = db[join_tableName];
        if (
          JoinModel &&
          join_tableName.toLowerCase() !== this.table.toLowerCase()
        ) {
          join.push(join_tableName);
        }
      });
      return join;
    } catch (error) {
      console.log("joinQuery->>", error);
      return "";
    }
  }

  filterQuery() {
    try {
      const filter_obj = {};
      if (this.id) {
        filter_obj["id"] = this.id;
      }
      if (this.query.filter) {
        const queryFilterArr = Array.isArray(this.query.filter)
          ? this.query.filter
          : [this.query.filter];

        queryFilterArr.map((str) => {
          const [field, operator, value] = str.split(",");

          if (operator === "is") {
            filter_obj[field] = { [Op.is]: null };
            return;
          }

          if ((field, operator, value)) {
            if (operator === "eq") {
              filter_obj[field] = { [Op.eq]: value };
              return;
            }
            if (operator === "neq") {
              filter_obj[field] = { [Op.ne]: value };
              return;
            }
            if (operator === "cs") {
              filter_obj[field] = { [Op.like]: `%${value}%` };
              return;
            }
            if (operator === "ncs") {
              filter_obj[field] = { [Op.notLike]: `%${value}` };
              return;
            }
            if (operator === "sw") {
              filter_obj[field] = { [Op.startsWith]: `${value}` };
              return;
            }
            if (operator === "ew") {
              filter_obj[field] = { [Op.endsWith]: `${value}` };
              return;
            }
            if (operator === "lt") {
              filter_obj[field] = { [Op.lt]: value };
              return;
            }
            if (operator === "le") {
              filter_obj[field] = { [Op.lte]: value };
              return;
            }
            if (operator === "gt") {
              filter_obj[field] = { [Op.gt]: value };
              return;
            }
            if (operator === "gte") {
              filter_obj[field] = { [Op.gte]: value };
              return;
            }
            if (operator === "bt") {
              const values = str.split(",").slice(2);
              filter_obj[field] = { [Op.between]: values };
              return;
            }
            if (operator === "in") {
              console.log("aise");
              const values = str.split(",").slice(2);
              filter_obj[field] = { [Op.in]: values };
              return;
            }
          } else {
            return "";
          }
        });

        return filter_obj;
      } else {
        return filter_obj;
      }
    } catch (error) {
      console.log("filterQuery->>", error);
      return {};
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
            orderArr_mod.push([field]);
          } else if (
            field &&
            direction &&
            (direction.toLowerCase() === "asc" ||
              direction.toLowerCase() === "desc")
          ) {
            orderArr_mod.push([field, direction]);
          }
        });

        if (orderArr_mod.length) {
          return orderArr_mod;
        } else {
          return [["id", "DESC"]];
        }
      } else {
        return [["id", "DESC"]];
      }
    } catch (error) {
      console.log("orderQuery->>", error);
      return "";
    }
  }

  limitQuery() {
    try {
      if (Number(this.query.size) && !this.query.page) {
        return { limit: Number(this.query.size) };
      } else {
        return null;
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
        return { limit, offset };
      } else {
        return "";
      }
    } catch (error) {
      console.log("orderQuery->>", error);
      return "";
    }
  }

  buildQuery() {
    let build_obj = {};

    if (this.includeQuery().length) {
      build_obj["attributes"] = this.includeQuery();
    }
    if (this.joinQuery().length) {
      build_obj["include"] = this.joinQuery();
    }
    if (this.filterQuery()) {
      build_obj["where"] = this.filterQuery();
    }
    if (this.orderQuery().length) {
      build_obj["order"] = this.orderQuery();
    }
    if (this.limitQuery()) {
      build_obj = { ...build_obj, ...this.limitQuery() };
    }
    if (this.paginationQuery()) {
      build_obj = { ...build_obj, ...this.paginationQuery() };
    }

    console.log(build_obj);
    return build_obj;
  }
}

module.exports = DBQuery;

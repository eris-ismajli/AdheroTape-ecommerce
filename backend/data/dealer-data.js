import db from "../config/db.js";

class DealerData {
  async save(form) {
    const [result] = await db.query(
      "INSERT INTO dealer_applications SET ?",
      form
    );

    return result.insertId;
  }
}

export default new DealerData();

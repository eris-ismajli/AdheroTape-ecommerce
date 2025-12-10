import db from "../config/db.js";

class DealerData {
  save(form) {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO dealer_applications SET ?", form, (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  }
}

export default new DealerData();

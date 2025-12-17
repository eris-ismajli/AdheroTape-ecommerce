import db from "../config/db.js";
// Create a new order
export async function createOrder(order) {
    const { user_id, total, shipping_address, payment_intent_id } = order;
    const [result] = await db.execute(
        `INSERT INTO orders (user_id, total, shipping_address, payment_intent_id) VALUES (?, ?, ?, ?)`,
        [user_id || null, total, JSON.stringify(shipping_address), payment_intent_id]
    );
    return result.insertId;
}

// Add items to an order
export async function addOrderItems(order_id, items) {
    const values = items.map(item => [
        order_id,
        item.product_id,
        item.quantity,
        item.price,
        JSON.stringify(item.chosen_specs || {})
    ]);

    const [result] = await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, chosen_specs) VALUES ?`,
        [values]
    );

    return result;
}

// Update order payment status
export async function updatePaymentStatus(order_id, status) {
    const [result] = await db.execute(
        `UPDATE orders SET payment_status = ?, status = ? WHERE id = ?`,
        [status, status === 'paid' ? 'paid' : 'pending', order_id]
    );
    return result;
}

const delivery = require('../../models/deliveries');

exports.getDelivery = async (req, res, next) => {
    try {
        const deliveryList = await delivery.fetchAll();
        res.status(200).json({ data: deliveryList });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.create = async (req, res, next) => {
    try {
        let customer_name = req.body.customer_name;
        let customer_phone = req.body.customer_phone;
        let milkTea_flavor = req.body.milkTea_flavor;
        let sugar = req.body.sugar;
        let ice = req.body.ice;
        let toppings = req.body.toppings;

        const deliveries = {
            customer_name: customer_name,
            customer_phone: customer_phone,
            milkTea_flavor: milkTea_flavor,
            sugar: sugar,
            ice: ice,
            toppings: toppings,
        };
        const add = await delivery.add(deliveries);
        res.status(200).json({
            data: add,
            message: 'Giao hàng đã được thêm thành công'
        });
    } catch (error) {
        console.error("Lỗi khi thêm đơn giao:", error);
        res.status(500).json({ error: 'Lỗi Máy Chủ Nội Bộ' });
    }
};
exports.edit = async (req, res, next) => {
    try {
        const id = req.params.id;
        const deliveries = await delivery.fetchById(id);
        res.status(200).json({ data: deliveries });
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tài khoản:', error);
        res.status(500).json({ error: 'Lỗi Máy Chủ Nội Bộ' });
    }
}
exports.update = async (req, res, next) => {
    try {
        const d_id = req.params.id;
        let customer_name = req.body.customer_name;
        let customer_phone = req.body.customer_phone;
        let milkTea_flavor = req.body.milkTea_flavor;
        let sugar = req.body.sugar;
        let ice = req.body.ice;
        let toppings = req.body.toppings;

        const deliveries = {
            customer_name: customer_name,
            customer_phone: customer_phone,
            milkTea_flavor: milkTea_flavor,
            sugar: sugar,
            ice: ice,
            toppings: toppings,
        };
        await delivery.update(d_id, deliveries);
        res.status(200).json({ message: 'Giao hàng đã được cập nhật thành công' });
    } catch (error) {
        console.error("Lỗi khi cập nhật đơn giao:", error);
        res.status(500).json({ error: 'Lỗi Máy Chủ Nội Bộ' });
    }
};
exports.delete = async (req, res, next) => {
    try {
        const delivery_id = req.params.id;
        const data = await delivery.delete(delivery_id);
        res.status(200).json({ data: data,  message: 'Xóa thành công!!!' })
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: 'Lỗi khi xóa'
        });
    }
}
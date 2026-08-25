import Sale from "../models/Sale.model.js";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import SaleDetail from "../models/SaleDetail.model.js";
import sequelize from "../config/db.js";
import { Op, literal } from "sequelize";

// GET ALL SALES
export const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.findAll({
            attributes: { exclude: ["userId"]},
            include: [
                {
                    model: User,
                    as: "customer",
                    attributes: ["id", "firstName", "lastName", "rut"]
                }
            ]
        });

        res.json({
            status: "success",
            sales,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener las ventas registras",
            error: error.message,
        });
    }
};

// GET  SALES BY ID
export const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await Sale.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "customer",
                    attributes: ["id", "firstName", "lastName", "rut"]
                },
                {
                    model: SaleDetail,
                    as: "details",
                    attributes: {exclude: ["saleId"]}
                }
            ]
        });

        if (!sale) {
            return res.status(404).json({
                status: "fail",
                message: `No se encontró ninguna venta registrada con el id ${id}`,
            });
        }

        res.status(200).json({
            status: "success",
            sale,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener la venta",
            error: error.message,
        });
    }
};

// CREATE NEW SALE
// export const createSale = async (req, res) => {
//     const t = await sequelize.transaction();
//     try {
//         let { userId, cart } = req.body;

//         if (!userId || !cart || !Array.isArray(cart) || cart.length == 0) {
//             await t.rollback();
//             return res.status(400).json({
//                 status: "fail",
//                 message: `No se proporcionan los campos requeridos o con el formato correcto.`,
//             });
//         }

//         let total = 0;
//         let saleDetails = [];
//         //1. OBTENER PRODUCTOS Y DESCONTAR STOCKS

//         for (const item of cart) {
//             let { productId, quantity } = item;

//             const product = await Product.findByPk(productId);

//             if (product.stock < quantity) {
//                 await t.rollback();
//                 return res.status(400).json({
//                     status: "fail",
//                     message: `Uno o más productos no tienen el stock suficiente, actualice la página para verificar stocks actuales.`,
//                 });
//             }

//             await product.decrement({ stock: quantity }, {transaction: t});

//             let subtotal = quantity * product.price;

//             total += subtotal;
//             //CREAMOS EL DETALLE DE VENTA SIN ID VENTA
//             let detailSale = {
//                 productId,
//                 productName: product.name,
//                 quantity,
//                 price: product.price,
//                 subtotal
//             };

//             saleDetails.push(detailSale);
//         }

//         //2. CREAR VENTA

//         const sale = await Sale.create({userId, total}, {transaction: t});

//         //3. REGISTRAR LOS DETALLES DE VENTA

//         //SE AGREGAN A CADA REGISTRO EL ID DE LA VENTA
//         saleDetails = saleDetails.map(sd => {
//             return { saleId: sale.id, ...sd}
//         });

//         //CREAMOS REGISTROS DE DETALLE VENTA DE FORMA MASIVA
//         await SaleDetail.bulkCreate(saleDetails, { transaction: t});

//         await t.commit();
//         res.status(201).json({
//             status: "success",
//             message: "Venta creada exitosamente con ID: " + sale.id,
//         });
//     } catch (error) {
//         console.log(error);
//         await t.rollback();
//         if (error.name === "SequelizeValidationError") {
//             const errors = error.errors.map((err) => err.message);
//             return res.status(400).json({
//                 status: "fail",
//                 errors,
//             });
//         }

//         res.status(500).json({
//             status: "error",
//             message: "Error al crear la Venta",
//             error: error.message,
//         });
//     }
// };


export const createSale = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { userId, cart } = req.body;

        if (!userId || !Array.isArray(cart) || cart.length === 0) {
            await t.rollback();
            return res.status(400).json({
                status: "fail",
                message: "No se proporcionan los campos requeridos o con el formato correcto.",
            });
        }

        // 1. OBTENER TODOS LOS IDs Y MAPEAR CANTIDADES SOLICITADAS
        const cartMap = new Map();

        for (const item of cart) {
            if (!item.productId || !item.quantity || item.quantity <= 0) {
                await t.rollback();
                return res.status(400).json({
                    status: "fail",
                    message: "Cada artículo debe tener un 'productId' y una 'quantity' mayor a 0.",
                });
            }
            cartMap.set(item.productId, (cartMap.get(item.productId) || 0) + item.quantity);
        }

        // 2. CONSULTA EN LOTE CON BLOQUEO PESIMISTA (1 sola query)
        const products = await Product.findAll({
            where: {
                id: { [Op.in]: Array.from(cartMap.keys()) },
            },
            transaction: t,
            lock: t.LOCK.UPDATE, // Evita concurrencia/lecturas sucias de stock
        });

        // Validar que todos los productos existan en la base de datos
        if (products.length !== cartMap.size) {
            await t.rollback();
            return res.status(404).json({
                status: "fail",
                message: "Uno o más productos no existen en la base de datos.",
            });
        }

        // 3. VALIDAR STOCK Y PREPARAR ESTRUCTURAS EN MEMORIA
        let total = 0;
        const saleDetailsData = [];
        const cases = [];

        for (const product of products) {
            const requestedQty = cartMap.get(product.id);

            if (product.stock < requestedQty) {
                await t.rollback();
                return res.status(400).json({
                    status: "fail",
                    message: `Stock insuficiente para '${product.name}'. Disponible: ${product.stock}, Solicitado: ${requestedQty}.`,
                });
            }

            const price = parseFloat(product.price);
            total += requestedQty * price;

            // Datos para la tabla detalle_ventas
            saleDetailsData.push({
                productId: product.id,
                productName: product.name,
                quantity: requestedQty,
                price: price,
                subtotal: price * requestedQty
            });

            // Expresión SQL CASE para actualizar stock por lote
            cases.push(`WHEN ${product.id} THEN stock - ${requestedQty}`);
        }

        // 4. ACTUALIZACIÓN MASIVA DE STOCK (1 sola query UPDATE)
        const caseSql = `CASE id ${cases.join(" ")} END`;
        await Product.update(
            { stock: literal(caseSql) },
            {
                where: { id: { [Op.in]: Array.from(cartMap.keys()) } },
                transaction: t,
            }
        );

        // 5. CREAR VENTA CABECERA (1 sola query INSERT)
        const sale = await Sale.create(
            { userId, total: Number(total.toFixed(2)) },
            { transaction: t }
        );

        // 6. CREAR DETALLES DE VENTA EN LOTE (1 sola query INSERT)
        const formattedDetails = saleDetailsData.map((detail) => ({
            saleId: sale.id,
            ...detail,
        }));

        await SaleDetail.bulkCreate(formattedDetails, { transaction: t });

        await t.commit();

        return res.status(201).json({
            status: "success",
            message: `Venta creada exitosamente con ID: ${sale.id}`,
            data: {
                saleId: sale.id,
                total: Number(total.toFixed(2)),
            },
        });
    } catch (error) {
        await t.rollback();
        console.error(error);

        if (error.name === "SequelizeValidationError") {
            const errors = error.errors.map((err) => err.message);
            return res.status(400).json({
                status: "fail",
                errors,
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Error al crear la venta",
            error: error.message,
        });
    }
};
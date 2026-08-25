import User from "./User.model.js";
import Profile from "./Profile.model.js";
import Product from "./Product.model.js";
import Category from "./Category.model.js";
import Sale from "./Sale.model.js";
import SaleDetail from "./SaleDetail.model.js";

//RELACIONES

//RELACIÓN 1 A 1 ENTRE USER Y PROFILE

/*
https://sequelize.org/docs/v6/core-concepts/assocs/#foohasonebar
Foo.hasOne(Bar)
fooInstance.getBar()
fooInstance.setBar()
fooInstance.createBar()
*/
User.hasOne(Profile, {
    foreignKey: "id",
    as: "profile",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

//The possible choices are RESTRICT, CASCADE, NO ACTION, SET DEFAULT and SET NULL.

Profile.belongsTo(User, {
    foreignKey: "id",
    as: "user",
});

//RELACIÓN 1 A MUCHOS
//RELACIONAMOS EL MODELO PRODUCT CON CATEGORY
Category.hasMany(Product, {
    as: "products",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
});
Product.belongsTo(Category, {
    as: "category",
    foreignKey: "categoryId",
});

//RELACIÓN ENTRE SALE Y USER
User.hasMany(Sale, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    as: "orders",
    foreignKey: "userId",
});
Sale.belongsTo(User, {
    as: "customer",
    foreignKey: "userId",
});

//RELACIONES MUCHOS A MUCHOS
// Product.belongsToMany(Sale, { through: "SaleDetails"});
// Sale.belongsToMany(Product, {through: "SaleDetails"});

//RELACONES 1 A MUCHOS PATABLA DETALLE VENTAS
Product.hasMany(SaleDetail, {
    as: "saleDetails",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
});
SaleDetail.belongsTo(Product, {
    as: "product",
    foreignKey: "productId",
});

Sale.hasMany(SaleDetail, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "details",
    foreignKey: "saleId",
});
SaleDetail.belongsTo(Sale, {
    as: "sale",
    foreignKey: "saleId",
});

export default {
    User,
    Profile,
    Product,
    Category,
    Sale,
    SaleDetail,
};

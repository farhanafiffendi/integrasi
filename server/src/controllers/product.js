const { product, user, product_category, category } = require("../../models");

exports.getProduct = async (req, res) => {
    try {
        let data = await product.findAll({
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: product_category,
                        as: "bridge",
                        attributes: [],
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                image: process.env.FILE_PATH + item.image,
            }
        });


        res.send({
            status: "success...",
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.addProduct = async (req, res) => {
    try {
        let { categoryId } = req.body;

        if (categoryId) {
            categoryId = categoryId.split(',');
        }

        const data = {
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            image: req.file.filename,
            qty: req.body.qty,
            idUser: req.user.id,
        };

        let newProduct = await product.create(data);

        if (categoryId) {
            const productCategoryData = categoryId.map((item) => {
                return { idProduct: newProduct.id, idCategory: parseInt(item) };
            });

            await product_category.bulkCreate(productCategoryData);
        }

        let productData = await product.findOne({
            where: {
                id: newProduct.id,
            },
            include: [
                {
                    model: user,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                },
                {
                    model: category,
                    as: 'categories',
                    through: {
                        model: product_category,
                        as: 'bridge',
                        attributes: [],
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'idUser'],
            },
        });
        productData = JSON.parse(JSON.stringify(productData));

        res.send({
            status: 'success...',
            data: {
                ...productData,
                image: process.env.FILE_PATH + productData.image,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'failed',
            message: 'Server Error',
        });
    }
};

exports.getDetailProduct = async (req, res) => {
    try {
        const { id } = req.params;

        let data = await product.findOne({
            where: { id },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: product_category,
                        as: "bridge",
                        attributes: {},
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });

        data = JSON.parse(JSON.stringify(data))

        data = {
            ...data,
            image: process.env.FILE_PATH + data.image,
        }

        res.send({
            status: "success",
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        await product.update(
            {
                ...data,
                image: req.file.filename,
                idUser: req.user.id, //dari token
            },

            {
                where: { id },
            },
        );

        res.send({
            status: "success",
            message: `Update product id: ${id} finished`,
            data: {
                image: req.file.filename,
                desc: req.body.desc,
                name: req.body.name,
                price: req.body.price,
                idUser: req.user.id,
                qty: req.body.qty,
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await product.destroy({
            where: {
                id,
            },
        });

        res.send({
            status: "success",
            message: `Delete product id: ${id} finished`,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};
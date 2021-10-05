const express = require("express")
const router = express.Router();

const { QueryTypes } = require("sequelize")
const { sequelize } = require("../models/index")

const { validateToken } = require("../middlewares/authenticateUser")

router.get("/all/:userId", validateToken, async (req, res) => {
    const { userId } = req.params;

    await sequelize
        .query("SELECT * FROM sets where userId = ?", {
            replacements: [userId],
            type: QueryTypes.SELECT,
        })
        .then((data) => {
            console.log(`sending back`, data)
            res.json({
                status: 'success',
                length: data.length,
                setsList: data
            })
        })
        .catch((error) => {
            console.log(error);
        });
})
router.get("/:folderId", validateToken, async (req, res) => {
    const { folderId } = req.params;

    await sequelize
        .query("SELECT * FROM sets where folderId = ?", {
            replacements: [folderId],
            type: QueryTypes.SELECT,

        })
        .then((data) => {
            res.json({
                status: 'success',
                length: data.length,
                setsList: data
            })
        })
        .catch((error) => {
            console.log(error);
        });
})

router.post("/", validateToken, async (req, res) => {
    const { setName, folderId, userId } = req.body
    console.log(setName, folderId, userId)
    await sequelize
        .query("INSERT INTO sets (name, folderId, numCards, userId) VALUES (?, ?, ?, ?)", {
            replacements: [setName, folderId, 0, userId],
        })
        .then((data) => {
            res.json({
                status: 'success',
                data,
                set: {
                    name: setName,
                    folderId,
                    numCards: 0,
                }
            })
        })
        .catch((error) => {
            console.log(error);
        });
    if (folderId) {
        await sequelize
            .query("UPDATE folders SET numSets = numSets + 1 WHERE id = ?;", {
                replacements: [folderId],
            })
            .then((data) => {
                res.json({
                    status: 'success',
                    data,
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }

})

router.put("/", validateToken, async (req, res) => {
    const { newSetName, id } = req.body
    console.log('in backend')
    await sequelize
        .query("UPDATE sets SET name = ? WHERE id = ?", {
            replacements: [newSetName, id],
        })
        .then((data) => {
            res.json({
                status: 'success',
                data
            })
        })
        .catch((error) => {
            console.log(error);
        });
})

router.delete("/:id/:folderId", validateToken, async (req, res) => {
    const { id, folderId } = req.params
    await sequelize
        .query("DELETE FROM sets WHERE id = ?", {
            replacements: [id],
        })
        .then((data) => {
            res.json({
                status: 'success',
                data
            })
        })
        .catch((error) => {
            console.log(error);
        });

    await sequelize
        .query("UPDATE folders SET numSets = numSets - 1 WHERE id = ?;", {
            replacements: [folderId],
        })
        .then((data) => {
            res.json({
                status: 'success',
                data,
            })
        })
        .catch((error) => {
            console.log(error);
        });
})

module.exports = router


const express = require("express")
const router = express.Router();

const { QueryTypes } = require("sequelize")
const { sequelize } = require("../models/index")

const { validateToken } = require("../middlewares/authenticateUser")

router.get("/:userId", validateToken, async (req, res) => {
    console.log('in here')
    const {userId} = req.params;
    await sequelize
        // Don't limit 10 because the function that fetches this end point
        // is passed to other components
        .query("SELECT * FROM folders WHERE userId = ?", { 
            replacements: [userId],
            type: QueryTypes.SELECT,

        })
        .then((data) => {
            console.log(data)
            res.json({
                status: 'success',
                length: data.length,
                foldersList: data,
            })
        })
        .catch((error) => {
            console.log(error);
        });
})

router.post("/", validateToken, async (req, res) => {
    const { folderName, userId } = req.body
    await sequelize
        .query("INSERT INTO folders (name, userId, numSets) VALUES (?, ?, ?)", {
            replacements: [folderName, userId, 0],
        })
        .then((data) => {
            res.json({
                status: 'success',
                data,
                folder: {
                    name: folderName,
                    userId,
                    numSets: 0
                }
            })
        })
        .catch((error) => {
            console.log(error);
        });
})

router.put("/", validateToken, async (req, res) => {
    const { newFolderName, id } = req.body
    await sequelize
        .query("UPDATE folders SET name = ? WHERE id = ?", {
            replacements: [newFolderName, id],
        })
        .then((data) => {
            res.json({
                status: 'success',
                data,
                folder: {
                    name: newFolderName,
                    id,
                }
            })
        })
        .catch((error) => {
            console.log(error);
        });
})

router.delete("/:id", validateToken, async (req, res) => {
    const { id } = req.params
    await sequelize
        .query("DELETE FROM folders WHERE id = ?", {
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
})

module.exports = router



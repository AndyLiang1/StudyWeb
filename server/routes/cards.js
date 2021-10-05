const express = require("express")
const router = express.Router();

const { QueryTypes } = require("sequelize")
const { sequelize } = require("../models/index")

const { validateToken } = require("../middlewares/authenticateUser")

router.get("/:setId", validateToken, async (req, res) => {
    const { setId } = req.params;

    await sequelize
        .query("SELECT * FROM cards WHERE setId = ?", {
            replacements: [setId],
            type: QueryTypes.SELECT,
        })
        .then((data) => {
            console.log(data)
            res.json({
                status: 'success',
                length: data.length,
                cardsList: data
            })
        })
        .catch((error) => {
            console.log(error);
        });
})

router.post("/", validateToken, async (req, res) => {
    const { question, answer, setId } = req.body
    await sequelize
        .query("INSERT INTO cards (question, answer, setId) VALUES (?, ?, ?)", {
            replacements: [question, answer, setId],
        })
        .then((data) => {
            res.json({
                status: 'success',
                data,
                card: {
                    question,
                    answer,
                    setId,
                }

            })
        })
        .catch((error) => {
            console.log(error);
        });

    await sequelize
        .query("UPDATE sets SET numCards = numCards + 1 WHERE id = ?;", {
            replacements: [setId]
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

router.put("/", validateToken, async (req, res) => {
    const { newQuestion, newAnswer, id } = req.body
    await sequelize
        .query("UPDATE cards SET question = ?, answer = ? WHERE id = ?", {
            replacements: [newQuestion, newAnswer, id],
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

router.delete("/:id/:setId", validateToken, async (req, res) => {
    const { id, setId } = req.params
    await sequelize
        .query("DELETE FROM cards WHERE id = ?", {
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
        .query("UPDATE sets SET numCards = numCards - 1 WHERE id = ?;", {
            replacements: [setId]
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



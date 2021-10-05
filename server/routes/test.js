const express = require("express");
const router = express.Router();

const { QueryTypes } = require("sequelize")
const { sequelize } = require("../models/index");

/*
 * These routes are used for testing. Hence, they have very little documentation.
 */

// =============================================================================
// Clear tables
// =============================================================================

router.delete("/clearUsers", async (req, res) => {
    await sequelize.query("DELETE FROM users")
    .then((data) => {
        res.json({
            status: 'success',
            data
        })
    }).catch((error) => {
        res.json({
            status: 'fail',
            error
        })
    });

});

router.delete("/clearFolders", async (req, res) => {
    await sequelize.query("DELETE FROM folders")
    .then((data) => {
        res.json({
            status: 'success',
            data
        })
    }).catch((error) => {
        res.json({
            status: 'fail', 
            error
        })
    });
});

router.delete("/clearSets", async (req, res) => {
    await sequelize.query("DELETE FROM sets")
    .then((data) => {
        res.json({
            status: 'success',
            data
        })
    }).catch((error) => {
        res.json({
            status: 'fail', 
            error
        })
    });
});


router.delete("/clearCards", async (req, res) => {
    await sequelize.query("DELETE FROM cards")
    .then((data) => {
        res.json({
            status: 'success',
            data
        })
    }).catch((error) => {
        res.json({
            status: 'fail',
            error
        })
    });
});

router.get("/users/:email",  async (req, res) => {
    const {email} = req.params;
    await sequelize
        .query("SELECT * FROM users WHERE email = ? ", {
            replacements: [email],
        })
        .then((data) => {
            res.json({
                status: 'success',
                length: data[0].length,
                data,
            })
        })
        .catch((error) => {
            console.log(error);
        });
})

module.exports = router
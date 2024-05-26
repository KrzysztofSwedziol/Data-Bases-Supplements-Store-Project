import express from 'express';
const router = express.Router();

//Routes
router.get("/", (req, res) => {
    res.render("index");
});

export default router; 

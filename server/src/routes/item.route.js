import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { itemController } from "../controllers/item.controller.js";

const router = Router();

router.post("/add-item",
    upload.fields([
        { name: "coverImage", maxCount: 2 },
        { name: "additionalImages", maxCount: 5 },
    ]),
    itemController.addItem
);

router.get("/get-items", itemController.getItems);
router.put("/update-item/:id", itemController.updateItem);
router.delete("/delete-item/:id", itemController.deleteItem);
router.post("/send-enquire-email", itemController.SendEnquireEmail);

export default router;
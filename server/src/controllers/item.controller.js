import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import Item from "../models/item.model.js";
import { EnquiryEmail } from "../../emails/EnquireEmail.js";
import { SendEmail } from "../utils/SendEmail.js";

const addItem = asyncHandler(async (req, res) => {
    const { name, type, description } = req.body;

    if (!name || !type || !description) {
        throw new ApiError(400, "All fields are required.");
    }

    if (!req.files) {
        throw new ApiError(400, "Cover image is required.");

    }
    const { coverImage, additionalImages } = req.files;

    if (!coverImage) {
        throw new ApiError(400, "Cover image is required.");
    }

    const coverImageResponse = await uploadOnCloudinary(coverImage[0].path, "image");

    let additionalImagesResponse;
    if (additionalImages) {
        additionalImagesResponse = await Promise.all(
            additionalImages.map((image) => uploadOnCloudinary(image.path, "image"))
        )
    }

    const item = await Item.create({
        name,
        type,
        description,
        coverImage: coverImageResponse.secure_url,
        additionalImages: additionalImagesResponse?.map(
            (image) => image.secure_url
        ),
    });

    res.status(201).json(new ApiResponse(201, "Item added successfully", item));

});

const deleteItem = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
        throw new ApiError(404, "Item not found.");
    }

    await deleteOnCloudinary(item.coverImage);
    await Promise.all(
        item.additionalImages.map((image) => deleteOnCloudinary(image))
    );

    await Item.findByIdAndDelete(id);

    res.status(200).json(new ApiResponse(200, "Item deleted successfully"));
});

const getItems = asyncHandler(async (req, res) => {
    const items = await Item.find();

    if (!items) {
        throw new ApiError(404, "Items not found.");
    }
    res.status(200).json(new ApiResponse(200, "Items fetched successfully", items));
});

const updateItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, type, description } = req.body;

    const item = await Item.findById(id);

    if (!item) {
        throw new ApiError(404, "Item not found.");
    }

    item.name = name;
    item.type = type;
    item.description = description;

    await item.save();

    res.status(200).json(new ApiResponse(200, "Item updated successfully", item));
});

const SendEnquireEmail = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required.");
    }

    try {
        await SendEmail("Enquiry", email, EnquiryEmail({ email }));
    } catch (error) {
        // console.log(error);
        throw new ApiError(500, "Email sending failed.");
    }

    res.status(200).json(new ApiResponse(200, "Email sent successfully"));
});

export const itemController = {
    addItem,
    deleteItem,
    updateItem,
    getItems,
    SendEnquireEmail
};


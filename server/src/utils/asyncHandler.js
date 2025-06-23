const asyncHandler = (fx) => async (req, res, next) => {
    try {
        await fx(req, res, next);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

export { asyncHandler };
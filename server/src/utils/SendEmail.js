import { Resend } from './Resend.js';
import { ApiError } from './ApiError.js';

export const SendEmail = async (
    title,
    email,
    htmlContent
) => {
    const { error } = await Resend.emails.send({
        from: 'Items Test <onboarding@resend.dev>',
        to: email,
        subject: title,
        html: htmlContent,
    });

    if (error) {
        throw new ApiError(400, `Email sending failed: ${error.message}`);
    }
};

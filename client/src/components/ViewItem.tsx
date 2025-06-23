import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendEnquireEmail } from "@/api/itemApi";
import Spinner from "./Spinner";

export function ViewItemDialog({ open, onOpenChange, item }: any) {
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);

    if (!item) return null;

    const handleEnquire = async () => {
        if (!email) return toast.error("Please enter your email.");

        try {
            setIsSending(true);
            await sendEnquireEmail({ email });
            toast.success("Enquiry sent successfully!");
            setEmail("");
        } catch (error) {
            toast.error("Failed to send enquiry.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{item.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <img
                        src={item.coverImage}
                        alt={item.name}
                        className="rounded-md w-full h-64 object-cover"
                    />

                    <div>
                        <Badge variant="outline">{item.type}</Badge>
                    </div>

                    <p className="text-sm text-gray-700">{item.description}</p>

                    {item.additionalImages?.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                            {item.additionalImages.map((img: string, idx: number) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`additional-${idx}`}
                                    className="rounded-md object-cover h-24 w-full"
                                />
                            ))}
                        </div>
                    )}

                    {/* Email + Button */}
                    <div className="space-y-2 pt-4">
                        <Input
                            placeholder="Your email to enquire"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                        />
                        <Button
                            onClick={handleEnquire}
                            disabled={isSending}
                            className="w-full"
                        >
                            {isSending ? <Spinner /> : "Send Enquiry"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
